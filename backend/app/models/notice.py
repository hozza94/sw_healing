from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base


class NoticeType(str, enum.Enum):
    GENERAL = "general"  # 일반
    URGENT = "urgent"  # 긴급
    EVENT = "event"  # 이벤트


class NoticeStatus(str, enum.Enum):
    DRAFT = "draft"  # 임시저장
    PUBLISHED = "published"  # 발행
    HIDDEN = "hidden"  # 비공개


class Notice(Base):
    __tablename__ = "notices"
    
    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # 공지사항 내용
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    notice_type = Column(Enum(NoticeType), default=NoticeType.GENERAL)
    status = Column(Enum(NoticeStatus), default=NoticeStatus.DRAFT)
    
    # 설정
    is_pinned = Column(Boolean, default=False)  # 고정 여부
    is_active = Column(Boolean, default=True)
    
    # 첨부파일
    attachment_url = Column(String(500), nullable=True)
    
    # 조회수
    view_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 관계 설정
    author = relationship("User", back_populates="notices")
    
    def __repr__(self):
        return f"<Notice(id={self.id}, title='{self.title}', type='{self.notice_type}')>" 