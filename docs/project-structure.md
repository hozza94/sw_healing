# 프로젝트 구조

## 전체 구조

```
suwon_healing/
├── docs/                          # 문서 폴더
│   ├── requirements.md            # 요구사항 정의서
│   ├── project-structure.md       # 프로젝트 구조 문서
│   ├── api-documentation.md       # API 문서
│   └── deployment-guide.md        # 배포 가이드
├── backend/                       # FastAPI 백엔드
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI 앱 진입점
│   │   ├── config.py             # 설정 파일
│   │   ├── database.py           # 데이터베이스 설정
│   │   ├── models/               # SQLAlchemy 모델
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── counselor.py
│   │   │   ├── consultation.py
│   │   │   ├── review.py
│   │   │   ├── notice.py
│   │   │   └── appointment.py
│   │   ├── schemas/              # Pydantic 스키마
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── counselor.py
│   │   │   ├── consultation.py
│   │   │   ├── review.py
│   │   │   ├── notice.py
│   │   │   └── appointment.py
│   │   ├── api/                  # API 라우터
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── counselors.py
│   │   │   ├── consultations.py
│   │   │   ├── reviews.py
│   │   │   ├── notices.py
│   │   │   └── appointments.py
│   │   ├── core/                 # 핵심 기능
│   │   │   ├── __init__.py
│   │   │   ├── security.py       # JWT 인증
│   │   │   ├── email.py          # 이메일 발송
│   │   │   └── utils.py          # 유틸리티 함수
│   │   ├── services/             # 비즈니스 로직
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── consultation_service.py
│   │   │   ├── review_service.py
│   │   │   └── notice_service.py
│   │   └── dependencies.py       # 의존성 주입
│   ├── alembic/                  # 데이터베이스 마이그레이션
│   │   ├── versions/
│   │   └── alembic.ini
│   ├── tests/                    # 테스트 코드
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   ├── test_consultations.py
│   │   ├── test_reviews.py
│   │   └── test_notices.py
│   ├── requirements.txt           # Python 의존성
│   ├── Dockerfile                # Docker 설정
│   └── .env.example              # 환경변수 예시
├── frontend/                     # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/                  # App Router
│   │   │   ├── layout.tsx        # 루트 레이아웃
│   │   │   ├── page.tsx          # 홈페이지
│   │   │   ├── about/            # 소개 페이지
│   │   │   │   ├── page.tsx
│   │   │   │   └── director.tsx
│   │   │   ├── consultation/     # 상담 신청
│   │   │   │   ├── page.tsx
│   │   │   │   └── form.tsx
│   │   │   ├── reviews/          # 후기
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── notices/          # 공지사항
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── counselors/       # 상담사 조회
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── auth/             # 인증
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   └── admin/            # 관리자
│   │   │       ├── page.tsx
│   │   │       ├── consultations/
│   │   │       ├── reviews/
│   │   │       └── notices/
│   │   ├── components/           # 재사용 컴포넌트
│   │   │   ├── ui/               # shadcn/ui 컴포넌트
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   └── ...
│   │   │   ├── layout/           # 레이아웃 컴포넌트
│   │   │   │   ├── header.tsx
│   │   │   │   ├── footer.tsx
│   │   │   │   └── navigation.tsx
│   │   │   ├── forms/            # 폼 컴포넌트
│   │   │   │   ├── consultation-form.tsx
│   │   │   │   ├── review-form.tsx
│   │   │   │   └── auth-form.tsx
│   │   │   └── common/           # 공통 컴포넌트
│   │   │       ├── loading.tsx
│   │   │       ├── error.tsx
│   │   │       └── pagination.tsx
│   │   ├── lib/                  # 유틸리티 라이브러리
│   │   │   ├── utils.ts
│   │   │   ├── api.ts            # API 클라이언트
│   │   │   ├── auth.ts           # 인증 관련
│   │   │   └── constants.ts      # 상수
│   │   ├── hooks/                # 커스텀 훅
│   │   │   ├── use-auth.ts
│   │   │   ├── use-api.ts
│   │   │   └── use-form.ts
│   │   ├── types/                # TypeScript 타입
│   │   │   ├── user.ts
│   │   │   ├── consultation.ts
│   │   │   ├── review.ts
│   │   │   └── notice.ts
│   │   └── styles/               # 스타일
│   │       └── globals.css
│   ├── public/                   # 정적 파일
│   │   ├── images/
│   │   ├── icons/
│   │   └── favicon.ico
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml            # 개발 환경 Docker Compose
├── .gitignore
├── README.md
└── package.json                  # 루트 package.json (모노레포)
```

## 기술 스택 상세

### Backend (FastAPI)
- **Framework**: FastAPI 0.104+
- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy 2.0+
- **Authentication**: JWT
- **Validation**: Pydantic 2.0+
- **Migration**: Alembic
- **Testing**: pytest
- **Documentation**: OpenAPI/Swagger

### Frontend (Next.js)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand (선택적)
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios 또는 fetch
- **Testing**: Jest + React Testing Library

### Development Tools
- **Package Manager**: npm/yarn/pnpm
- **Version Control**: Git
- **Code Quality**: ESLint, Prettier
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (Frontend), Railway/Render (Backend)

## 환경 설정

### 개발 환경
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Docker & Docker Compose

### 프로덕션 환경
- Vercel (Frontend)
- Railway/Render (Backend)
- PostgreSQL (Railway/Render 제공)
- AWS S3 (파일 저장소)

## 보안 고려사항

### Backend
- CORS 설정
- Rate Limiting
- Input Validation
- SQL Injection 방지
- XSS 방지
- CSRF 토큰

### Frontend
- HTTPS 강제
- Content Security Policy
- Input Sanitization
- Secure Cookie 설정

## 성능 최적화

### Backend
- 데이터베이스 인덱싱
- 쿼리 최적화
- 캐싱 (Redis)
- 비동기 처리

### Frontend
- 이미지 최적화
- 코드 스플리팅
- Lazy Loading
- CDN 활용 