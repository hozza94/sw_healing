from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.schemas.base import BaseSchema

# 사용자 생성 스키마
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="비밀번호 (최소 8자)")
    name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    is_counselor: bool = False

# 사용자 로그인 스키마
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# 사용자 업데이트 스키마
class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    is_active: Optional[bool] = None

# 사용자 응답 스키마
class UserResponse(BaseSchema):
    id: int
    email: str
    name: str
    phone: Optional[str] = None
    is_active: bool
    is_counselor: bool
    created_at: datetime
    updated_at: datetime

# 토큰 스키마
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# 토큰 데이터 스키마
class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None

# 사용자 목록 응답 스키마
class UserListResponse(BaseSchema):
    users: list[UserResponse]
    total: int
    page: int
    size: int 