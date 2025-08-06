from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class CounselorBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    specialization: Optional[str] = None
    education: Optional[str] = None
    experience: Optional[str] = None
    certification: Optional[str] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None


class CounselorCreate(CounselorBase):
    pass


class CounselorUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    specialization: Optional[str] = None
    education: Optional[str] = None
    experience: Optional[str] = None
    certification: Optional[str] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None
    is_online: Optional[bool] = None
    is_active: Optional[bool] = None


class CounselorInDB(CounselorBase):
    id: int
    is_online: bool
    is_active: bool
    rating: float
    total_reviews: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Counselor(CounselorInDB):
    pass


class CounselorList(BaseModel):
    counselors: list[Counselor]
    total: int
    page: int
    size: int 