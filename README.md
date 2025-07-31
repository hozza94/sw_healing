# 수원 힐링 상담센터 웹사이트

상담 신청, 관리, 후기 공유를 위한 종합적인 웹 플랫폼입니다.

## 🚀 주요 기능

- **상담 신청 및 관리**: 온라인 상담 신청 및 진행 상태 추적
- **12단계 상담 프로세스**: 체계적인 상담 진행 시스템
- **상담 후기 공유**: 사용자들의 상담 경험 공유
- **사용자 관리**: 회원가입, 로그인, 개인 정보 관리
- **체크리스트 시스템**: 상황별 맞춤 체크리스트 제공

## 🛠 기술 스택

### Backend
- **FastAPI**: 고성능 Python 웹 프레임워크
- **PostgreSQL**: 관계형 데이터베이스
- **SQLAlchemy**: ORM
- **Alembic**: 데이터베이스 마이그레이션
- **JWT**: 인증 시스템

### Frontend
- **React 18**: 사용자 인터페이스
- **TypeScript**: 타입 안전성
- **shadcn/ui**: 모던 UI 컴포넌트 라이브러리
- **Tailwind CSS**: 스타일링
- **Vite**: 빌드 도구

## 📁 프로젝트 구조

```
suwon_healing/
├── backend/          # FastAPI 백엔드
├── frontend/         # React 프론트엔드
├── docs/            # 프로젝트 문서
└── docker/          # Docker 설정
```

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone <repository-url>
cd suwon_healing
```

### 2. 백엔드 설정

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. 프론트엔드 설정

```bash
cd frontend
npm install
```

### 4. 환경 변수 설정

백엔드 `.env` 파일 생성:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/suwon_healing
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

프론트엔드 `.env` 파일 생성:
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=수원 힐링 상담센터
```

### 5. 데이터베이스 설정

```bash
# PostgreSQL 설치 및 데이터베이스 생성
CREATE DATABASE suwon_healing;
CREATE USER healing_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE suwon_healing TO healing_user;
```

### 6. 서버 실행

```bash
# 백엔드 서버 (새 터미널)
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 프론트엔드 서버 (새 터미널)
cd frontend
npm run dev
```

## 📚 문서

- [요구사항 정의서](docs/requirements.md)
- [프로젝트 구조](docs/project-structure.md)
- [API 문서](docs/api-docs.md)
- [배포 가이드](docs/deployment.md)

## 🔧 개발

### 백엔드 개발

```bash
cd backend
# 가상환경 활성화
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 개발 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 테스트 실행
pytest

# 마이그레이션
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### 프론트엔드 개발

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 테스트
npm run test
```

## 🐳 Docker 사용

```bash
# 전체 서비스 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 서비스 중지
docker-compose down
```

## 📊 데이터베이스 스키마

### 주요 테이블

- `users`: 사용자 정보
- `consultation_requests`: 상담 신청
- `reviews`: 상담 후기
- `healing_sangdam_1st` ~ `healing_sangdam_12th`: 12단계 상담 데이터
- `checklists`: 체크리스트

## 🔐 보안

- JWT 기반 인증
- 비밀번호 해싱 (bcrypt)
- CORS 설정
- SQL Injection 방지
- XSS 방지

## 🚀 배포

### 개발 환경
- Docker Compose를 사용한 로컬 개발 환경
- Hot reload 지원

### 프로덕션 환경
- 백엔드: Docker + Nginx + Gunicorn
- 프론트엔드: Vercel 또는 Netlify
- 데이터베이스: AWS RDS 또는 클라우드 PostgreSQL

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 관련 문의사항이 있으시면 이슈를 생성해 주세요.

## 🙏 감사의 말

- [shadcn/ui](https://ui.shadcn.com/) - 아름다운 UI 컴포넌트
- [FastAPI](https://fastapi.tiangolo.com/) - 고성능 웹 프레임워크
- [React](https://reactjs.org/) - 사용자 인터페이스 라이브러리 