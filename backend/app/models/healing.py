from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class HealingProgress(Base):
    __tablename__ = "healing_progress"

    id = Column(Integer, primary_key=True, index=True)
    consultation_id = Column(Integer, ForeignKey("consultation_requests.id"), nullable=False)
    current_step = Column(Integer, default=1)
    completed_steps = Column(JSON, default=list)  # 완료된 단계들
    total_progress = Column(Integer, default=0)  # 전체 진행률 (0-100)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 관계 설정
    consultation = relationship("ConsultationRequest")

# 12단계 힐링 데이터 모델들
class HealingSangdam1st(Base):
    __tablename__ = "healing_sangdam_1st"

    id = Column(Integer, primary_key=True, index=True)
    consultation_id = Column(Integer, ForeignKey("consultation_requests.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(Integer, ForeignKey("consultation_sessions.id"))
    
    current_situation = Column(Text)
    main_concern = Column(Text)
    stress_level = Column(Integer)  # 1-10
    
    question_1 = Column(Text)
    answer_1 = Column(Text)
    question_2 = Column(Text)
    answer_2 = Column(Text)
    question_3 = Column(Text)
    answer_3 = Column(Text)
    question_4 = Column(Text)
    answer_4 = Column(Text)
    question_5 = Column(Text)
    answer_5 = Column(Text)
    
    additional_notes = Column(Text)
    counselor_feedback = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 관계 설정
    consultation = relationship("ConsultationRequest")
    user = relationship("User")
    session = relationship("ConsultationSession")

class HealingSangdam2nd(Base):
    __tablename__ = "healing_sangdam_2nd"

    id = Column(Integer, primary_key=True, index=True)
    consultation_id = Column(Integer, ForeignKey("consultation_requests.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(Integer, ForeignKey("consultation_sessions.id"))
    
    # 2단계 특화 필드들
    emotional_state = Column(Text)
    coping_mechanisms = Column(Text)
    
    question_1 = Column(Text)
    answer_1 = Column(Text)
    question_2 = Column(Text)
    answer_2 = Column(Text)
    question_3 = Column(Text)
    answer_3 = Column(Text)
    question_4 = Column(Text)
    answer_4 = Column(Text)
    question_5 = Column(Text)
    answer_5 = Column(Text)
    
    additional_notes = Column(Text)
    counselor_feedback = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 관계 설정
    consultation = relationship("ConsultationRequest")
    user = relationship("User")
    session = relationship("ConsultationSession")

# 3-12단계는 동일한 구조로 생성 (필요에 따라 커스터마이징 가능)
class HealingSangdam3rd(Base):
    __tablename__ = "healing_sangdam_3rd"

    id = Column(Integer, primary_key=True, index=True)
    consultation_id = Column(Integer, ForeignKey("consultation_requests.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(Integer, ForeignKey("consultation_sessions.id"))
    
    question_1 = Column(Text)
    answer_1 = Column(Text)
    question_2 = Column(Text)
    answer_2 = Column(Text)
    question_3 = Column(Text)
    answer_3 = Column(Text)
    question_4 = Column(Text)
    answer_4 = Column(Text)
    question_5 = Column(Text)
    answer_5 = Column(Text)
    
    additional_notes = Column(Text)
    counselor_feedback = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # 관계 설정
    consultation = relationship("ConsultationRequest")
    user = relationship("User")
    session = relationship("ConsultationSession") 