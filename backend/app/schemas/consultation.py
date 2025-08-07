from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from ..models.consultation import ConsultationType, ConsultationStatus, UrgencyLevel


class ConsultationBase(BaseModel):
    consultation_type: ConsultationType
    title: str
    description: str
    preferred_date: Optional[datetime] = None
    preferred_time: Optional[str] = None
    contact_name: str
    contact_phone: str
    contact_email: EmailStr
    urgency_level: UrgencyLevel = UrgencyLevel.MEDIUM
    is_confidential: bool = True


class ConsultationCreate(ConsultationBase):
    pass


class ConsultationUpdate(BaseModel):
    consultation_type: Optional[ConsultationType] = None
    title: Optional[str] = None
    description: Optional[str] = None
    preferred_date: Optional[datetime] = None
    preferred_time: Optional[str] = None
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    urgency_level: Optional[UrgencyLevel] = None
    status: Optional[ConsultationStatus] = None
    counselor_id: Optional[int] = None
    notes: Optional[str] = None


class ConsultationInDB(ConsultationBase):
    id: int
    user_id: int
    counselor_id: Optional[int] = None
    status: ConsultationStatus
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Consultation(ConsultationInDB):
    pass


class ConsultationList(BaseModel):
    consultations: list[Consultation]
    total: int
    page: int
    size: int 