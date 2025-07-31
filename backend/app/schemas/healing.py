from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.schemas.base import BaseSchema

# 힐링 진행 상황 스키마
class HealingProgressCreate(BaseModel):
    consultation_id: int
    current_step: int = Field(1, ge=1, le=12)
    completed_steps: Optional[List[int]] = []
    total_progress: int = Field(0, ge=0, le=100)
    notes: Optional[str] = None

class HealingProgressUpdate(BaseModel):
    current_step: Optional[int] = Field(None, ge=1, le=12)
    completed_steps: Optional[List[int]] = None
    total_progress: Optional[int] = Field(None, ge=0, le=100)
    notes: Optional[str] = None

class HealingProgressResponse(BaseSchema):
    id: int
    consultation_id: int
    current_step: int
    completed_steps: List[int]
    total_progress: int
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

# 1단계 힐링 스키마
class HealingSangdam1stCreate(BaseModel):
    consultation_id: int
    user_id: int
    session_id: Optional[int] = None
    current_situation: Optional[str] = None
    main_concern: Optional[str] = None
    stress_level: Optional[int] = Field(None, ge=1, le=10)
    question_1: Optional[str] = None
    answer_1: Optional[str] = None
    question_2: Optional[str] = None
    answer_2: Optional[str] = None
    question_3: Optional[str] = None
    answer_3: Optional[str] = None
    question_4: Optional[str] = None
    answer_4: Optional[str] = None
    question_5: Optional[str] = None
    answer_5: Optional[str] = None
    additional_notes: Optional[str] = None
    counselor_feedback: Optional[str] = None

class HealingSangdam1stUpdate(BaseModel):
    current_situation: Optional[str] = None
    main_concern: Optional[str] = None
    stress_level: Optional[int] = Field(None, ge=1, le=10)
    question_1: Optional[str] = None
    answer_1: Optional[str] = None
    question_2: Optional[str] = None
    answer_2: Optional[str] = None
    question_3: Optional[str] = None
    answer_3: Optional[str] = None
    question_4: Optional[str] = None
    answer_4: Optional[str] = None
    question_5: Optional[str] = None
    answer_5: Optional[str] = None
    additional_notes: Optional[str] = None
    counselor_feedback: Optional[str] = None

class HealingSangdam1stResponse(BaseSchema):
    id: int
    consultation_id: int
    user_id: int
    session_id: Optional[int] = None
    current_situation: Optional[str] = None
    main_concern: Optional[str] = None
    stress_level: Optional[int] = None
    question_1: Optional[str] = None
    answer_1: Optional[str] = None
    question_2: Optional[str] = None
    answer_2: Optional[str] = None
    question_3: Optional[str] = None
    answer_3: Optional[str] = None
    question_4: Optional[str] = None
    answer_4: Optional[str] = None
    question_5: Optional[str] = None
    answer_5: Optional[str] = None
    additional_notes: Optional[str] = None
    counselor_feedback: Optional[str] = None
    created_at: datetime
    updated_at: datetime

# 2단계 힐링 스키마
class HealingSangdam2ndCreate(BaseModel):
    consultation_id: int
    user_id: int
    session_id: Optional[int] = None
    emotional_state: Optional[str] = None
    coping_mechanisms: Optional[str] = None
    question_1: Optional[str] = None
    answer_1: Optional[str] = None
    question_2: Optional[str] = None
    answer_2: Optional[str] = None
    question_3: Optional[str] = None
    answer_3: Optional[str] = None
    question_4: Optional[str] = None
    answer_4: Optional[str] = None
    question_5: Optional[str] = None
    answer_5: Optional[str] = None
    additional_notes: Optional[str] = None
    counselor_feedback: Optional[str] = None

class HealingSangdam2ndUpdate(BaseModel):
    emotional_state: Optional[str] = None
    coping_mechanisms: Optional[str] = None
    question_1: Optional[str] = None
    answer_1: Optional[str] = None
    question_2: Optional[str] = None
    answer_2: Optional[str] = None
    question_3: Optional[str] = None
    answer_3: Optional[str] = None
    question_4: Optional[str] = None
    answer_4: Optional[str] = None
    question_5: Optional[str] = None
    answer_5: Optional[str] = None
    additional_notes: Optional[str] = None
    counselor_feedback: Optional[str] = None

class HealingSangdam2ndResponse(BaseSchema):
    id: int
    consultation_id: int
    user_id: int
    session_id: Optional[int] = None
    emotional_state: Optional[str] = None
    coping_mechanisms: Optional[str] = None
    question_1: Optional[str] = None
    answer_1: Optional[str] = None
    question_2: Optional[str] = None
    answer_2: Optional[str] = None
    question_3: Optional[str] = None
    answer_3: Optional[str] = None
    question_4: Optional[str] = None
    answer_4: Optional[str] = None
    question_5: Optional[str] = None
    answer_5: Optional[str] = None
    additional_notes: Optional[str] = None
    counselor_feedback: Optional[str] = None
    created_at: datetime
    updated_at: datetime

# 3단계 힐링 스키마 (기본 구조)
class HealingSangdam3rdCreate(BaseModel):
    consultation_id: int
    user_id: int
    session_id: Optional[int] = None
    question_1: Optional[str] = None
    answer_1: Optional[str] = None
    question_2: Optional[str] = None
    answer_2: Optional[str] = None
    question_3: Optional[str] = None
    answer_3: Optional[str] = None
    question_4: Optional[str] = None
    answer_4: Optional[str] = None
    question_5: Optional[str] = None
    answer_5: Optional[str] = None
    additional_notes: Optional[str] = None
    counselor_feedback: Optional[str] = None

class HealingSangdam3rdUpdate(BaseModel):
    question_1: Optional[str] = None
    answer_1: Optional[str] = None
    question_2: Optional[str] = None
    answer_2: Optional[str] = None
    question_3: Optional[str] = None
    answer_3: Optional[str] = None
    question_4: Optional[str] = None
    answer_4: Optional[str] = None
    question_5: Optional[str] = None
    answer_5: Optional[str] = None
    additional_notes: Optional[str] = None
    counselor_feedback: Optional[str] = None

class HealingSangdam3rdResponse(BaseSchema):
    id: int
    consultation_id: int
    user_id: int
    session_id: Optional[int] = None
    question_1: Optional[str] = None
    answer_1: Optional[str] = None
    question_2: Optional[str] = None
    answer_2: Optional[str] = None
    question_3: Optional[str] = None
    answer_3: Optional[str] = None
    question_4: Optional[str] = None
    answer_4: Optional[str] = None
    question_5: Optional[str] = None
    answer_5: Optional[str] = None
    additional_notes: Optional[str] = None
    counselor_feedback: Optional[str] = None
    created_at: datetime
    updated_at: datetime 