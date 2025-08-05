from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class CommentBase(BaseModel):
    content: str
    author_name: str

class CommentCreate(CommentBase):
    board_id: int

class CommentUpdate(BaseModel):
    content: str

class CommentResponse(CommentBase):
    id: int
    board_id: int
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True) 