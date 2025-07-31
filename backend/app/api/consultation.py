from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models import ConsultationRequest, ConsultationSession, User
from app.schemas import (
    ConsultationRequestCreate,
    ConsultationRequestUpdate,
    ConsultationRequestResponse,
    ConsultationSessionCreate,
    ConsultationSessionUpdate,
    ConsultationSessionResponse,
    ConsultationListResponse,
    ConsultationStats
)

router = APIRouter(prefix="/consultations", tags=["상담"])

@router.post("/", response_model=ConsultationRequestResponse)
async def create_consultation(
    consultation: ConsultationRequestCreate,
    db: Session = Depends(get_db)
):
    """상담 신청"""
    db_consultation = ConsultationRequest(**consultation.dict())
    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)
    return db_consultation

@router.get("/", response_model=ConsultationListResponse)
async def get_consultations(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status_filter: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """상담 목록 조회"""
    query = db.query(ConsultationRequest)
    
    if status_filter:
        query = query.filter(ConsultationRequest.status == status_filter)
    
    total = query.count()
    consultations = query.offset(skip).limit(limit).all()
    
    return {
        "consultations": consultations,
        "total": total,
        "page": skip // limit + 1,
        "size": limit
    }

@router.get("/{consultation_id}", response_model=ConsultationRequestResponse)
async def get_consultation(
    consultation_id: int,
    db: Session = Depends(get_db)
):
    """상담 상세 조회"""
    consultation = db.query(ConsultationRequest).filter(
        ConsultationRequest.id == consultation_id
    ).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="상담 신청을 찾을 수 없습니다."
        )
    
    return consultation

@router.put("/{consultation_id}", response_model=ConsultationRequestResponse)
async def update_consultation(
    consultation_id: int,
    consultation_update: ConsultationRequestUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """상담 신청 수정 (상담사만 가능)"""
    # 상담사 권한 확인
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user or not user.is_counselor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="상담사만 수정할 수 있습니다."
        )
    
    consultation = db.query(ConsultationRequest).filter(
        ConsultationRequest.id == consultation_id
    ).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="상담 신청을 찾을 수 없습니다."
        )
    
    # 업데이트
    for field, value in consultation_update.dict(exclude_unset=True).items():
        setattr(consultation, field, value)
    
    db.commit()
    db.refresh(consultation)
    return consultation

@router.post("/{consultation_id}/sessions", response_model=ConsultationSessionResponse)
async def create_consultation_session(
    consultation_id: int,
    session: ConsultationSessionCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """상담 세션 생성"""
    # 상담사 권한 확인
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user or not user.is_counselor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="상담사만 세션을 생성할 수 있습니다."
        )
    
    # 상담 신청 확인
    consultation = db.query(ConsultationRequest).filter(
        ConsultationRequest.id == consultation_id
    ).first()
    
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="상담 신청을 찾을 수 없습니다."
        )
    
    db_session = ConsultationSession(
        consultation_id=consultation_id,
        counselor_id=current_user["user_id"],
        **session.dict(exclude={"consultation_id"})
    )
    
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.get("/{consultation_id}/sessions", response_model=List[ConsultationSessionResponse])
async def get_consultation_sessions(
    consultation_id: int,
    db: Session = Depends(get_db)
):
    """상담 세션 목록 조회"""
    sessions = db.query(ConsultationSession).filter(
        ConsultationSession.consultation_id == consultation_id
    ).all()
    
    return sessions

@router.get("/stats/overview", response_model=ConsultationStats)
async def get_consultation_stats(db: Session = Depends(get_db)):
    """상담 통계 조회"""
    total_requests = db.query(ConsultationRequest).count()
    pending_requests = db.query(ConsultationRequest).filter(
        ConsultationRequest.status == "pending"
    ).count()
    confirmed_requests = db.query(ConsultationRequest).filter(
        ConsultationRequest.status == "confirmed"
    ).count()
    completed_requests = db.query(ConsultationRequest).filter(
        ConsultationRequest.status == "completed"
    ).count()
    cancelled_requests = db.query(ConsultationRequest).filter(
        ConsultationRequest.status == "cancelled"
    ).count()
    
    return {
        "total_requests": total_requests,
        "pending_requests": pending_requests,
        "confirmed_requests": confirmed_requests,
        "completed_requests": completed_requests,
        "cancelled_requests": cancelled_requests
    } 