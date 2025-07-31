from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class ConsultationRequest(Base):
    __tablename__ = "consultation_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    age = Column(Integer)
    gender = Column(String(10))
    main_concern = Column(Text, nullable=False)
    preferred_date = Column(Date)
    preferred_time = Column(String(20))
    additional_info = Column(Text)
    status = Column(String(20), default="pending")  # pending, confirmed, completed, cancelled
    counselor_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 관계 설정
    user = relationship("User", foreign_keys=[user_id])
    counselor = relationship("User", foreign_keys=[counselor_id])

class ConsultationSession(Base):
    __tablename__ = "consultation_sessions"

    id = Column(Integer, primary_key=True, index=True)
    consultation_id = Column(Integer, ForeignKey("consultation_requests.id"), nullable=False)
    session_number = Column(Integer, nullable=False)
    counselor_id = Column(Integer, ForeignKey("users.id"))
    session_date = Column(DateTime(timezone=True))
    session_notes = Column(Text)
    status = Column(String(20), default="scheduled")  # scheduled, completed, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 관계 설정
    consultation = relationship("ConsultationRequest")
    counselor = relationship("User") 