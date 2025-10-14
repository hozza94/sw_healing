# Cloudflare 마이그레이션 가이드

## 📋 개요

현재 Vercel에 배포된 Next.js 풀스택 애플리케이션을 Cloudflare로 마이그레이션하여 백엔드와 프론트엔드를 분리하여 관리하는 방법을 설명합니다.

## 🎯 마이그레이션 목표

- **백엔드**: FastAPI → Cloudflare Workers
- **프론트엔드**: Next.js → Cloudflare Pages
- **데이터베이스**: Turso (유지) 또는 Cloudflare D1
- **독립적 배포**: 각 서비스별 독립적인 배포 및 관리

## 🏗️ 아키텍처 설계

### 현재 구조
```
Vercel (Next.js 풀스택)
├── Frontend (React/Next.js)
├── API Routes (Next.js API)
└── Database (Turso)
```

### 마이그레이션 후 구조
```
Cloudflare
├── Frontend (Cloudflare Pages)
│   └── Next.js Static Export
├── Backend (Cloudflare Workers)
│   └── FastAPI → Workers
└── Database (Turso 또는 D1)
```

## 📊 배포 옵션 비교

| 서비스 | 현재 | 마이그레이션 후 | 장점 |
|--------|------|----------------|------|
| **프론트엔드** | Vercel | Cloudflare Pages | - 글로벌 CDN<br>- 무료 티어<br>- 빠른 배포 |
| **백엔드** | Next.js API | Cloudflare Workers | - Edge Computing<br>- 낮은 지연시간<br>- 자동 스케일링 |
| **데이터베이스** | Turso | Turso/D1 | - Cloudflare 네이티브<br>- 무료 티어 |

## 🚀 마이그레이션 진행 순서

### Phase 1: 환경 준비 및 분석
1. **Cloudflare 계정 설정**
   - Cloudflare 계정 생성
   - 도메인 등록 (선택사항)
   - API 토큰 생성

2. **현재 프로젝트 분석**
   - API 엔드포인트 목록 정리
   - 환경 변수 정리
   - 의존성 분석

### Phase 2: 백엔드 마이그레이션
3. **FastAPI → Cloudflare Workers 변환**
   - FastAPI 코드를 Workers 호환 형태로 변환
   - Python 런타임 설정
   - API 라우팅 구조 변경

4. **데이터베이스 연결 설정**
   - Turso 연결 유지 또는 D1로 마이그레이션
   - 연결 풀 최적화
   - 환경 변수 설정

5. **백엔드 배포 및 테스트**
   - Wrangler CLI 설정
   - Workers 배포
   - API 엔드포인트 테스트

### Phase 3: 프론트엔드 마이그레이션
6. **Next.js 정적 빌드 설정**
   - `next.config.js` 수정
   - API 호출 URL 변경
   - 정적 파일 최적화

7. **Cloudflare Pages 배포**
   - GitHub 연동 설정
   - 빌드 설정 구성
   - 자동 배포 설정

8. **CORS 및 통신 설정**
   - 백엔드 CORS 설정
   - 프론트엔드 API 클라이언트 수정
   - 통신 테스트

### Phase 4: 최적화 및 모니터링
9. **성능 최적화**
   - CDN 캐싱 설정
   - 이미지 최적화
   - 번들 크기 최적화

10. **모니터링 및 로깅**
    - Cloudflare Analytics 설정
    - 에러 추적 설정
    - 성능 모니터링

## 🛠️ 기술적 세부사항

### 백엔드 마이그레이션 (FastAPI → Workers)

#### 1. Python 런타임 설정
```toml
# wrangler.toml
[env.production]
name = "suwon-healing-api"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

[[env.production.r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "my-bucket"
```

#### 2. FastAPI 코드 변환
```python
# 기존 FastAPI 구조를 Workers 호환으로 변환
from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()

# Workers 핸들러
handler = Mangum(app)
```

#### 3. 데이터베이스 연결
```python
# Turso 연결 (기존 유지)
import libsql_experimental as libsql

client = libsql.create_client_sync(
    url=os.getenv("DATABASE_URL"),
    auth_token=os.getenv("DATABASE_AUTH_TOKEN")
)
```

### 프론트엔드 마이그레이션 (Next.js → Pages)

#### 1. 정적 빌드 설정
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  }
}

module.exports = nextConfig
```

#### 2. API 클라이언트 수정
```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.suwon-healing.com'

export const apiClient = {
  get: (endpoint: string) => fetch(`${API_BASE_URL}${endpoint}`),
  post: (endpoint: string, data: any) => fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}
```

## 🔧 필요한 도구 및 설정

### 1. Cloudflare CLI
```bash
npm install -g wrangler
wrangler login
```

### 2. 환경 변수 설정
```bash
# 백엔드 (Workers)
DATABASE_URL=libsql://your-database.turso.io
DATABASE_AUTH_TOKEN=your-token
SECRET_KEY=your-secret-key

# 프론트엔드 (Pages)
NEXT_PUBLIC_API_URL=https://api.suwon-healing.com
```

### 3. GitHub Actions (자동 배포)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
```

## 📈 예상 효과

### 성능 개선
- **지연시간**: Edge Computing으로 50-70% 감소
- **전송 속도**: 글로벌 CDN으로 2-3배 향상
- **가용성**: 99.9% 이상 가용성 보장

### 비용 절감
- **무료 티어**: 월 100,000 요청 무료
- **스케일링**: 사용량에 따른 자동 스케일링
- **CDN**: 무료 글로벌 CDN

### 개발 효율성
- **독립 배포**: 백엔드/프론트엔드 독립적 배포
- **버전 관리**: 각 서비스별 버전 관리
- **모니터링**: 통합 모니터링 대시보드

## ⚠️ 주의사항 및 제약사항

### Cloudflare Workers 제약
- **실행 시간**: 30초 제한 (Pro 플랜: 60초)
- **메모리**: 128MB 제한
- **파일 시스템**: 제한적 파일 시스템 접근

### Next.js 정적 빌드 제약
- **API Routes**: 정적 빌드에서는 사용 불가
- **서버 사이드 렌더링**: 제한적
- **동적 라우팅**: 사전 빌드 필요

## 🎯 마이그레이션 체크리스트

### 사전 준비
- [ ] Cloudflare 계정 생성
- [ ] 현재 API 엔드포인트 문서화
- [ ] 환경 변수 정리
- [ ] 의존성 분석

### 백엔드 마이그레이션
- [ ] FastAPI 코드 Workers 호환성 검토
- [ ] 데이터베이스 연결 테스트
- [ ] API 엔드포인트 변환
- [ ] Workers 배포 및 테스트

### 프론트엔드 마이그레이션
- [ ] Next.js 정적 빌드 설정
- [ ] API 클라이언트 수정
- [ ] Pages 배포 설정
- [ ] CORS 설정

### 통합 테스트
- [ ] 전체 시스템 통합 테스트
- [ ] 성능 테스트
- [ ] 에러 처리 테스트
- [ ] 모니터링 설정

## 📞 다음 단계

1. **Phase 1 시작**: Cloudflare 계정 설정 및 프로젝트 분석
2. **백엔드 우선**: FastAPI → Workers 변환부터 시작
3. **점진적 마이그레이션**: 단계별 테스트 및 검증
4. **모니터링**: 성능 및 에러 추적 설정

---

이 가이드를 따라 단계별로 마이그레이션을 진행하면 안전하고 효율적으로 Cloudflare로 이전할 수 있습니다.
