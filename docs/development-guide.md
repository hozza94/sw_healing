# 수원 힐링 상담센터 개발 가이드

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [개발 환경 설정](#개발-환경-설정)
4. [브랜치 전략](#브랜치-전략)
5. [개발 워크플로우](#개발-워크플로우)
6. [배포 프로세스](#배포-프로세스)
7. [환경 변수 관리](#환경-변수-관리)
8. [로컬 개발 가이드](#로컬-개발-가이드)
9. [문제 해결 가이드](#문제-해결-가이드)

## 🏗️ 프로젝트 개요

### 아키텍처
```
프론트엔드 (Next.js)     백엔드 (Cloudflare Workers)
├── Cloudflare Pages    ├── Cloudflare Workers
├── 정적 빌드           ├── Turso 데이터베이스
└── 모달 기반 UI        └── REST API
```

### 배포 URL
- **프로덕션 프론트엔드**: https://sw-healing.pages.dev
- **프로덕션 백엔드**: https://sw-healing-api.hozza94.workers.dev
- **개발 프론트엔드**: https://develop-sw-healing.pages.dev (예상)
- **개발 백엔드**: https://dev-sw-healing-api.workers.dev

## 🛠️ 기술 스택

### 프론트엔드
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Build**: Static Export (`output: 'export'`)
- **Deployment**: Cloudflare Pages

### 백엔드
- **Runtime**: Cloudflare Workers (JavaScript)
- **Database**: Turso (SQLite)
- **API**: REST API
- **Deployment**: Wrangler CLI

### 데이터베이스
- **Provider**: Turso
- **URL**: `libsql://swhealing-hozza.aws-ap-northeast-1.turso.io`
- **Schema**: `turso_schema.sql`

## ⚙️ 개발 환경 설정

### 필수 도구
```bash
# Node.js (v18+)
node --version

# npm
npm --version

# Git
git --version

# Wrangler CLI (Cloudflare Workers)
npm install -g wrangler
wrangler --version
```

### 프로젝트 설정
```bash
# 저장소 클론
git clone https://github.com/hozza94/sw_healing.git
cd sw_healing

# 프론트엔드 의존성 설치
npm install

# 백엔드 의존성 설치
cd backend
npm install
cd ..

# 환경 변수 설정
cp frontend/.env.example frontend/.env.local
# .env.local 파일에 필요한 값들 설정
```

### 환경 변수
```bash
# frontend/.env.local
DATABASE_URL=libsql://swhealing-hozza.aws-ap-northeast-1.turso.io
DATABASE_AUTH_TOKEN=your_turso_token_here
SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_API_URL=https://sw-healing-api.hozza94.workers.dev
NEXT_PUBLIC_APP_NAME=수원 힐링 상담센터
```

## 🌿 브랜치 전략

### 브랜치 구조
```
main (프로덕션)
├── develop (개발/테스트)
├── feature/새기능 (기능 개발)
└── hotfix/긴급수정 (긴급 수정)
```

### 브랜치 규칙
- **main**: 프로덕션 환경, 안정적인 코드만
- **develop**: 개발 환경, 통합 테스트용
- **feature/***: 새 기능 개발
- **hotfix/***: 긴급 버그 수정

## 🔄 개발 워크플로우

### 1. 기능 개발 프로세스

#### Step 1: 개발 브랜치 생성
```bash
# develop 브랜치로 이동
git checkout develop
git pull origin develop

# 새 기능 브랜치 생성
git checkout -b feature/새기능명
```

#### Step 2: 개발 작업
```bash
# 프론트엔드 개발
cd frontend
npm run dev  # 로컬 서버 시작 (http://localhost:3000)

# 백엔드 개발 (필요시)
cd backend
wrangler dev  # 로컬 Workers 서버 시작
```

#### Step 3: 로컬 테스트
```bash
# 프론트엔드 빌드 테스트
npm run build
npm run start

# TypeScript 타입 체크
npm run type-check

# 린트 검사
npm run lint
```

#### Step 4: 커밋 및 푸시
```bash
# 변경사항 스테이징
git add .

# 커밋 (커밋 메시지 규칙)
git commit -m "feat: 새 기능 추가"
# 또는
git commit -m "fix: 버그 수정"
git commit -m "docs: 문서 업데이트"

# 브랜치 푸시
git push origin feature/새기능명
```

#### Step 5: develop에 머지
```bash
# develop 브랜치로 이동
git checkout develop
git pull origin develop

# 기능 브랜치 머지
git merge feature/새기능명

# develop 푸시 (자동으로 테스트 환경 배포)
git push origin develop
```

### 2. 프로덕션 배포 프로세스

#### Step 1: develop → main 머지
```bash
# main 브랜치로 이동
git checkout main
git pull origin main

# develop 머지
git merge develop

# main 푸시 (자동으로 프로덕션 배포)
git push origin main
```

#### Step 2: 백엔드 배포 (필요시)
```bash
cd backend

# 프로덕션 배포
wrangler deploy --env production

# 개발 환경 배포
wrangler deploy --env development
```

### 3. 긴급 수정 프로세스

#### Hotfix 브랜치 사용
```bash
# main에서 hotfix 브랜치 생성
git checkout main
git checkout -b hotfix/긴급수정명

# 수정 작업
# ... 코드 수정 ...

# 커밋 및 푸시
git add .
git commit -m "hotfix: 긴급 버그 수정"
git push origin hotfix/긴급수정명

# main에 머지
git checkout main
git merge hotfix/긴급수정명
git push origin main

# develop에도 머지 (동기화)
git checkout develop
git merge main
git push origin develop
```

## 🚀 배포 프로세스

### 자동 배포 (Cloudflare Pages)
- **main 브랜치**: 프로덕션 자동 배포
- **develop 브랜치**: 개발 환경 자동 배포
- **기타 브랜치**: 프리뷰 배포

### 수동 배포 (Cloudflare Workers)

#### 백엔드 배포 명령어
```bash
# 프로덕션 배포
wrangler deploy --env production

# 개발 환경 배포
wrangler deploy --env development

# 환경 변수 설정
wrangler secret put DATABASE_AUTH_TOKEN --env production
wrangler secret put DATABASE_AUTH_TOKEN --env development
```

#### 배포 확인
```bash
# API 헬스 체크
curl https://sw-healing-api.hozza94.workers.dev/api/health

# 상담사 목록 확인
curl https://sw-healing-api.hozza94.workers.dev/api/counselors
```

## 🔐 환경 변수 관리

### 프론트엔드 환경 변수
```bash
# .env.local (로컬 개발용)
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_APP_NAME=수원 힐링 상담센터 (개발)

# .env.production (프로덕션용)
NEXT_PUBLIC_API_URL=https://sw-healing-api.hozza94.workers.dev
NEXT_PUBLIC_APP_NAME=수원 힐링 상담센터
```

### 백엔드 환경 변수
```toml
# wrangler.toml
[env.development.vars]
CORS_ORIGINS = "https://develop-sw-healing.pages.dev,http://localhost:3000"
DATABASE_URL = "libsql://swhealing-hozza.aws-ap-northeast-1.turso.io"

[env.production.vars]
CORS_ORIGINS = "https://sw-healing.pages.dev,https://app.suwon-healing.com"
DATABASE_URL = "libsql://swhealing-hozza.aws-ap-northeast-1.turso.io"
```

### 시크릿 관리
```bash
# 데이터베이스 인증 토큰 설정
wrangler secret put DATABASE_AUTH_TOKEN --env production
wrangler secret put DATABASE_AUTH_TOKEN --env development

# 시크릿 목록 확인
wrangler secret list --env production
```

## 💻 로컬 개발 가이드

### 프론트엔드 개발
```bash
cd frontend

# 개발 서버 시작
npm run dev
# http://localhost:3000

# 빌드 테스트
npm run build
npm run start

# 타입 체크
npm run type-check

# 린트 검사
npm run lint
```

### 백엔드 개발
```bash
cd backend

# 로컬 Workers 서버 시작
wrangler dev
# http://localhost:8787

# 프로덕션 배포
wrangler deploy --env production
```

### 데이터베이스 관리
```bash
# 데이터베이스 설정 (최초 1회)
node setup_turso_db.js

# 데이터베이스 연결 테스트
node -e "
const { createClient } = require('@libsql/client');
const client = createClient({
  url: 'libsql://swhealing-hozza.aws-ap-northeast-1.turso.io',
  authToken: 'your_token_here'
});
client.execute('SELECT COUNT(*) FROM counselors').then(result => 
  console.log('상담사 수:', result.rows[0].count)
);
"
```

## 🔧 문제 해결 가이드

### 자주 발생하는 문제들

#### 1. 빌드 실패
```bash
# TypeScript 오류 확인
npm run type-check

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

#### 2. API 연결 실패
```bash
# 백엔드 상태 확인
curl https://sw-healing-api.hozza94.workers.dev/api/health

# 환경 변수 확인
echo $NEXT_PUBLIC_API_URL
```

#### 3. 데이터베이스 연결 실패
```bash
# 인증 토큰 확인
wrangler secret list --env production

# 데이터베이스 직접 테스트
node setup_turso_db.js
```

#### 4. CORS 오류
```bash
# CORS 설정 확인
# backend/wrangler.toml의 CORS_ORIGINS 확인
```

### 디버깅 팁

#### 프론트엔드 디버깅
```bash
# 브라우저 개발자 도구
# Network 탭에서 API 요청 확인
# Console 탭에서 에러 메시지 확인
```

#### 백엔드 디버깅
```bash
# Wrangler 로그 확인
wrangler tail --env production

# 로컬에서 디버깅
wrangler dev --local
```

## 📝 커밋 메시지 규칙

### 형식
```
type: description

[optional body]

[optional footer]
```

### 타입
- **feat**: 새 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 코드 포맷팅, 세미콜론 누락 등
- **refactor**: 코드 리팩토링
- **test**: 테스트 코드 추가/수정
- **chore**: 빌드 프로세스, 의존성 관리 등

### 예시
```bash
git commit -m "feat: 상담사 상세보기 모달 추가"
git commit -m "fix: API 응답 데이터 파싱 오류 수정"
git commit -m "docs: 개발 가이드 문서 추가"
```

## 🎯 체크리스트

### 개발 시작 전
- [ ] develop 브랜치에서 작업 시작
- [ ] 로컬 환경 설정 완료
- [ ] 필요한 의존성 설치

### 개발 중
- [ ] 로컬에서 테스트 완료
- [ ] TypeScript 오류 없음
- [ ] 린트 오류 없음
- [ ] 빌드 성공

### 배포 전
- [ ] develop 브랜치에서 테스트 완료
- [ ] 테스트 환경에서 검증 완료
- [ ] 백엔드 배포 필요시 확인

### 배포 후
- [ ] 프로덕션 환경에서 동작 확인
- [ ] API 엔드포인트 정상 동작 확인
- [ ] 데이터베이스 연결 확인

---

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. 이 가이드의 문제 해결 섹션
2. GitHub Issues
3. 개발팀 문의

**마지막 업데이트**: 2025-01-14
