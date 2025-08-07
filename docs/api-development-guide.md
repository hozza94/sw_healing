# API 개발 가이드

## 개요
수원힐링센터 웹사이트의 API 개발 가이드입니다. FastAPI를 사용하여 RESTful API를 구현합니다.

## 프로젝트 구조

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 앱 진입점
│   ├── config.py            # 설정 관리
│   ├── database.py          # 데이터베이스 연결
│   ├── dependencies.py      # 의존성 주입
│   ├── api/                 # API 라우터
│   │   ├── __init__.py
│   │   ├── auth.py         # 인증 API
│   │   ├── counselors.py   # 상담사 API
│   │   ├── consultations.py # 상담 신청 API
│   │   ├── notices.py      # 공지사항 API
│   │   └── reviews.py      # 후기 API
│   ├── models/             # SQLAlchemy 모델
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── counselor.py
│   │   ├── consultation.py
│   │   ├── notice.py
│   │   └── review.py
│   ├── schemas/            # Pydantic 스키마
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── counselor.py
│   │   ├── consultation.py
│   │   ├── notice.py
│   │   └── review.py
│   ├── core/               # 핵심 기능
│   │   ├── __init__.py
│   │   └── security.py     # 보안 관련
│   └── services/           # 비즈니스 로직
│       └── __init__.py
├── requirements.txt
└── alembic/               # 데이터베이스 마이그레이션
    └── versions/
```

## API 설계 원칙

### 1. RESTful 설계
- **GET**: 데이터 조회
- **POST**: 데이터 생성
- **PUT**: 데이터 전체 수정
- **PATCH**: 데이터 부분 수정
- **DELETE**: 데이터 삭제

### 2. URL 구조
```
/api/{resource}           # 리소스 목록
/api/{resource}/{id}      # 특정 리소스
/api/{resource}/{id}/{action}  # 특정 액션
```

### 3. 응답 형식
```json
{
  "data": {...},
  "message": "Success",
  "error": null
}
```

### 4. 에러 처리
```json
{
  "detail": "에러 메시지",
  "status_code": 400
}
```

## 인증 및 권한

### JWT 토큰 구조
```python
# 토큰 페이로드
{
  "sub": "user_id",
  "username": "username",
  "is_admin": false,
  "exp": 1234567890
}
```

### 권한 레벨
1. **Public**: 인증 없이 접근 가능
2. **User**: 로그인한 사용자만 접근
3. **Admin**: 관리자만 접근

### 의존성 함수
```python
# dependencies.py
from fastapi import Depends, HTTPException, status
from .core.security import get_current_user, get_current_admin_user

# 일반 사용자 인증
def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# 관리자 인증
def get_current_admin_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user
```

## 데이터 검증

### Pydantic 스키마 예시
```python
# schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
```

## API 엔드포인트 구현

### 기본 CRUD 패턴
```python
# api/counselors.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.counselor import Counselor
from ..schemas.counselor import CounselorCreate, CounselorUpdate, Counselor
from ..dependencies import get_current_admin_user

router = APIRouter(prefix="/counselors", tags=["상담사"])

@router.get("/", response_model=List[Counselor])
def get_counselors(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """상담사 목록 조회"""
    counselors = db.query(Counselor).offset(skip).limit(limit).all()
    return counselors

@router.post("/", response_model=Counselor)
def create_counselor(
    counselor: CounselorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """상담사 생성 (관리자만)"""
    db_counselor = Counselor(**counselor.dict())
    db.add(db_counselor)
    db.commit()
    db.refresh(db_counselor)
    return db_counselor

@router.get("/{counselor_id}", response_model=Counselor)
def get_counselor(counselor_id: int, db: Session = Depends(get_db)):
    """상담사 상세 조회"""
    counselor = db.query(Counselor).filter(Counselor.id == counselor_id).first()
    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")
    return counselor

@router.put("/{counselor_id}", response_model=Counselor)
def update_counselor(
    counselor_id: int,
    counselor_update: CounselorUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """상담사 수정 (관리자만)"""
    counselor = db.query(Counselor).filter(Counselor.id == counselor_id).first()
    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")
    
    update_data = counselor_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(counselor, field, value)
    
    db.commit()
    db.refresh(counselor)
    return counselor

@router.delete("/{counselor_id}")
def delete_counselor(
    counselor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """상담사 삭제 (관리자만)"""
    counselor = db.query(Counselor).filter(Counselor.id == counselor_id).first()
    if not counselor:
        raise HTTPException(status_code=404, detail="Counselor not found")
    
    db.delete(counselor)
    db.commit()
    return {"message": "Counselor deleted successfully"}
```

## 에러 처리

### 커스텀 예외 클래스
```python
# core/exceptions.py
from fastapi import HTTPException, status

class NotFoundException(HTTPException):
    def __init__(self, detail: str = "Not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class PermissionDeniedException(HTTPException):
    def __init__(self, detail: str = "Permission denied"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

class ValidationException(HTTPException):
    def __init__(self, detail: str = "Validation error"):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)
```

### 미들웨어를 통한 에러 처리
```python
# main.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

app = FastAPI()

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": exc.errors()}
    )
```

## 테스트

### API 테스트 예시
```python
# tests/test_counselors.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import get_db, Base
from app.main import app

# 테스트 데이터베이스 설정
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_get_counselors():
    response = client.get("/api/counselors/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_counselor():
    counselor_data = {
        "name": "테스트 상담사",
        "email": "test@example.com",
        "phone": "010-1234-5678",
        "specialization": "개인상담",
        "education": "서울대학교",
        "experience": "5년",
        "bio": "테스트 상담사입니다."
    }
    response = client.post("/api/counselors/", json=counselor_data)
    assert response.status_code == 201
    assert response.json()["name"] == counselor_data["name"]
```

## 배포

### 환경 변수
```bash
# .env
DATABASE_URL=sqlite:///./suwon_healing.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:3000"]
```

### 서버 실행
```bash
# 개발 서버
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 프로덕션 서버
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 문서화

### Swagger UI
- 자동으로 `/docs`에서 API 문서 확인 가능
- FastAPI의 자동 문서화 기능 활용

### 커스텀 문서
```python
# main.py
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="수원힐링센터 API",
        version="1.0.0",
        description="수원힐링센터 웹사이트 API 문서",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
```

## 성능 최적화

### 데이터베이스 쿼리 최적화
```python
# N+1 문제 해결
from sqlalchemy.orm import joinedload

# 좋은 예
counselors = db.query(Counselor).options(joinedload(Counselor.reviews)).all()

# 나쁜 예
counselors = db.query(Counselor).all()
for counselor in counselors:
    reviews = db.query(Review).filter(Review.counselor_id == counselor.id).all()
```

### 캐싱
```python
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.decorator import cache

@router.get("/counselors")
@cache(expire=60)  # 60초 캐시
async def get_counselors():
    return counselors
```

## 보안

### 입력 검증
```python
from pydantic import validator

class CounselorCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    
    @validator('phone')
    def validate_phone(cls, v):
        if not v.startswith('010-'):
            raise ValueError('Phone number must start with 010-')
        return v
```

### SQL 인젝션 방지
- SQLAlchemy ORM 사용으로 자동 방지
- 파라미터 바인딩 사용

### XSS 방지
- 입력 데이터 검증
- 출력 데이터 이스케이프

### CSRF 방지
- JWT 토큰 사용
- SameSite 쿠키 설정
