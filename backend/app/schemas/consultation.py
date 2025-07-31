from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, date
from app.schemas.base import BaseSchema

# 상담 신청 생성 스키마
class ConsultationRequestCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    age: Optional[int] = Field(None, ge=1, le=120)
    gender: Optional[str] = Field(None, max_length=10)
    main_concern: str = Field(..., min_length=10, description="주요 고민사항")
    preferred_date: Optional[date] = None
    preferred_time: Optional[str] = Field(None, max_length=20)
    additional_info: Optional[str] = None

# 상담 신청 업데이트 스키마
class ConsultationRequestUpdate(BaseModel):
    status: Optional[str] = Field(None, max_length=20)
    counselor_id: Optional[int] = None
    preferred_date: Optional[date] = None
    preferred_time: Optional[str] = Field(None, max_length=20)
    additional_info: Optional[str] = None

# 상담 신청 응답 스키마
class ConsultationRequestResponse(BaseSchema):
    id: int
    user_id: Optional[int] = None
    name: str
    email: str
    phone: str
    age: Optional[int] = None
    gender: Optional[str] = None
    main_concern: str
    preferred_date: Optional[date] = None
    preferred_time: Optional[str] = None
    additional_info: Optional[str] = None
    status: str
    counselor_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

# 상담 세션 생성 스키마
class ConsultationSessionCreate(BaseModel):
    consultation_id: int
    session_number: int = Field(..., ge=1)
    counselor_id: Optional[int] = None
    session_date: Optional[datetime] = None
    session_notes: Optional[str] = None

# 상담 세션 업데이트 스키마
class ConsultationSessionUpdate(BaseModel):
    counselor_id: Optional[int] = None
    session_date: Optional[datetime] = None
    session_notes: Optional[str] = None
    status: Optional[str] = Field(None, max_length=20)

# 상담 세션 응답 스키마
class ConsultationSessionResponse(BaseSchema):
    id: int
    consultation_id: int
    session_number: int
    counselor_id: Optional[int] = None
    session_date: Optional[datetime] = None
    session_notes: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

# 상담 목록 응답 스키마
class ConsultationListResponse(BaseSchema):
    consultations: list[ConsultationRequestResponse]
    total: int
    page: int
    size: int

# 상담 통계 스키마
class ConsultationStats(BaseModel):
    total_requests: int
    pending_requests: int
    confirmed_requests: int
    completed_requests: int
    cancelled_requests: int 