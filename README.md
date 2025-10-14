# 수원 힐링 상담센터 홈페이지

상담센터의 온라인 존재감을 확립하고 고객의 편의한 상담 신청 및 조회 서비스를 제공하는 웹 애플리케이션입니다.

## 🚀 기술 스택

### 프론트엔드 (Cloudflare Pages)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Build**: Static Export (`output: 'export'`)
- **Deployment**: Cloudflare Pages

### 백엔드 (Cloudflare Workers)
- **Runtime**: Cloudflare Workers (JavaScript)
- **Database**: Turso (SQLite)
- **API**: REST API
- **Deployment**: Wrangler CLI
- **Legacy**: FastAPI 코드는 `fastapi-legacy/` 폴더에 보관

## 📁 프로젝트 구조

```
sw_healing/
├── docs/              # 문서
├── backend/           # 백엔드 (Cloudflare Workers)
│   ├── src/           # Workers 소스 코드
│   │   └── index.js   # Workers JavaScript
│   ├── fastapi-legacy/# FastAPI 레거시 코드 (참고용)
│   │   └── app/       # 기존 FastAPI 구조
│   └── wrangler.toml  # Workers 설정
├── frontend/          # Next.js 프론트엔드
│   ├── src/           # 소스 코드
│   └── next.config.js # Next.js 설정
├── setup_turso_db.js  # 데이터베이스 설정 스크립트
└── README.md
```

## 🌐 배포된 사이트

- **프로덕션 프론트엔드**: https://sw-healing.pages.dev
- **프로덕션 백엔드**: https://sw-healing-api.hozza94.workers.dev
- **개발 프론트엔드**: https://develop-sw-healing.pages.dev (예상)
- **개발 백엔드**: https://dev-sw-healing-api.workers.dev

## 🛠️ 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn
- Wrangler CLI (Cloudflare Workers)

### 1. 저장소 클론
```bash
git clone https://github.com/hozza94/sw_healing.git
cd sw_healing
```

### 2. 의존성 설치
```bash
# 프론트엔드 의존성 설치
npm install

# 백엔드 의존성 설치
cd backend

# Node.js 의존성 (Workers)
npm install

# Wrangler CLI 설치 (전역)
npm install -g wrangler

cd ..
```

### 3. 환경 변수 설정
```bash
# frontend/.env.local 파일 생성
NEXT_PUBLIC_API_URL=https://sw-healing-api.hozza94.workers.dev
NEXT_PUBLIC_APP_NAME=수원 힐링 상담센터
```

### 4. 개발 서버 실행
```bash
# 프론트엔드 개발 서버
npm run dev
# http://localhost:3000

# 백엔드 개발 서버
cd backend
wrangler dev
# http://localhost:8787
```

## 📊 데이터베이스

### 현재 상태
- **데이터베이스**: Turso (SQLite)
- **위치**: AWS ap-northeast-1
- **URL**: `libsql://swhealing-hozza.aws-ap-northeast-1.turso.io`
- **테이블**: 5개 (users, counselors, consultations, notices, reviews)
- **데이터**: 상담사 5명, 사용자 4명, 공지사항 9개, 리뷰 9개

### 데이터베이스 설정
```bash
# 최초 1회 실행
node setup_turso_db.js
```

## 🔌 API 엔드포인트

### 백엔드 API (Cloudflare Workers)
- **Base URL**: https://sw-healing-api.hozza94.workers.dev

#### 헬스 체크
```
GET /api/health
```

#### 상담사 관리
```
GET /api/counselors        # 상담사 목록 (5명)
GET /api/counselors/{id}   # 특정 상담사 정보
```

#### 상담 예약
```
GET /api/consultations     # 상담 목록
POST /api/consultations    # 상담 신청
```

#### 리뷰 관리
```
GET /api/reviews           # 리뷰 목록
GET /api/reviews/{id}      # 특정 리뷰 정보
```

#### 공지사항
```
GET /api/notices           # 공지사항 목록
GET /api/notices/{id}      # 특정 공지사항 정보
```

## 🚀 배포

### 자동 배포 (Cloudflare Pages)
- **프론트엔드**: GitHub main 브랜치에 푸시하면 자동 배포
- **도메인**: https://sw-healing.pages.dev

### 수동 배포 (Cloudflare Workers)
- **백엔드**: Wrangler CLI로 수동 배포
- **명령어**: `wrangler deploy --env production`
- **도메인**: https://sw-healing-api.hozza94.workers.dev

### 배포 가이드
자세한 배포 방법은 `docs/development-guide.md`를 참조하세요.

## 📚 문서

- `docs/development-guide.md` - 개발 가이드 (브랜치 전략, 워크플로우)
- `docs/cloudflare-migration-guide.md` - Cloudflare 마이그레이션 가이드
- `turso_schema.sql` - 데이터베이스 스키마

## 🔧 개발 도구

### 데이터베이스 관리
```bash
# 데이터베이스 설정 및 샘플 데이터 삽입
node setup_turso_db.js

# API 테스트
curl https://sw-healing-api.hozza94.workers.dev/api/health
curl https://sw-healing-api.hozza94.workers.dev/api/counselors
```

### 백엔드 배포
```bash
cd backend

# 프로덕션 배포
wrangler deploy --env production

# 개발 환경 배포
wrangler deploy --env development
```

## 📝 주요 기능

- ✅ 상담사 소개 및 예약 (5명의 전문 상담사)
- ✅ 상담 신청 및 관리
- ✅ 리뷰 시스템 (모달 기반 상세보기)
- ✅ 공지사항 관리 (모달 기반 상세보기)
- ✅ 반응형 디자인
- ✅ 정적 빌드 최적화
- ✅ 실제 데이터베이스 연결

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

