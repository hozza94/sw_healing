from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.notice import NoticeType, NoticeStatus


class NoticeBase(BaseModel):
    title: str
    content: str
    notice_type: NoticeType = NoticeType.GENERAL
    status: NoticeStatus = NoticeStatus.DRAFT
    is_pinned: bool = False
    attachment_url: Optional[str] = None


class NoticeCreate(NoticeBase):
    pass


class NoticeUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    notice_type: Optional[NoticeType] = None
    status: Optional[NoticeStatus] = None
    is_pinned: Optional[bool] = None
    is_active: Optional[bool] = None
    attachment_url: Optional[str] = None


class NoticeInDB(NoticeBase):
    id: int
    author_id: int
    is_active: bool
    view_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Notice(NoticeInDB):
    pass


class NoticeList(BaseModel):
    notices: list[Notice]
    total: int
    page: int
    size: int 