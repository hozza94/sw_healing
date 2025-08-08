# 🗄️ 데이터베이스 설정 가이드

## 📋 개요

현재 프로젝트에서 사용할 수 있는 무료 데이터베이스 옵션들을 비교하고 설정 방법을 안내합니다.

## 🏆 추천 순위

1. **Supabase** - PostgreSQL 기반, 무료 플랜 우수
2. **PlanetScale** - MySQL 기반, 개발자 친화적
3. **Railway Database** - 간단하지만 비용 발생
4. **Turso** - SQLite 기반, 제한적

---

## 1. Supabase (추천)

### ✅ 장점
- **PostgreSQL 기반**: 강력한 관계형 데이터베이스
- **무료 플랜 우수**: 월 500MB, 2GB 대역폭
- **실시간 기능**: 실시간 구독 기능
- **인증 시스템**: 내장 인증 시스템
- **관리형 서비스**: 백업, 보안 자동 관리
- **REST API**: 자동 생성되는 REST API

### ❌ 단점
- **학습 곡선**: PostgreSQL 문법 학습 필요
- **제한된 무료 플랜**: 대용량 데이터 시 제한
- **지역 제한**: 일부 지역에서 접근 제한

### 💰 과금 체계
```
무료 플랜:
- 월 500MB 데이터베이스
- 월 2GB 대역폭
- 50,000 MAU (월간 활성 사용자)
- 2개 프로젝트

Pro 플랜: $25/월
- 월 8GB 데이터베이스
- 월 250GB 대역폭
- 무제한 MAU
- 무제한 프로젝트
```

### 🛠️ 설정 방법

#### 1. Supabase 계정 생성

