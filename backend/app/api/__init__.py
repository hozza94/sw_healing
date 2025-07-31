from fastapi import APIRouter
from app.api import auth, consultation, reviews

# 메인 API 라우터
api_router = APIRouter()

# 각 모듈의 라우터를 메인 라우터에 포함
api_router.include_router(auth.router, prefix="/api/v1")
api_router.include_router(consultation.router, prefix="/api/v1")
api_router.include_router(reviews.router, prefix="/api/v1") 