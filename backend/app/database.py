from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import os

# 데이터베이스 연결 설정
def get_database_url():
    """환경에 따른 데이터베이스 URL 반환"""
    if settings.ENVIRONMENT == "test":
        return settings.DATABASE_TEST_URL
    
    # 현재는 로컬 SQLite 사용 (Turso 연결 문제로 인해)
    # TODO: Turso 연결이 안정화되면 다시 활성화
    return settings.DATABASE_FALLBACK_URL

# 데이터베이스 엔진 생성
engine = create_engine(
    get_database_url(),
    pool_pre_ping=True,
    pool_recycle=300,
    echo=settings.DEBUG
)

# 세션 팩토리 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base 클래스 생성
Base = declarative_base()


def get_db():
    """데이터베이스 세션 의존성"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """데이터베이스 테이블 생성"""
    Base.metadata.create_all(bind=engine)


def drop_tables():
    """데이터베이스 테이블 삭제 (테스트용)"""
    Base.metadata.drop_all(bind=engine) 