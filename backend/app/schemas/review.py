from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReviewBase(BaseModel):
    rating: int  # 1-5 별점
    title: str
    content: str
    is_anonymous: bool = False
    image_url: Optional[str] = None


class ReviewCreate(ReviewBase):
    counselor_id: int
    consultation_id: Optional[int] = None


class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    title: Optional[str] = None
    content: Optional[str] = None
    is_anonymous: Optional[bool] = None
    is_approved: Optional[bool] = None
    is_active: Optional[bool] = None
    image_url: Optional[str] = None


class ReviewInDB(ReviewBase):
    id: int
    user_id: int
    counselor_id: int
    consultation_id: Optional[int] = None
    is_approved: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Review(ReviewInDB):
    pass


class ReviewList(BaseModel):
    reviews: list[Review]
    total: int
    page: int
    size: int 