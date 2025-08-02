# 🌐 GitHub Pages + 백엔드 분리 배포 가이드

## 📋 개요

GitHub Pages는 정적 웹사이트만 호스팅할 수 있으므로, 다음과 같이 분리 배포합니다:

- **프론트엔드**: GitHub Pages (무료)
- **백엔드**: 별도 서버 (Railway, Heroku, AWS 등)

## 🎯 배포 전략

### **옵션 1: GitHub Pages + Railway (추천)**
- **프론트엔드**: GitHub Pages (무료)
- **백엔드**: Railway ($5-20/월)
- **총 비용**: $5-20/월

### **옵션 2: GitHub Pages + Vercel**
- **프론트엔드**: GitHub Pages (무료)
- **백엔드**: Vercel Functions (무료 티어)
- **총 비용**: $0-20/월

### **옵션 3: GitHub Pages + Heroku**
- **프론트엔드**: GitHub Pages (무료)
- **백엔드**: Heroku (무료 티어 종료)
- **총 비용**: $7-25/월

## 🚀 GitHub Pages 설정

### **1. 프론트엔드 빌드 설정**

```json
// frontend/package.json에 추가
{
  "homepage": "https://[username].github.io/suwon_healing",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### **2. GitHub Pages 배포 스크립트**

```bash
# scripts/deploy-github-pages.sh
#!/bin/bash

echo "🚀 GitHub Pages 배포 시작..."

# 프론트엔드 빌드
cd frontend
npm run build

# GitHub Pages 배포
npm run deploy

echo "✅ GitHub Pages 배포 완료!"
echo "🌐 사이트: https://[username].github.io/suwon_healing"
```

### **3. 환경 변수 설정**

```bash
# frontend/.env.production
VITE_API_BASE_URL=https://your-backend-url.com
VITE_APP_NAME=수원 힐링 상담센터
```

## 🔧 백엔드 분리 배포

### **Railway 배포 (추천)**

#### 1. Railway 프로젝트 생성
```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 초기화
cd backend
railway init
```

#### 2. 환경 변수 설정
```bash
# Railway 대시보드에서 설정
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
ALLOWED_ORIGINS=https://[username].github.io
```

#### 3. 배포
```bash
railway up
```

### **Vercel 배포**

#### 1. Vercel 프로젝트 생성
```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 프로젝트 배포
cd backend
vercel --prod
```

#### 2. 환경 변수 설정
```bash
# Vercel 대시보드에서 설정
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
ALLOWED_ORIGINS=https://[username].github.io
```

## 📁 프로젝트 구조 변경

### **1. 프론트엔드 GitHub Pages용 설정**

```typescript
// frontend/src/config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
};
```

### **2. CORS 설정 업데이트**

```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://[username].github.io",  # GitHub Pages 도메인 추가
        "https://suwonhealing.com"  # 커스텀 도메인
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🔄 자동 배포 설정

### **1. GitHub Actions 워크플로우**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd frontend
          npm install
          
      - name: Build
        run: |
          cd frontend
          npm run build
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Railway
        run: |
          cd backend
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### **2. 환경 변수 설정**

GitHub 저장소 설정에서 다음 시크릿 추가:
- `RAILWAY_TOKEN`: Railway API 토큰
- `VERCEL_TOKEN`: Vercel API 토큰 (Vercel 사용 시)

## 🌐 커스텀 도메인 설정

### **1. GitHub Pages 커스텀 도메인**

1. GitHub 저장소 설정 → Pages
2. Custom domain에 `suwonhealing.com` 입력
3. DNS 설정:
   ```
   Type: CNAME
   Name: @
   Value: [username].github.io
   ```

### **2. SSL 인증서**

GitHub Pages는 자동으로 SSL 인증서를 제공합니다.

## 📊 모니터링 및 분석

### **1. Google Analytics 설정**

```html
<!-- frontend/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### **2. 에러 추적 (Sentry)**

```typescript
// frontend/src/utils/errorTracking.ts
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

## 💰 비용 비교

| 배포 방식 | 프론트엔드 | 백엔드 | 총 비용/월 |
|-----------|------------|--------|------------|
| **GitHub Pages + Railway** | 무료 | $5-20 | $5-20 |
| **GitHub Pages + Vercel** | 무료 | $0-20 | $0-20 |
| **전체 AWS** | $20-50 | $20-50 | $40-100 |
| **전체 Vercel** | $20 | $20 | $40 |

## 🚨 주의사항

### **1. GitHub Pages 제한사항**
- 정적 파일만 호스팅 가능
- 서버 사이드 렌더링 불가
- 데이터베이스 직접 연결 불가

### **2. 백엔드 분리 시 고려사항**
- CORS 설정 필수
- API 엔드포인트 URL 관리
- 환경별 설정 분리

### **3. 보안 고려사항**
- API 키 노출 주의
- 환경 변수 관리
- HTTPS 강제 리다이렉트

## 🎯 추천 배포 순서

### **1단계: GitHub Pages 설정 (1시간)**
```bash
# 1. GitHub 저장소 설정
# 2. 프론트엔드 빌드 설정
# 3. GitHub Actions 워크플로우 설정
```

### **2단계: 백엔드 배포 (2시간)**
```bash
# 1. Railway/Vercel 계정 생성
# 2. 백엔드 프로젝트 배포
# 3. 환경 변수 설정
# 4. CORS 설정 업데이트
```

### **3단계: 연동 테스트 (1시간)**
```bash
# 1. 프론트엔드-백엔드 연동 테스트
# 2. API 호출 테스트
# 3. 에러 처리 확인
```

### **4단계: 커스텀 도메인 설정 (30분)**
```bash
# 1. 도메인 구매
# 2. DNS 설정
# 3. SSL 인증서 확인
```

이 방식으로 하면 **월 $5-20**으로 안정적인 웹사이트를 운영할 수 있습니다! 🎉 