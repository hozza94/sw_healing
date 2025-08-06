# 배포 가이드

## 🚀 Vercel 배포 (추천)

### 1. Vercel 계정 생성
1. [vercel.com](https://vercel.com) 방문
2. GitHub 계정으로 로그인
3. "New Project" 클릭

### 2. 프로젝트 연결
```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 루트에서 실행
cd frontend
vercel login
vercel
```

### 3. 자동 배포 설정
- GitHub 저장소와 연결
- `main` 브랜치에 푸시할 때마다 자동 배포
- 커스텀 도메인 설정 가능

### 4. 환경 변수 설정
Vercel 대시보드에서 환경 변수 설정:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## 📄 GitHub Pages 배포

### 1. 정적 내보내기 설정
```bash
# next.config.ts에서 GitHub Pages 설정 활성화
# output: 'export' 주석 해제

# 빌드 및 내보내기
cd frontend
npm run export
```

### 2. GitHub 저장소 설정
1. GitHub 저장소 Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `gh-pages` 또는 `main`
4. Folder: `/docs` 또는 `/`

### 3. GitHub Actions 자동 배포
`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
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
        
    - name: Build and export
      run: |
        cd frontend
        npm run export
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./frontend/out
```

## 🌐 Netlify 배포

### 1. Netlify 계정 생성
1. [netlify.com](https://netlify.com) 방문
2. GitHub 계정으로 로그인

### 2. 프로젝트 연결
1. "New site from Git" 클릭
2. GitHub 저장소 선택
3. 빌드 설정:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/.next`

### 3. 환경 변수 설정
Netlify 대시보드에서 환경 변수 설정

## 🔧 배포 전 체크리스트

### 1. 환경 변수 확인
```bash
# .env.local 파일 생성
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. 빌드 테스트
```bash
cd frontend
npm run build
```

### 3. 정적 내보내기 테스트 (GitHub Pages용)
```bash
cd frontend
npm run export
```

## 📱 도메인 설정

### 커스텀 도메인
1. 도메인 구매 (예: GoDaddy, Namecheap)
2. DNS 설정에서 CNAME 레코드 추가
3. 배포 플랫폼에서 도메인 연결

### 무료 도메인
- Vercel: `your-project.vercel.app`
- Netlify: `your-project.netlify.app`
- GitHub Pages: `username.github.io/repository-name`

## 🔄 자동 배포 설정

### GitHub Actions (Vercel/Netlify)
- 저장소와 연결하면 자동 배포
- PR 생성 시 미리보기 배포

### 수동 배포
```bash
# Vercel
vercel --prod

# Netlify CLI
netlify deploy --prod
```

## 🐛 문제 해결

### 빌드 오류
1. 의존성 확인: `npm install`
2. TypeScript 오류 수정
3. 환경 변수 확인

### 배포 후 문제
1. 브라우저 캐시 삭제
2. 환경 변수 확인
3. API 엔드포인트 확인

## 📊 성능 최적화

### 이미지 최적화
```typescript
// next.config.ts
images: {
  domains: ['your-image-domain.com'],
  formats: ['image/webp', 'image/avif']
}
```

### 번들 크기 최적화
```bash
# 번들 분석
npm run build
npx @next/bundle-analyzer
```

## 🔒 보안 설정

### 환경 변수
- 민감한 정보는 환경 변수로 관리
- API 키는 서버 사이드에서만 사용

### HTTPS 강제
- 모든 배포 플랫폼에서 자동 HTTPS 제공
- HTTP → HTTPS 리다이렉트 설정 