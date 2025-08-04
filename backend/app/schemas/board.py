from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BoardBase(BaseModel):
    title: str
    content: str
    author_name: str
    category: Optional[str] = "일반"

class BoardCreate(BoardBase):
    pass

class BoardUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None

class BoardResponse(BoardBase):
    id: int
    user_id: Optional[int] = None
    view_count: int
    like_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BoardListResponse(BaseModel):
    id: int
    title: str
    author_name: str
    category: str
    view_count: int
    like_count: int
    created_at: datetime

    class Config:
        from_attributes = True 