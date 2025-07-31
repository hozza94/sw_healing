from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class ChecklistMaster(Base):
    __tablename__ = "checklist_masters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    category = Column(String(50))  # 스트레스, 우울증, 불안 등
    version = Column(String(10), default="1.0")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class ChecklistItem(Base):
    __tablename__ = "checklist_items"

    id = Column(Integer, primary_key=True, index=True)
    master_id = Column(Integer, ForeignKey("checklist_masters.id"), nullable=False)
    question = Column(Text, nullable=False)
    item_type = Column(String(20), default="checkbox")  # checkbox, radio, text, scale
    options = Column(JSON)  # 선택지 (radio 타입용)
    required = Column(Boolean, default=False)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 관계 설정
    master = relationship("ChecklistMaster")

class UserChecklistResponse(Base):
    __tablename__ = "user_checklist_responses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    consultation_id = Column(Integer, ForeignKey("consultation_requests.id"), nullable=False)
    master_id = Column(Integer, ForeignKey("checklist_masters.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("checklist_items.id"), nullable=False)
    response_value = Column(Text)
    response_data = Column(JSON)  # 복잡한 응답 데이터
    completed_at = Column(DateTime(timezone=True), server_default=func.now())

    # 관계 설정
    user = relationship("User")
    consultation = relationship("ConsultationRequest")
    master = relationship("ChecklistMaster")
    item = relationship("ChecklistItem") 