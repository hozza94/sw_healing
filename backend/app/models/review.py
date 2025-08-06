from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    counselor_id = Column(Integer, ForeignKey("counselors.id"), nullable=False)
    consultation_id = Column(Integer, ForeignKey("consultations.id"), nullable=True)
    
    # 후기 내용
    rating = Column(Integer, nullable=False)  # 별점 (1-5)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    
    # 설정
    is_anonymous = Column(Boolean, default=False)  # 익명 여부
    is_approved = Column(Boolean, default=False)  # 승인 여부
    is_active = Column(Boolean, default=True)
    
    # 이미지 (선택적)
    image_url = Column(String(500), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 관계 설정
    user = relationship("User", back_populates="reviews")
    counselor = relationship("Counselor", back_populates="reviews")
    consultation = relationship("Consultation", back_populates="reviews")
    
    def __repr__(self):
        return f"<Review(id={self.id}, rating={self.rating}, title='{self.title}')>" 