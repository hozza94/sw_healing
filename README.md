# 수원 힐링 상담센터 홈페이지

상담센터의 온라인 존재감을 확립하고 고객의 편의한 상담 신청 및 조회 서비스를 제공하는 웹 애플리케이션입니다.

## 🚀 기술 스택

### Full-Stack (Vercel 배포)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Turso (SQLite)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **API**: Next.js API Routes
- **Deployment**: Vercel

## 📁 프로젝트 구조

```
suwon_healing/
├── docs/              # 문서
├── backend/           # 기존 FastAPI 백엔드 (참고용)
├── frontend/          # Next.js 프론트엔드 + API Routes
└── README.md
```

## 🌐 배포된 사이트

- **프로덕션**: https://swhealing.vercel.app
- **API 엔드포인트**: https://swhealing.vercel.app/api/*

## 🛠️ 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn

### 1. 저장소 클론
```bash
git clone <repository-url>
cd suwon_healing
```

### 2. 프론트엔드 설정
```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 3. 환경 변수 설정 (개발용)
```bash
# frontend/.env.local 파일 생성
DATABASE_URL=libsql://swhealing-hozza.aws-ap-northeast-1.turso.io
DATABASE_AUTH_TOKEN=your_turso_token_here
SECRET_KEY=your_secret_key_here
```

## 📊 데이터베이스

### 현재 상태
- **데이터베이스**: Turso (SQLite)
- **위치**: AWS ap-northeast-1
- **테이블**: 5개 (users, counselors, consultations, notices, reviews)

### API 엔드포인트

#### 헬스 체크
```
GET /api/health
```

#### 상담사 관리
```
GET /api/counselors     # 상담사 목록
POST /api/counselors    # 상담사 등록
```

#### 상담 예약
```
GET /api/consultations  # 상담 목록
POST /api/consultations # 상담 신청
```

#### 리뷰 관리
```
GET /api/reviews        # 리뷰 목록
POST /api/reviews       # 리뷰 작성
```

#### 공지사항
```
GET /api/notices        # 공지사항 목록
POST /api/notices       # 공지사항 등록
```

## 🚀 배포

### Vercel 배포
이 프로젝트는 Vercel에 자동 배포됩니다.

1. **GitHub 연동**: main 브랜치에 푸시하면 자동 배포
2. **환경 변수**: Vercel 대시보드에서 설정
3. **도메인**: https://swhealing.vercel.app

### 배포 가이드
자세한 배포 방법은 `docs/vercel-deployment-guide.md`를 참조하세요.

## 📚 문서

- `docs/vercel-deployment-guide.md` - Vercel 배포 가이드
- `docs/vercel-full-stack-deployment.md` - 전체 스택 배포 상세 가이드
- `docs/database-design.md` - 데이터베이스 설계
- `docs/api-development-guide.md` - API 개발 가이드

## 🔧 개발 도구

### 데이터베이스 확인 (백엔드 폴더)
```bash
cd backend
python check_db.py
```

### 샘플 데이터 삽입
```bash
cd backend
python insert_sample_data.py
```

## 📝 주요 기능

- ✅ 상담사 소개 및 예약
- ✅ 상담 신청 및 관리
- ✅ 리뷰 시스템
- ✅ 공지사항 관리
- ✅ 반응형 디자인
- ✅ SEO 최적화

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

