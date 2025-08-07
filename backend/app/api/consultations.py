from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.consultation import Consultation, ConsultationStatus
from ..models.user import User
from ..schemas.consultation import ConsultationCreate, ConsultationUpdate, Consultation as ConsultationSchema, ConsultationList
from ..dependencies import get_current_active_user, get_current_admin_user

router = APIRouter(prefix="/consultations", tags=["상담 신청"])


@router.post("/", response_model=ConsultationSchema)
def create_consultation(
    consultation_data: ConsultationCreate,
    db: Session = Depends(get_db)
):
    """상담 신청 생성 (인증 없이 가능)"""
    # 임시로 user_id를 1로 설정 (기본 사용자)
    db_consultation = Consultation(
        user_id=1,  # 기본 사용자 ID
        **consultation_data.dict()
    )
    
    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)
    
    return db_consultation


@router.get("/", response_model=ConsultationList)
def get_consultations(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[ConsultationStatus] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """사용자의 상담 신청 목록 조회"""
    query = db.query(Consultation).filter(Consultation.user_id == current_user.id)
    
    if status:
        query = query.filter(Consultation.status == status)
    
    total = query.count()
    consultations = query.offset(skip).limit(limit).all()
    
    return ConsultationList(
        consultations=consultations,
        total=total,
        page=skip // limit + 1,
        size=limit
    )


@router.get("/public", response_model=ConsultationList)
def get_public_consultations(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[ConsultationStatus] = None,
    db: Session = Depends(get_db)
):
    """공개 상담 신청 목록 조회 (인증 없이 가능)"""
    query = db.query(Consultation)
    
    if status:
        query = query.filter(Consultation.status == status)
    
    total = query.count()
    consultations = query.offset(skip).limit(limit).all()
    
    return ConsultationList(
        consultations=consultations,
        total=total,
        page=skip // limit + 1,
        size=limit
    )


@router.get("/admin", response_model=ConsultationList)
def get_all_consultations(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[ConsultationStatus] = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """관리자용 전체 상담 신청 목록 조회"""
    query = db.query(Consultation)
    
    if status:
        query = query.filter(Consultation.status == status)
    
    total = query.count()
    consultations = query.offset(skip).limit(limit).all()
    
    return ConsultationList(
        consultations=consultations,
        total=total,
        page=skip // limit + 1,
        size=limit
    )


@router.get("/{consultation_id}", response_model=ConsultationSchema)
def get_consultation(
    consultation_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """상담 신청 상세 조회"""
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="상담 신청을 찾을 수 없습니다."
        )
    
    # 본인의 상담 신청이거나 관리자인 경우만 조회 가능
    if consultation.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    return consultation


@router.put("/{consultation_id}", response_model=ConsultationSchema)
def update_consultation(
    consultation_id: int,
    consultation_update: ConsultationUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """상담 신청 수정"""
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="상담 신청을 찾을 수 없습니다."
        )
    
    # 본인의 상담 신청이거나 관리자인 경우만 수정 가능
    if consultation.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    # 일반 사용자는 상태를 수정할 수 없음
    if not current_user.is_admin and consultation_update.status is not None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="상태는 관리자만 수정할 수 있습니다."
        )
    
    update_data = consultation_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(consultation, field, value)
    
    db.commit()
    db.refresh(consultation)
    
    return consultation


@router.delete("/{consultation_id}")
def delete_consultation(
    consultation_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """상담 신청 삭제"""
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="상담 신청을 찾을 수 없습니다."
        )
    
    # 본인의 상담 신청이거나 관리자인 경우만 삭제 가능
    if consultation.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    db.delete(consultation)
    db.commit()
    
    return {"message": "상담 신청이 삭제되었습니다."} 