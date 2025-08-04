from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api import api_router
from app.models import Base, engine

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Suwon Healing Counseling Center API",
    description="수원 힐링 상담센터 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 포함
app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "Suwon Healing Counseling Center API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

@app.get("/api/info")
async def api_info():
    return {
        "name": "Suwon Healing Counseling Center API",
        "version": "1.0.0",
        "description": "수원 힐링 상담센터 API",
        "endpoints": {
            "auth": "/api/v1/auth",
            "consultations": "/api/v1/consultations",
            "reviews": "/api/v1/reviews"
        }
    } 