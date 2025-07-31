from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class BaseSchema(BaseModel):
    """기본 스키마 클래스"""
    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={
            datetime: lambda v: v.isoformat()
        }
    )

class BaseResponse(BaseModel):
    """기본 응답 스키마"""
    success: bool = True
    message: Optional[str] = None
    data: Optional[dict] = None 