from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.schemas.base import BaseSchema

# 체크리스트 마스터 스키마
class ChecklistMasterCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    category: Optional[str] = Field(None, max_length=50)
    version: str = Field("1.0", max_length=10)
    is_active: bool = True

class ChecklistMasterUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    category: Optional[str] = Field(None, max_length=50)
    version: Optional[str] = Field(None, max_length=10)
    is_active: Optional[bool] = None

class ChecklistMasterResponse(BaseSchema):
    id: int
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    version: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

# 체크리스트 항목 스키마
class ChecklistItemCreate(BaseModel):
    master_id: int
    question: str = Field(..., min_length=1)
    item_type: str = Field("checkbox", max_length=20)
    options: Optional[List[str]] = None
    required: bool = False
    order_index: int = Field(..., ge=1)

class ChecklistItemUpdate(BaseModel):
    question: Optional[str] = Field(None, min_length=1)
    item_type: Optional[str] = Field(None, max_length=20)
    options: Optional[List[str]] = None
    required: Optional[bool] = None
    order_index: Optional[int] = Field(None, ge=1)

class ChecklistItemResponse(BaseSchema):
    id: int
    master_id: int
    question: str
    item_type: str
    options: Optional[List[str]] = None
    required: bool
    order_index: int
    created_at: datetime

# 사용자 체크리스트 응답 스키마
class UserChecklistResponseCreate(BaseModel):
    user_id: int
    consultation_id: int
    master_id: int
    item_id: int
    response_value: Optional[str] = None
    response_data: Optional[Dict[str, Any]] = None

class UserChecklistResponseUpdate(BaseModel):
    response_value: Optional[str] = None
    response_data: Optional[Dict[str, Any]] = None

class UserChecklistResponseResponse(BaseSchema):
    id: int
    user_id: int
    consultation_id: int
    master_id: int
    item_id: int
    response_value: Optional[str] = None
    response_data: Optional[Dict[str, Any]] = None
    completed_at: datetime

# 체크리스트 완료 스키마
class ChecklistCompletionCreate(BaseModel):
    user_id: int
    consultation_id: int
    master_id: int
    responses: List[UserChecklistResponseCreate]

class ChecklistCompletionResponse(BaseSchema):
    master_id: int
    master_name: str
    total_items: int
    completed_items: int
    completion_rate: float
    responses: List[UserChecklistResponseResponse]

# 체크리스트 목록 응답 스키마
class ChecklistListResponse(BaseSchema):
    checklists: List[ChecklistMasterResponse]
    total: int
    page: int
    size: int

# 체크리스트 통계 스키마
class ChecklistStats(BaseModel):
    total_masters: int
    total_items: int
    active_masters: int
    total_responses: int
    completion_rate: float 