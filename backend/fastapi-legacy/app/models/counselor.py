from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Counselor(Base):
    __tablename__ = "counselors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    specialization = Column(Text, nullable=True)  # 전문 분야
    education = Column(Text, nullable=True)  # 학력
    experience = Column(Text, nullable=True)  # 경력
    certification = Column(Text, nullable=True)  # 자격증
    bio = Column(Text, nullable=True)  # 소개
    profile_image = Column(String(500), nullable=True)  # 프로필 이미지 URL
    is_online = Column(Boolean, default=False)  # 온라인 상태
    is_active = Column(Boolean, default=True)
    rating = Column(Float, default=0.0)  # 평점
    total_reviews = Column(Integer, default=0)  # 총 리뷰 수
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 관계 설정
    consultations = relationship("Consultation", back_populates="counselor")
    reviews = relationship("Review", back_populates="counselor")
    
    def __repr__(self):
        return f"<Counselor(id={self.id}, name='{self.name}', email='{self.email}')>" 