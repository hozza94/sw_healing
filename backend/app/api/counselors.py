from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.counselor import Counselor
from ..models.user import User
from ..schemas.counselor import CounselorCreate, CounselorUpdate, Counselor as CounselorSchema, CounselorList
from ..dependencies import get_current_active_user, get_current_admin_user

router = APIRouter(prefix="/counselors", tags=["상담사"])


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