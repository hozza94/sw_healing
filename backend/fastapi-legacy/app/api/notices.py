from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.notice import Notice, NoticeType, NoticeStatus
from ..models.user import User
from ..schemas.notice import NoticeCreate, NoticeUpdate, Notice as NoticeSchema, NoticeList
from ..dependencies import get_current_active_user, get_current_admin_user

router = APIRouter(prefix="/notices", tags=["공지사항"])


@router.post("/", response_model=NoticeSchema)
def create_notice(
    notice_data: NoticeCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """공지사항 작성 (관리자만)"""
    db_notice = Notice(
        author_id=current_user.id,
        **notice_data.dict()
    )
    
    db.add(db_notice)
    db.commit()
    db.refresh(db_notice)
    
    return db_notice


@router.get("/", response_model=NoticeList)
def get_notices(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    notice_type: Optional[NoticeType] = None,
    status: Optional[NoticeStatus] = None,
    is_pinned: Optional[bool] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """공지사항 목록 조회"""
    query = db.query(Notice)
    
    if notice_type:
        query = query.filter(Notice.notice_type == notice_type)
    
    if status:
        query = query.filter(Notice.status == status)
    
    if is_pinned is not None:
        query = query.filter(Notice.is_pinned == is_pinned)
    
    if is_active is not None:
        query = query.filter(Notice.is_active == is_active)
    
    # 고정된 공지사항을 먼저, 그 다음 최신순으로 정렬
    query = query.order_by(Notice.is_pinned.desc(), Notice.created_at.desc())
    
    total = query.count()
    notices = query.offset(skip).limit(limit).all()
    
    return NoticeList(
        notices=notices,
        total=total,
        page=skip // limit + 1,
        size=limit
    )


@router.get("/published", response_model=NoticeList)
def get_published_notices(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    notice_type: Optional[NoticeType] = None,
    db: Session = Depends(get_db)
):
    """발행된 공지사항 목록 조회"""
    query = db.query(Notice).filter(
        Notice.status == NoticeStatus.PUBLISHED,
        Notice.is_active == True
    )
    
    if notice_type:
        query = query.filter(Notice.notice_type == notice_type)
    
    # 고정된 공지사항을 먼저, 그 다음 최신순으로 정렬
    query = query.order_by(Notice.is_pinned.desc(), Notice.created_at.desc())
    
    total = query.count()
    notices = query.offset(skip).limit(limit).all()
    
    return NoticeList(
        notices=notices,
        total=total,
        page=skip // limit + 1,
        size=limit
    )


@router.get("/{notice_id}", response_model=NoticeSchema)
def get_notice(
    notice_id: int,
    db: Session = Depends(get_db)
):
    """공지사항 상세 조회"""
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    
    if not notice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="공지사항을 찾을 수 없습니다."
        )
    
    # 조회수 증가
    notice.view_count += 1
    db.commit()
    
    return notice


@router.put("/{notice_id}", response_model=NoticeSchema)
def update_notice(
    notice_id: int,
    notice_update: NoticeUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """공지사항 수정 (관리자만)"""
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    
    if not notice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="공지사항을 찾을 수 없습니다."
        )
    
    update_data = notice_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(notice, field, value)
    
    db.commit()
    db.refresh(notice)
    
    return notice


@router.delete("/{notice_id}")
def delete_notice(
    notice_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """공지사항 삭제 (관리자만)"""
    notice = db.query(Notice).filter(Notice.id == notice_id).first()
    
    if not notice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="공지사항을 찾을 수 없습니다."
        )
    
    db.delete(notice)
    db.commit()
    
    return {"message": "공지사항이 삭제되었습니다."} 