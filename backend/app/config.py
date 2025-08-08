from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    # 애플리케이션 설정
    APP_NAME: str = "수원 힐링 상담센터"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    
    # 데이터베이스 설정 (환경 변수로 받음)
    DATABASE_URL: str = "libsql://swhealing-hozza.aws-ap-northeast-1.turso.io"
    DATABASE_AUTH_TOKEN: str = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiI2NTE5YTM5Zi1kZTc5LTQxNGYtOTA0ZC1kOGI2NDliMDZmN2MiLCJpYXQiOjE3NTQ0NDMzOTksInJpZCI6IjA5OGQzZTNhLWE0OWMtNGQ0NC04MGIxLWVjOTM3MzY4YjQ5MSJ9.FZgSEU3NZJj7lhaLHfnNg6KxoLUGO9u9MLsa9nLI3HBCKVf6Ke1O4-m0WMs_CQdtcLEAYL3xNIID8E8HnRqzAA"
    DATABASE_FALLBACK_URL: str = "sqlite:///./suwon_healing.db"
    DATABASE_TEST_URL: str = "sqlite:///./suwon_healing_test.db"
    
    # Redis 설정
    REDIS_URL: str = "redis://localhost:6379"
    
    # 보안 설정 (환경 변수로 받음)
    SECRET_KEY: str = "your-super-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS 설정 (환경 변수로 받음)
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://swhealing.vercel.app",
        "https://sw-healing.vercel.app"
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    
    # 이메일 설정
    EMAIL_HOST: str = "smtp.gmail.com"
    EMAIL_PORT: int = 587
    EMAIL_USERNAME: Optional[str] = None
    EMAIL_PASSWORD: Optional[str] = None
    EMAIL_FROM: Optional[str] = None
    
    # AWS S3 설정 (선택적)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "ap-northeast-2"
    AWS_S3_BUCKET: Optional[str] = None
    
    # Google Maps API (선택적)
    GOOGLE_MAPS_API_KEY: Optional[str] = None
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # 파일 업로드 설정
    MAX_FILE_SIZE: int = 10485760  # 10MB
    ALLOWED_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"]
    UPLOAD_DIR: str = "uploads"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # 환경 변수에서 CORS_ORIGINS를 파싱
        if os.getenv("CORS_ORIGINS"):
            self.CORS_ORIGINS = os.getenv("CORS_ORIGINS").split(",")
        
        # 프로덕션 환경에서는 DEBUG를 False로 설정
        if self.ENVIRONMENT == "production":
            self.DEBUG = False


# 전역 설정 인스턴스
settings = Settings() 