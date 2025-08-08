# 🚀 Render 배포 가이드

## 📋 개요

Render는 무료 플랜이 우수하고 설정이 간단한 배포 플랫폼입니다. 현재 프로젝트의 FastAPI 백엔드를 Render에 배포하는 방법을 안내합니다.

## ✅ Render 선택 이유

- **무료 플랜**: 월 $7 크레딧 (소규모 프로젝트 충분)
- **15분 슬립**: 비용 절약 효과
- **GitHub 연동**: 자동 배포
- **SSL 자동 설정**: HTTPS 무료 제공
- **환경 변수 관리**: 웹 UI로 쉽게 설정

## 🛠️ 배포 단계

### 1. Render 계정 생성

1. [Render.com](https://render.com) 접속
2. GitHub 계정으로 로그인
3. 이메일 인증 완료

### 2. 새 Web Service 생성

1. **Dashboard** → **New** → **Web Service**
2. **Connect a repository** 클릭
3. GitHub 저장소 연결
4. 저장소 선택: `suwon_healing`

### 3. 서비스 설정

```
Name: suwon-healing-backend
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 4. 환경 변수 설정

**Environment Variables** 섹션에서 다음 변수들을 추가:

```
DATABASE_URL=your_database_url_here
SECRET_KEY=your_secret_key_here
ENVIRONMENT=production
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

### 5. 고급 설정

**Advanced** 섹션에서:

- **Auto-Deploy**: Yes (GitHub 푸시 시 자동 배포)
- **Branch**: main
- **Health Check Path**: /health

## 🔧 프로젝트 설정

### 1. render.yaml 파일 확인

이미 생성된 `backend/render.yaml` 파일이 올바른지 확인:

```yaml
services:
  - type: web
    name: suwon-healing-backend
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        value: your_database_url_here
      - key: SECRET_KEY
        value: your_secret_key_here
```

### 2. requirements.txt 확인

`backend/requirements.txt`에 필요한 패키지들이 모두 포함되어 있는지 확인:

```
fastapi
uvicorn
sqlalchemy
psycopg2-binary
python-multipart
python-jose[cryptography]
passlib[bcrypt]
```

### 3. 헬스 체크 엔드포인트 확인

`backend/app/main.py`에 헬스 체크 엔드포인트가 있는지 확인:

```python
@app.get("/health")
async def health_check():
    """헬스 체크"""
    return {"status": "healthy"}
```

## 🌐 도메인 설정

### 1. 자동 도메인

배포 완료 후 자동으로 생성되는 도메인:
```
https://suwon-healing-backend.onrender.com
```

### 2. 커스텀 도메인 (선택사항)

1. **Settings** → **Custom Domains**
2. **Add Domain** 클릭
3. 도메인 입력 및 DNS 설정

## 📊 모니터링

### 1. 로그 확인

- **Logs** 탭에서 실시간 로그 확인
- **Build Logs**: 빌드 과정 로그
- **Runtime Logs**: 실행 중 로그

### 2. 메트릭 확인

- **Metrics** 탭에서 성능 지표 확인
- CPU, 메모리 사용량 모니터링
- 응답 시간 확인

## 🔄 자동 배포 설정

### 1. GitHub 연동

1. **Settings** → **Build & Deploy**
2. **Auto-Deploy** 활성화
3. **Branch**: main 선택

### 2. 배포 알림

1. **Settings** → **Notifications**
2. Slack 또는 Discord 웹훅 설정
3. 배포 성공/실패 알림 받기

## 🚨 문제 해결

### 1. 빌드 실패

**문제**: requirements.txt 오류
**해결**: 패키지 버전 확인 및 수정

### 2. 런타임 오류

**문제**: 환경 변수 누락
**해결**: Environment Variables 확인

### 3. 슬립 모드 지연

**문제**: 첫 요청 시 30초 지연
**해결**: 정기적인 헬스 체크 설정

## 💰 비용 관리

### 1. 무료 플랜 한계

- 월 $7 크레딧
- 750시간/월 (약 31일)
- 512MB RAM
- 0.1 CPU

### 2. 비용 절약 팁

1. **15분 슬립 활용**: 자동 슬립 기능 활용
2. **사용량 모니터링**: Metrics 탭에서 사용량 확인
3. **불필요한 서비스 중지**: 사용하지 않는 서비스 삭제

## 🔗 프론트엔드 연동

### 1. CORS 설정

프론트엔드 도메인을 CORS_ORIGINS에 추가:

```
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

### 2. API 엔드포인트 업데이트

프론트엔드의 API 설정에서 Render URL로 변경:

```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = 'https://suwon-healing-backend.onrender.com';
```

## 📝 체크리스트

- [ ] Render 계정 생성
- [ ] GitHub 저장소 연결
- [ ] 환경 변수 설정
- [ ] 헬스 체크 엔드포인트 확인
- [ ] 자동 배포 설정
- [ ] 로그 모니터링 설정
- [ ] 프론트엔드 CORS 설정
- [ ] API 엔드포인트 업데이트

## 🎯 다음 단계

1. **데이터베이스 설정**: Supabase 또는 PlanetScale 연결
2. **프론트엔드 배포**: Vercel에 Next.js 배포
3. **도메인 설정**: 커스텀 도메인 연결
4. **모니터링**: 성능 및 오류 모니터링 설정
