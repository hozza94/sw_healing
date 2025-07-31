from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.schemas.base import BaseSchema

# 리뷰 생성 스키마
class ReviewCreate(BaseModel):
    user_id: int
    consultation_id: int
    title: str = Field(..., min_length=5, max_length=200)
    content: str = Field(..., min_length=10, description="리뷰 내용")
    rating: int = Field(..., ge=1, le=5, description="평점 (1-5점)")
    category: Optional[str] = Field(None, max_length=50)
    is_anonymous: bool = False

# 리뷰 업데이트 스키마
class ReviewUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    content: Optional[str] = Field(None, min_length=10)
    rating: Optional[int] = Field(None, ge=1, le=5)
    category: Optional[str] = Field(None, max_length=50)
    is_anonymous: Optional[bool] = None
    is_approved: Optional[bool] = None

# 리뷰 응답 스키마
class ReviewResponse(BaseSchema):
    id: int
    user_id: int
    consultation_id: int
    title: str
    content: str
    rating: int
    category: Optional[str] = None
    is_anonymous: bool
    is_approved: bool
    created_at: datetime
    updated_at: datetime

# 리뷰 좋아요 스키마
class ReviewLikeCreate(BaseModel):
    review_id: int
    user_id: int

class ReviewLikeResponse(BaseSchema):
    id: int
    review_id: int
    user_id: int
    created_at: datetime

# 리뷰 목록 응답 스키마
class ReviewListResponse(BaseSchema):
    reviews: list[ReviewResponse]
    total: int
    page: int
    size: int
    average_rating: float
    total_ratings: int

# 리뷰 통계 스키마
class ReviewStats(BaseModel):
    total_reviews: int
    average_rating: float
    rating_distribution: dict[str, int]  # {"1": 10, "2": 20, ...}
    approved_reviews: int
    pending_reviews: int
    total_likes: int

# 리뷰 필터 스키마
class ReviewFilter(BaseModel):
    category: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    is_approved: Optional[bool] = None
    sort_by: str = Field("created_at", description="정렬 기준")
    sort_order: str = Field("desc", description="정렬 순서 (asc/desc)")
    page: int = Field(1, ge=1)
    size: int = Field(10, ge=1, le=100) 