from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database import Base


class ConsultationType(str, enum.Enum):
    INDIVIDUAL = "individual"  # 개인상담
    COUPLE = "couple"  # 부부상담
    FAMILY = "family"  # 가족상담
    YOUTH = "youth"  # 청소년상담
    OTHER = "other"  # 기타


class ConsultationStatus(str, enum.Enum):
    PENDING = "pending"  # 접수
    REVIEWING = "reviewing"  # 검토
    CONFIRMED = "confirmed"  # 확정
    COMPLETED = "completed"  # 완료
    CANCELLED = "cancelled"  # 취소


class UrgencyLevel(str, enum.Enum):
    NORMAL = "normal"  # 일반
    URGENT = "urgent"  # 긴급


class Consultation(Base):
    __tablename__ = "consultations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    counselor_id = Column(Integer, ForeignKey("counselors.id"), nullable=True)
    consultation_type = Column(Enum(ConsultationType), nullable=False)
    status = Column(Enum(ConsultationStatus), default=ConsultationStatus.PENDING)
    urgency_level = Column(Enum(UrgencyLevel), default=UrgencyLevel.NORMAL)
    
    # 상담 내용
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    preferred_date = Column(DateTime, nullable=True)
    preferred_time = Column(String(50), nullable=True)
    
    # 연락처 정보
    contact_name = Column(String(200), nullable=False)
    contact_phone = Column(String(20), nullable=False)
    contact_email = Column(String(255), nullable=False)
    
    # 추가 정보
    notes = Column(Text, nullable=True)  # 관리자 메모
    is_confidential = Column(Boolean, default=True)  # 기밀 유지 동의
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 관계 설정
    user = relationship("User", back_populates="consultations")
    counselor = relationship("Counselor", back_populates="consultations")
    reviews = relationship("Review", back_populates="consultation")
    
    def __repr__(self):
        return f"<Consultation(id={self.id}, title='{self.title}', status='{self.status}')>" 