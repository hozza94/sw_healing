# 🚀 Vercel 배포 환경 변수 설정 가이드

## 📋 개요

Next.js API Routes를 사용하여 Vercel에 전체 스택을 배포하는 방법입니다.

## 🌐 Vercel 환경 변수 설정

### 1. Vercel 대시보드에서 환경 변수 설정

1. **Vercel Dashboard** → **프로젝트 선택**
2. **Settings** → **Environment Variables**
3. 다음 환경 변수들을 추가:

#### 필수 환경 변수
```
DATABASE_URL=libsql://swhealing-hozza.aws-ap-northeast-1.turso.io
DATABASE_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiI2NTE5YTM5Zi1kZTc5LTQxNGYtOTA0ZC1kOGI2NDliMDZmN2MiLCJpYXQiOjE3NTQ0NDMzOTksInJpZCI6IjA5OGQzZTNhLWE0OWMtNGQ0NC04MGIxLWVjOTM3MzY4YjQ5MSJ9.FZgSEU3NZJj7lhaLHfnNg6KxoLUGO9u9MLsa9nLI3HBCKVf6Ke1O4-m0WMs_CQdtcLEAYL3xNIID8E8HnRqzAA
SECRET_KEY=your-super-secret-key-here-change-in-production
```

### 2. 환경별 설정

#### Production 환경
- **Environment**: Production
- **Preview Environment**: Production

#### Development 환경
- **Environment**: Development
- **Preview Environment**: Development

## 🔧 배포 설정

### 1. 프로젝트 설정 확인
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 2. 자동 배포 설정
- **Auto-Deploy**: Yes
- **Branch**: main

## 🌐 API 엔드포인트 테스트

배포 완료 후 다음 엔드포인트들을 테스트해보세요:

### 1. 헬스 체크
```
GET https://your-project.vercel.app/api/health
```

### 2. 상담사 목록
```
GET https://your-project.vercel.app/api/counselors
```

### 3. 상담 예약
```
GET https://your-project.vercel.app/api/consultations
```

### 4. 리뷰 목록
```
GET https://your-project.vercel.app/api/reviews
```

### 5. 공지사항
```
GET https://your-project.vercel.app/api/notices
```

## 🚨 문제 해결

### 1. 환경 변수 오류
**문제**: `DATABASE_URL is not defined`
**해결**: Vercel 대시보드에서 환경 변수 확인

### 2. 데이터베이스 연결 오류
**문제**: `Failed to connect to database`
**해결**: Turso 토큰 확인 및 갱신

### 3. API Routes 오류
**문제**: `500 Internal Server Error`
**해결**: Vercel Functions 로그 확인

## 📊 모니터링

### 1. Vercel Functions 로그
- **Functions** 탭에서 API 호출 모니터링
- **Logs** 탭에서 오류 확인

### 2. 성능 모니터링
- **Analytics** 탭에서 트래픽 확인
- **Speed Insights**에서 성능 분석

## 💡 최적화 팁

### 1. 캐싱 활용
```typescript
// API Routes에서 캐싱 설정
export async function GET() {
  const response = NextResponse.json(data)
  response.headers.set('Cache-Control', 's-maxage=3600')
  return response
}
```

### 2. 에러 핸들링
```typescript
export async function GET() {
  try {
    // API 로직
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

## 📝 체크리스트

- [ ] Vercel 프로젝트 생성
- [ ] 환경 변수 설정
- [ ] 자동 배포 활성화
- [ ] API 엔드포인트 테스트
- [ ] 데이터베이스 연결 확인
- [ ] 프론트엔드 연동 확인

## 🎯 다음 단계

1. **환경 변수 설정**: Vercel 대시보드에서 설정
2. **배포 확인**: 자동 배포 완료 대기
3. **API 테스트**: 모든 엔드포인트 확인
4. **프론트엔드 테스트**: 웹사이트 기능 확인

이제 Vercel에서 전체 스택이 완벽하게 작동할 것입니다! 🚀
