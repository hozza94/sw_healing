# 수원 힐링 상담센터 홈페이지

상담센터의 온라인 존재감을 확립하고 고객의 편의한 상담 신청 및 조회 서비스를 제공하는 웹 애플리케이션입니다.

## 🚀 기술 스택

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT
- **Validation**: Pydantic

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

## 📁 프로젝트 구조

```
suwon_healing/
├── docs/              # 문서
├── backend/           # FastAPI 백엔드
├── frontend/          # Next.js 프론트엔드
└── docker-compose.yml # 개발 환경
```

## 🛠️ 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Docker & Docker Compose

### 1. 저장소 클론
```bash
git clone <repository-url>
cd suwon_healing
```

### 2. 백엔드 설정
```bash
cd backend

# 가상환경 생성
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# 환경변수 설정
cp .env.example .env
# .env 파일을 편집하여 데이터베이스 설정

# 데이터베이스 마이그레이션
alembic upgrade head

# 서버 실행
uvicorn app.main:app --reload
```

### 3. 프론트엔드 설정
```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 4. Docker로 전체 실행
```bash
# 전체 서비스 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

## 📚 주요 기능

### 1. 소개 페이지
- 상담센터 소개
- 센터장 소개
- 센터 위치 및 연락처

### 2. 상담 신청
- 온라인 상담 신청 폼
- 상담 분야별 신청
- 일정 선택 및 관리

### 3. 상담 후기
- 상담 완료 후 후기 작성
- 별점 평가 시스템
- 후기 검색 및 필터링

### 4. 공지사항
- 관리자 공지사항 관리
- 공지사항 분류 및 검색
- 중요도별 정렬

### 5. 상담 조회
- 온라인 상담사 조회
- 회원 상담 내역 조회
- 실시간 상담사 상태

## 🔧 개발 가이드

### API 문서
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 데이터베이스 마이그레이션
```bash
# 새 마이그레이션 생성
alembic revision --autogenerate -m "description"

# 마이그레이션 적용
alembic upgrade head

# 마이그레이션 되돌리기
alembic downgrade -1
```

### 테스트 실행
```bash
# 백엔드 테스트
cd backend
pytest

# 프론트엔드 테스트
cd frontend
npm test
```

## 🚀 배포

### 프로덕션 환경
- **Frontend**: Vercel
- **Backend**: Railway/Render
- **Database**: PostgreSQL (Railway/Render 제공)

### 환경변수 설정
프로덕션 환경에서 필요한 환경변수:
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `SECRET_KEY`: JWT 시크릿 키
- `CORS_ORIGINS`: 허용된 프론트엔드 도메인
- `EMAIL_HOST`: 이메일 서버 설정
- `AWS_ACCESS_KEY_ID`: S3 파일 저장소 (선택적)

## 📝 문서

- [요구사항 정의서](docs/requirements.md)
- [프로젝트 구조](docs/project-structure.md)
- [API 문서](docs/api-documentation.md)
- [배포 가이드](docs/deployment-guide.md)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 관련 문의사항이 있으시면 이슈를 생성해주세요.

---

**수원 힐링 상담센터** - 고객의 마음을 치유하는 온라인 공간 🌟