1. [Supabase.com](https://supabase.com) 접속
2. GitHub 계정으로 로그인
3. 새 프로젝트 생성

#### 2. 프로젝트 설정

```
Project Name: suwon-healing
Database Password: 강력한 비밀번호 설정
Region: Asia Pacific (Singapore) - ap-southeast-1
```

#### 3. 데이터베이스 연결 정보 확인

**Settings** → **Database**에서 다음 정보 확인:
```
Host: db.xxxxxxxxxxxxx.supabase.co
Database: postgres
Port: 5432
User: postgres
Password: [설정한 비밀번호]
```

#### 4. 환경 변수 설정

배포 플랫폼에서 다음 환경 변수 설정:

```
DATABASE_URL=postgresql://postgres:[password]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

#### 5. 테이블 생성

Supabase Dashboard에서 SQL Editor 사용:

```sql
-- 사용자 테이블
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 상담사 테이블
CREATE TABLE counselors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(255),
    education TEXT,
    experience VARCHAR(50),
    certification VARCHAR(255),
    bio TEXT,
    is_online BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 상담 예약 테이블
CREATE TABLE consultations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    counselor_id INTEGER REFERENCES counselors(id),
    appointment_date TIMESTAMP NOT NULL,
    duration INTEGER DEFAULT 60,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 리뷰 테이블
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    counselor_id INTEGER REFERENCES counselors(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 공지사항 테이블
CREATE TABLE notices (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255),
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. PlanetScale

### ✅ 장점
- **MySQL 기반**: 친숙한 MySQL 문법
- **개발자 친화적**: CLI 도구 제공
- **무료 플랜**: 월 1GB, 1억 행
- **브랜치 기반**: Git과 유사한 브랜치 시스템
- **자동 백업**: 자동 백업 및 복구

### ❌ 단점
- **MySQL 제한**: PostgreSQL보다 제한적
- **지역 제한**: 미국 서버만 제공
- **무료 플랜 제한**: 대용량 데이터 시 제한

### 💰 과금 체계
```
무료 플랜:
- 월 1GB 데이터베이스
- 월 1억 행
- 1개 데이터베이스
- 1개 브랜치

Pro 플랜: $29/월
- 월 10GB 데이터베이스
- 월 10억 행
- 무제한 데이터베이스
- 무제한 브랜치
```

### 🛠️ 설정 방법

#### 1. PlanetScale 계정 생성

1. [PlanetScale.com](https://planetscale.com) 접속
2. GitHub 계정으로 로그인
3. 새 데이터베이스 생성

#### 2. 데이터베이스 설정

```
Database Name: suwon-healing
Region: US East (N. Virginia)
```

#### 3. 연결 정보 확인

**Connect** 탭에서 연결 정보 확인:
```
Host: aws.connect.psdb.cloud
Database: suwon-healing
User: [자동 생성된 사용자]
Password: [자동 생성된 비밀번호]
```

#### 4. 환경 변수 설정

```
DATABASE_URL=mysql://[user]:[password]@aws.connect.psdb.cloud:3306/suwon-healing?sslaccept=strict
```

---

## 3. Railway Database

### ✅ 장점
- **간단한 설정**: Railway 내에서 바로 생성
- **자동 연결**: Railway 앱과 자동 연결
- **관리형 서비스**: 백업, 보안 자동 관리

### ❌ 단점
- **비용 발생**: 무료 플랜 없음
- **제한적 기능**: 기본적인 데이터베이스 기능만
- **Railway 의존**: Railway 플랫폼에 종속

### 💰 과금 체계
```
유료 플랜:
- $5/월부터 시작
- 사용량에 따라 과금
- 예측하기 어려운 비용
```

---

## 🔧 프로젝트 설정

### 1. 데이터베이스 클라이언트 설정

`backend/app/database.py` 파일 수정:

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# 데이터베이스 URL 설정
DATABASE_URL = settings.DATABASE_URL

# 엔진 생성
engine = create_engine(DATABASE_URL)

# 세션 팩토리 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 베이스 클래스 생성
Base = declarative_base()

# 데이터베이스 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 테이블 생성
def create_tables():
    Base.metadata.create_all(bind=engine)
```

### 2. 환경 변수 설정

`backend/app/config.py` 파일 확인:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: str = "*"
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### 3. 마이그레이션 설정

Alembic을 사용한 마이그레이션:

```bash
# Alembic 초기화
alembic init alembic

# 마이그레이션 생성
alembic revision --autogenerate -m "Initial migration"

# 마이그레이션 적용
alembic upgrade head
```

---

## 📊 데이터베이스 비교

| 기능 | Supabase | PlanetScale | Railway |
|------|----------|-------------|---------|
| 데이터베이스 타입 | PostgreSQL | MySQL | PostgreSQL |
| 무료 플랜 | 500MB | 1GB | 없음 |
| 실시간 기능 | ✅ | ❌ | ❌ |
| 인증 시스템 | ✅ | ❌ | ❌ |
| REST API | ✅ | ❌ | ❌ |
| CLI 도구 | ✅ | ✅ | ❌ |
| 지역 | 글로벌 | 미국 | 글로벌 |

---

## 🚨 문제 해결

### 1. 연결 오류

**문제**: 데이터베이스 연결 실패
**해결**: 
- 연결 문자열 확인
- SSL 설정 확인
- 방화벽 설정 확인

### 2. 마이그레이션 오류

**문제**: 테이블 생성 실패
**해결**:
- SQL 문법 확인
- 권한 설정 확인
- 데이터베이스 크기 확인

### 3. 성능 문제

**문제**: 쿼리 속도 느림
**해결**:
- 인덱스 추가
- 쿼리 최적화
- 연결 풀 설정

---

## 💡 최적화 팁

### 1. 인덱스 추가

```sql
-- 사용자 이메일 인덱스
CREATE INDEX idx_users_email ON users(email);

-- 상담사 평점 인덱스
CREATE INDEX idx_counselors_rating ON counselors(rating);

-- 상담 예약 날짜 인덱스
CREATE INDEX idx_consultations_date ON consultations(appointment_date);
```

### 2. 연결 풀 설정

```python
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)
```

### 3. 백업 설정

- **Supabase**: 자동 백업 (무료 플랜: 7일)
- **PlanetScale**: 자동 백업 (무료 플랜: 7일)
- **Railway**: 수동 백업 필요

---

## 📝 체크리스트

### Supabase 설정
- [ ] 계정 생성
- [ ] 프로젝트 생성
- [ ] 데이터베이스 연결 정보 확인
- [ ] 환경 변수 설정
- [ ] 테이블 생성
- [ ] 마이그레이션 실행
- [ ] 연결 테스트

### PlanetScale 설정
- [ ] 계정 생성
- [ ] 데이터베이스 생성
- [ ] 연결 정보 확인
- [ ] 환경 변수 설정
- [ ] 스키마 생성
- [ ] 연결 테스트

### 공통 설정
- [ ] 백업 설정
- [ ] 모니터링 설정
- [ ] 보안 설정
- [ ] 성능 최적화

---

## 🎯 권장 설정

### 개발 환경
```
Database: Supabase (무료 플랜)
Backend: Render (무료 플랜)
Frontend: Vercel (무료 플랜)
```

### 프로덕션 환경
```
Database: Supabase Pro ($25/월)
Backend: Fly.io (무료 플랜)
Frontend: Vercel Pro ($20/월)
```

이렇게 설정하면 월 $45로 안정적인 서비스를 운영할 수 있습니다!
