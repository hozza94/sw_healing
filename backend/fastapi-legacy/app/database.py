from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import os

# 로컬 SQLite 사용
DATABASE_URL = "sqlite:///./suwon_healing.db"

# 데이터베이스 엔진 생성
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=settings.DEBUG,
    connect_args={"check_same_thread": False}  # SQLite용
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
    print("🔄 로컬 SQLite 테이블 생성")
    Base.metadata.create_all(bind=engine)

def drop_tables():
    """데이터베이스 테이블 삭제 (테스트용)"""
    print("🔄 로컬 SQLite 테이블 삭제")
    Base.metadata.drop_all(bind=engine) 