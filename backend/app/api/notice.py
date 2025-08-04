from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.notice import Notice
from app.schemas.notice import NoticeCreate, NoticeUpdate, NoticeResponse

router = APIRouter(prefix="/notices", tags=["notices"])

@router.post("/", response_model=NoticeResponse, status_code=status.HTTP_201_CREATED)
def create_notice(notice: NoticeCreate, db: Session = Depends(get_db)):
    """공지사항 생성 (관리자용)"""
    db_notice = Notice(**notice.dict())
    db.add(db_notice)
    db.commit()
    db.refresh(db_notice)
    return db_notice

@router.get("/", response_model=List[NoticeResponse])
def get_notices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """공지사항 목록 조회"""
    notices = db.query(Notice).order_by(Notice.is_pinned.desc(), Notice.created_at.desc()).offset(skip).limit(limit).all()
    return notices

@router.get("/{notice_id}", response_model=NoticeResponse)
def get_notice(notice_id: int, db: Session = Depends(get_db)):
    """공지사항 상세 조회"""
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if notice is None:
        raise HTTPException(status_code=404, detail="공지사항을 찾을 수 없습니다")
    
    # 조회수 증가
    notice.view_count += 1
    db.commit()
    
    return notice

@router.put("/{notice_id}", response_model=NoticeResponse)
def update_notice(notice_id: int, notice: NoticeUpdate, db: Session = Depends(get_db)):
    """공지사항 수정 (관리자용)"""
    db_notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if db_notice is None:
        raise HTTPException(status_code=404, detail="공지사항을 찾을 수 없습니다")
    
    update_data = notice.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_notice, field, value)
    
    db.commit()
    db.refresh(db_notice)
    return db_notice

@router.delete("/{notice_id}")
def delete_notice(notice_id: int, db: Session = Depends(get_db)):
    """공지사항 삭제 (관리자용)"""
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    if notice is None:
        raise HTTPException(status_code=404, detail="공지사항을 찾을 수 없습니다")
    
    db.delete(notice)
    db.commit()
    return {"message": "공지사항이 삭제되었습니다"} 