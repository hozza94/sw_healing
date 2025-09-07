from fastapi import APIRouter, Depends, HTTPException, status, Query, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from pathlib import Path
from ..database import get_db
from ..models.counselor import Counselor
from ..models.user import User
from ..schemas.counselor import CounselorCreate, CounselorUpdate, Counselor as CounselorSchema, CounselorList
from ..dependencies import get_current_active_user, get_current_admin_user

router = APIRouter(prefix="/counselors", tags=["상담사"])

# 업로드 폴더 설정
UPLOAD_DIR = Path("uploads/profile_images")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# 허용된 이미지 타입
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/", response_model=CounselorSchema)
def create_counselor(
    counselor_data: CounselorCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """상담사 생성 (관리자만)"""
    # 이메일 중복 확인
    existing_counselor = db.query(Counselor).filter(Counselor.email == counselor_data.email).first()
    if existing_counselor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 등록된 이메일입니다."
        )
    
    db_counselor = Counselor(**counselor_data.dict())
    db.add(db_counselor)
    db.commit()
    db.refresh(db_counselor)
    
    return db_counselor


@router.get("/", response_model=CounselorList)
def get_counselors(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    is_online: Optional[bool] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """상담사 목록 조회"""
    try:
        query = db.query(Counselor)
        
        if is_online is not None:
            query = query.filter(Counselor.is_online == is_online)
        
        if is_active is not None:
            query = query.filter(Counselor.is_active == is_active)
        
        total = query.count()
        counselors = query.offset(skip).limit(limit).all()
        
        return CounselorList(
            counselors=counselors,
            total=total,
            page=skip // limit + 1,
            size=limit
        )
    except Exception as e:
        print(f"상담사 목록 조회 오류: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"상담사 목록을 가져오는데 실패했습니다: {str(e)}"
        )


@router.get("/online", response_model=CounselorList)
def get_online_counselors(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """온라인 상담사 목록 조회"""
    query = db.query(Counselor).filter(Counselor.is_online == True, Counselor.is_active == True)
    
    total = query.count()
    counselors = query.offset(skip).limit(limit).all()
    
    return CounselorList(
        counselors=counselors,
        total=total,
        page=skip // limit + 1,
        size=limit
    )


@router.get("/{counselor_id}", response_model=CounselorSchema)
def get_counselor(
    counselor_id: int,
    db: Session = Depends(get_db)
):
    """상담사 상세 조회"""
    counselor = db.query(Counselor).filter(Counselor.id == counselor_id).first()
    
    if not counselor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="상담사를 찾을 수 없습니다."
        )
    
    return counselor


@router.put("/{counselor_id}", response_model=CounselorSchema)
def update_counselor(
    counselor_id: int,
    counselor_update: CounselorUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """상담사 정보 수정 (관리자만)"""
    counselor = db.query(Counselor).filter(Counselor.id == counselor_id).first()
    
    if not counselor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="상담사를 찾을 수 없습니다."
        )
    
    update_data = counselor_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(counselor, field, value)
    
    db.commit()
    db.refresh(counselor)
    
    return counselor


@router.delete("/{counselor_id}")
def delete_counselor(
    counselor_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """상담사 삭제 (관리자만)"""
    counselor = db.query(Counselor).filter(Counselor.id == counselor_id).first()
    
    if not counselor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="상담사를 찾을 수 없습니다."
        )
    
    db.delete(counselor)
    db.commit()
    
    return {"message": "상담사가 삭제되었습니다."} 


@router.patch("/{counselor_id}/toggle-status")
@router.put("/{counselor_id}/toggle-status")
def toggle_counselor_status(
    counselor_id: int,
    db: Session = Depends(get_db)
):
    """상담사 활성/비활성 상태 토글 (공개 API) - PATCH/PUT 모두 지원"""
    counselor = db.query(Counselor).filter(Counselor.id == counselor_id).first()
    
    if not counselor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="상담사를 찾을 수 없습니다."
        )
    
    # 상태 토글
    counselor.is_active = not counselor.is_active
    db.commit()
    db.refresh(counselor)
    
    return {
        "message": f"상담사가 {'활성화' if counselor.is_active else '비활성화'}되었습니다.",
        "counselor_id": counselor_id,
        "is_active": counselor.is_active
    } 


@router.post("/upload-image")
async def upload_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """프로필 이미지 업로드"""
    try:
        # 파일 타입 검증
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="지원되지 않는 파일 형식입니다. JPG, PNG, WebP만 허용됩니다."
            )
        
        # 파일 크기 검증
        file_size = 0
        file.file.seek(0, 2)  # 파일 끝으로 이동
        file_size = file.file.tell()
        file.file.seek(0)  # 파일 시작으로 복귀
        
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="파일 크기가 너무 큽니다. 5MB 이하만 허용됩니다."
            )
        
        # 파일명 생성 (중복 방지)
        file_extension = file.filename.split(".")[-1]
        import uuid
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # 파일 저장
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 상대 경로 반환 (프론트엔드에서 접근 가능한 형태)
        relative_path = f"/uploads/profile_images/{unique_filename}"
        
        return {
            "message": "이미지가 성공적으로 업로드되었습니다.",
            "image_url": relative_path,
            "filename": unique_filename
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"이미지 업로드에 실패했습니다: {str(e)}"
        ) 