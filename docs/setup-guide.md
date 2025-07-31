# 개발환경 세팅 가이드

## 📋 사전 요구사항

다음 소프트웨어들이 시스템에 설치되어 있어야 합니다:

- **Python 3.11+** (https://python.org)
- **Node.js 18+** (https://nodejs.org)
- **PostgreSQL 13+** (https://postgresql.org)
- **Git** (https://git-scm.com)

## 🚀 빠른 시작 (Docker 사용)

가장 간단한 방법은 Docker를 사용하는 것입니다:

```bash
# 1. 프로젝트 클론
git clone <repository-url>
cd suwon_healing

# 2. Docker Compose로 전체 환경 실행
docker-compose up -d

# 3. 데이터베이스 마이그레이션 실행
docker-compose exec backend alembic upgrade head
```

이제 다음 URL에서 접속할 수 있습니다:
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

## 🔧 수동 설치 (개발용)

### 1단계: 백엔드 설정

```bash
# 1. Python 가상환경 생성
cd backend
python3 -m venv venv

# 2. 가상환경 활성화
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. 의존성 설치
pip install -r requirements.txt

# 4. 환경변수 설정
cp env.example .env
# .env 파일을 편집하여 실제 값으로 수정
```

### 2단계: 데이터베이스 설정

```bash
# 1. PostgreSQL 설치 (이미 설치되어 있다면 생략)
# Windows: https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql postgresql-contrib

# 2. PostgreSQL 서비스 시작
# Windows: 서비스에서 PostgreSQL 시작
# macOS: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql

# 3. 데이터베이스 생성
psql -U postgres
CREATE DATABASE suwon_healing;
CREATE USER healing_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE suwon_healing TO healing_user;
\q

# 4. Alembic 초기화
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### 3단계: 프론트엔드 설정

```bash
# 1. Node.js 의존성 설치
cd frontend
npm install

# 2. shadcn/ui 초기화
npx shadcn@latest init

# 3. 필요한 컴포넌트 설치
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add form
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add dropdown-menu
npx shadcn@latest add navigation-menu
npx shadcn@latest add tabs
npx shadcn@latest add progress
npx shadcn@latest add alert
npx shadcn@latest add toast
```

### 4단계: 개발 서버 실행

```bash
# 터미널 1: 백엔드 서버
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 터미널 2: 프론트엔드 서버
cd frontend
npm run dev
```

## 🔐 환경변수 설정

### 백엔드 (.env 파일)

```env
# Database
DATABASE_URL=postgresql://healing_user:your_password@localhost:5432/suwon_healing

# Security
SECRET_KEY=your-secret-key-here-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API
API_V1_STR=/api/v1
PROJECT_NAME=Suwon Healing Counseling Center

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]

# Environment
ENVIRONMENT=development
DEBUG=True
```

### 프론트엔드 (.env 파일)

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Suwon Healing
```

## 🧪 테스트 실행

```bash
# 백엔드 테스트
cd backend
pytest

# 프론트엔드 테스트
cd frontend
npm test
```

## 📦 빌드 및 배포

```bash
# 백엔드 빌드
cd backend
pip install -r requirements.txt

# 프론트엔드 빌드
cd frontend
npm run build
```

## 🔧 문제 해결

### 일반적인 문제들:

1. **포트 충돌**
   - 백엔드: `--port 8001` 옵션 사용
   - 프론트엔드: `--port 3001` 옵션 사용

2. **데이터베이스 연결 실패**
   - PostgreSQL 서비스가 실행 중인지 확인
   - 데이터베이스 사용자 권한 확인
   - 방화벽 설정 확인

3. **의존성 설치 실패**
   - Python/Node.js 버전 확인
   - 가상환경 활성화 확인
   - 네트워크 연결 확인

4. **CORS 오류**
   - 백엔드 CORS 설정 확인
   - 프론트엔드 API URL 확인

## 📚 추가 리소스

- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [React 공식 문서](https://react.dev/)
- [shadcn/ui 문서](https://ui.shadcn.com/)
- [Tailwind CSS 문서](https://tailwindcss.com/)
- [PostgreSQL 문서](https://www.postgresql.org/docs/)

## 🆘 도움말

문제가 발생하면 다음을 확인하세요:

1. 모든 사전 요구사항이 설치되어 있는지 확인
2. 환경변수가 올바르게 설정되어 있는지 확인
3. 데이터베이스가 실행 중인지 확인
4. 포트가 사용 가능한지 확인
5. 로그를 확인하여 구체적인 오류 메시지 확인 