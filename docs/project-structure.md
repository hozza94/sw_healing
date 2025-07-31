# 프로젝트 구조 및 개발 가이드

## 1. 프로젝트 구조

```
suwon_healing/
├── backend/                    # FastAPI 백엔드
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI 앱 진입점
│   │   ├── config.py          # 설정 파일
│   │   ├── database.py        # 데이터베이스 연결
│   │   ├── models/            # SQLAlchemy 모델
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── consultation.py
│   │   │   ├── review.py
│   │   │   └── healing.py
│   │   ├── schemas/           # Pydantic 스키마
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── consultation.py
│   │   │   └── review.py
│   │   ├── api/               # API 라우터
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py
│   │   │   │   ├── users.py
│   │   │   │   ├── consultations.py
│   │   │   │   └── reviews.py
│   │   │   └── deps.py        # 의존성 주입
│   │   ├── core/              # 핵심 기능
│   │   │   ├── __init__.py
│   │   │   ├── security.py    # JWT 인증
│   │   │   └── config.py      # 환경 설정
│   │   └── utils/             # 유틸리티 함수
│   │       ├── __init__.py
│   │       └── helpers.py
│   ├── requirements.txt        # Python 의존성
│   ├── alembic/               # 데이터베이스 마이그레이션
│   │   ├── versions/
│   │   └── alembic.ini
│   └── tests/                 # 백엔드 테스트
│       ├── __init__.py
│       ├── test_auth.py
│       └── test_consultations.py
├── frontend/                  # React 프론트엔드
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/        # 재사용 가능한 컴포넌트
│   │   │   ├── ui/           # shadcn/ui 컴포넌트
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Navigation.tsx
│   │   │   ├── forms/
│   │   │   │   ├── ConsultationForm.tsx
│   │   │   │   └── ReviewForm.tsx
│   │   │   └── common/
│   │   │       ├── Loading.tsx
│   │   │       └── ErrorBoundary.tsx
│   │   ├── pages/            # 페이지 컴포넌트
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Consultation.tsx
│   │   │   ├── Reviews.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── hooks/            # 커스텀 훅
│   │   │   ├── useAuth.ts
│   │   │   ├── useConsultation.ts
│   │   │   └── useReviews.ts
│   │   ├── services/         # API 서비스
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── consultation.ts
│   │   │   └── reviews.ts
│   │   ├── types/            # TypeScript 타입 정의
│   │   │   ├── user.ts
│   │   │   ├── consultation.ts
│   │   │   └── review.ts
│   │   ├── utils/            # 유틸리티 함수
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   ├── styles/           # 스타일 파일
│   │   │   └── globals.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── docs/                     # 문서
│   ├── requirements.md
│   ├── project-structure.md
│   ├── api-docs.md
│   └── deployment.md
├── docker/                   # Docker 설정
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── .gitignore
├── README.md
└── docker-compose.yml
```

## 2. 개발 환경 설정

### 2.1 백엔드 설정 (FastAPI)

```bash
# 백엔드 디렉토리 생성 및 설정
mkdir backend
cd backend

# Python 가상환경 생성
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic python-jose[cryptography] passlib[bcrypt] python-multipart
```

### 2.2 프론트엔드 설정 (React + shadcn/ui)

```bash
# 프론트엔드 디렉토리 생성
mkdir frontend
cd frontend

# Vite + React + TypeScript 프로젝트 생성
npm create vite@latest . -- --template react-ts

# 의존성 설치
npm install

# shadcn/ui 설정
npx shadcn@latest init
npx shadcn@latest add button card form input textarea
```

## 3. 데이터베이스 설정

### 3.1 PostgreSQL 설치 및 설정

```sql
-- 데이터베이스 생성
CREATE DATABASE suwon_healing;

-- 사용자 생성 (선택사항)
CREATE USER healing_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE suwon_healing TO healing_user;
```

### 3.2 환경 변수 설정

```bash
# backend/.env
DATABASE_URL=postgresql://healing_user:your_password@localhost:5432/suwon_healing
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 4. 개발 워크플로우

### 4.1 백엔드 개발

1. **모델 정의**: `app/models/` 디렉토리에 SQLAlchemy 모델 작성
2. **스키마 정의**: `app/schemas/` 디렉토리에 Pydantic 스키마 작성
3. **API 엔드포인트**: `app/api/v1/` 디렉토리에 라우터 작성
4. **마이그레이션**: Alembic을 사용하여 데이터베이스 스키마 관리

### 4.2 프론트엔드 개발

1. **컴포넌트 생성**: `src/components/` 디렉토리에 재사용 가능한 컴포넌트 작성
2. **페이지 구현**: `src/pages/` 디렉토리에 페이지 컴포넌트 작성
3. **API 연동**: `src/services/` 디렉토리에 API 호출 함수 작성
4. **상태 관리**: React Context 또는 Zustand를 사용하여 상태 관리

## 5. 테스트 전략

### 5.1 백엔드 테스트
- Unit 테스트: pytest 사용
- API 테스트: FastAPI TestClient 사용
- 데이터베이스 테스트: 테스트용 데이터베이스 사용

### 5.2 프론트엔드 테스트
- Unit 테스트: Vitest 사용
- 컴포넌트 테스트: React Testing Library 사용
- E2E 테스트: Playwright 사용

## 6. 배포 전략

### 6.1 개발 환경
- Docker Compose를 사용하여 로컬 개발 환경 구성
- Hot reload 지원

### 6.2 프로덕션 환경
- 백엔드: Docker + Nginx + Gunicorn
- 프론트엔드: Vercel 또는 Netlify
- 데이터베이스: AWS RDS 또는 클라우드 PostgreSQL

## 7. 코드 컨벤션

### 7.1 Python (Backend)
- Black을 사용한 코드 포맷팅
- isort를 사용한 import 정렬
- flake8을 사용한 린팅
- Type hints 사용

### 7.2 TypeScript (Frontend)
- ESLint + Prettier 설정
- TypeScript strict 모드 사용
- 컴포넌트 네이밍: PascalCase
- 파일 네이밍: kebab-case

## 8. Git 워크플로우

### 8.1 브랜치 전략
- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치
- `hotfix/*`: 긴급 수정 브랜치

### 8.2 커밋 메시지 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 프로세스 또는 보조 도구 변경
``` 