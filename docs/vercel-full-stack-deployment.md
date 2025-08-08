# 🚀 Vercel 전체 스택 배포 가이드

## 📋 개요

Vercel을 사용하여 Next.js 프론트엔드와 FastAPI 백엔드를 모두 배포하는 방법입니다.

## ✅ Vercel 선택 이유

- **매우 빠른 속도**: 글로벌 CDN으로 즉시 응답
- **무료 플랜 우수**: 월 100GB 대역폭
- **Next.js 최적화**: 자동 최적화
- **서버리스 함수**: API 라우트 지원
- **자동 배포**: Git 연동으로 자동 배포

## 🛠️ 배포 방법

### 방법 1: Next.js API Routes 사용 (추천)

프론트엔드와 백엔드를 모두 Next.js로 통합:

```typescript
// frontend/src/app/api/health/route.ts
export async function GET() {
  return Response.json({ status: "healthy" });
}

// frontend/src/app/api/counselors/route.ts
export async function GET() {
  // 상담사 목록 API
  return Response.json({ counselors: [] });
}
```

### 방법 2: Vercel Functions 사용

FastAPI를 Vercel Functions로 변환:

```python
# frontend/api/index.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Vercel Functions용 핸들러
from http.server import BaseHTTPRequestHandler

def handler(request):
    return app(request)
```

## 🚀 배포 단계

### 1. Vercel 계정 생성
1. [Vercel.com](https://vercel.com) 접속
2. GitHub 계정으로 로그인

### 2. 프로젝트 배포
1. **New Project** 클릭
2. GitHub 저장소 선택: `suwon_healing`
3. **Framework Preset**: Next.js 선택
4. **Root Directory**: `frontend` 선택

### 3. 환경 변수 설정
```
DATABASE_URL=libsql://swhealing-hozza.aws-ap-northeast-1.turso.io
DATABASE_AUTH_TOKEN=your_auth_token
SECRET_KEY=your_secret_key
```

### 4. 빌드 설정
```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

## 💰 비용 비교

| 플랫폼 | 무료 플랜 | 속도 | 설정 난이도 |
|--------|-----------|------|-------------|
| **Vercel** | 월 100GB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Railway** | 월 $5 크레딧 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Render** | 월 $7 크레딧 | ⭐⭐ | ⭐⭐⭐ |
| **Fly.io** | $1.94/월부터 | ⭐⭐⭐⭐ | ⭐⭐ |

## 🎯 권장 설정

### 개발 단계 (무료)
```
Frontend: Vercel (무료)
Backend: Vercel API Routes (무료)
Database: Turso (무료)
```

### 프로덕션 단계 (월 $20)
```
Frontend: Vercel Pro ($20/월)
Backend: Vercel Pro Functions
Database: Turso Pro ($29/월)
```

## 🔧 프로젝트 구조 변경

### 1. API Routes 생성

```typescript
// frontend/src/app/api/counselors/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Turso 데이터베이스 연결
    const counselors = await getCounselors()
    return NextResponse.json(counselors)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const counselor = await createCounselor(body)
    return NextResponse.json(counselor)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

### 2. 데이터베이스 연결

```typescript
// frontend/src/lib/database.ts
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

export async function getCounselors() {
  const result = await client.execute('SELECT * FROM counselors')
  return result.rows
}
```

## 🌐 도메인 설정

### 자동 도메인
```
https://suwon-healing.vercel.app
```

### 커스텀 도메인
1. **Settings** → **Domains**
2. **Add Domain** 클릭
3. 도메인 입력 및 DNS 설정

## 📊 모니터링

### 1. Analytics
- **Vercel Analytics**: 실시간 트래픽 모니터링
- **Speed Insights**: 성능 분석

### 2. Functions
- **Functions** 탭에서 API 호출 모니터링
- **Logs** 탭에서 오류 확인

## 🚨 문제 해결

### 1. 함수 실행 시간 제한
- **문제**: 10초 제한
- **해결**: 복잡한 로직은 배치 처리

### 2. 메모리 제한
- **문제**: 1024MB 제한
- **해결**: 효율적인 코드 작성

### 3. 콜드 스타트
- **문제**: 첫 요청 지연
- **해결**: 정기적인 핑 요청

## 💡 최적화 팁

### 1. 캐싱 활용
```typescript
export async function GET() {
  const cached = await getCachedData()
  if (cached) return NextResponse.json(cached)
  
  const data = await fetchData()
  await cacheData(data)
  return NextResponse.json(data)
}
```

### 2. 이미지 최적화
```typescript
import Image from 'next/image'

export default function CounselorCard({ counselor }) {
  return (
    <Image
      src={counselor.image}
      alt={counselor.name}
      width={200}
      height={200}
      priority
    />
  )
}
```

## 📝 체크리스트

- [ ] Vercel 계정 생성
- [ ] GitHub 저장소 연결
- [ ] 환경 변수 설정
- [ ] API Routes 생성
- [ ] 데이터베이스 연결
- [ ] 도메인 설정
- [ ] 모니터링 설정

## 🎯 다음 단계

1. **Vercel 배포**: 전체 스택 배포
2. **API 테스트**: 모든 엔드포인트 확인
3. **성능 최적화**: 캐싱 및 최적화
4. **모니터링**: Analytics 설정

Vercel로 배포하면 Render보다 훨씬 빠르고 안정적일 것입니다! 🚀
