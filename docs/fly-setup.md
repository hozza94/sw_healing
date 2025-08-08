# 🚀 Fly.io 배포 가이드

## 📋 개요

Fly.io는 관대한 무료 플랜과 글로벌 CDN을 제공하는 배포 플랫폼입니다. CLI 기반으로 관리되며, Docker 컨테이너를 지원합니다.

## ✅ Fly.io 선택 이유

- **관대한 무료 플랜**: 3개 앱까지 무료
- **글로벌 CDN**: 빠른 응답 속도
- **자동 스케일링**: 트래픽에 따라 자동 조정
- **Docker 지원**: 컨테이너 기반 배포
- **CLI 도구**: 명령어로 쉽게 관리
- **무료 SSL**: 자동 HTTPS 설정

## 🛠️ 사전 준비

### 1. Fly CLI 설치

**Windows (Git Bash)**:
```bash
curl -L https://fly.io/install.sh | sh
```

**macOS**:
```bash
brew install flyctl
```

**Linux**:
```bash
curl -L https://fly.io/install.sh | sh
```

### 2. 계정 생성 및 로그인

1. [Fly.io](https://fly.io) 접속
2. GitHub 계정으로 가입
3. CLI에서 로그인:

```bash
fly auth login
```

## 🚀 배포 단계

### 1. 프로젝트 디렉토리 이동

```bash
cd backend
```

### 2. Fly 앱 생성

```bash
fly launch
```

이 명령어는 다음을 수행합니다:
- 앱 이름 설정
- 지역 선택
- Dockerfile 생성 (필요시)
- fly.toml 설정 파일 생성

### 3. 앱 설정 확인

`fly.toml` 파일이 올바르게 생성되었는지 확인:

```toml
app = "suwon-healing-backend"
primary_region = "nrt"

[build]

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[http_service.checks]]
  grace_period = "10s"
  interval = "30s"
  method = "GET"
  timeout = "5s"
  path = "/health"
```

### 4. 환경 변수 설정

```bash
fly secrets set DATABASE_URL="your_database_url_here"
fly secrets set SECRET_KEY="your_secret_key_here"
fly secrets set ENVIRONMENT="production"
fly secrets set CORS_ORIGINS="https://your-frontend.vercel.app"
```

### 5. 배포 실행

```bash
fly deploy
```

## 🔧 프로젝트 설정

### 1. Dockerfile 생성 (필요시)

만약 `fly launch`에서 Dockerfile을 생성하지 않았다면:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### 2. .dockerignore 파일

```dockerignore
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env
pip-log.txt
pip-delete-this-directory.txt
.tox
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.mypy_cache
.pytest_cache
.hypothesis
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
https://suwon-healing-backend.fly.dev
```

### 2. 커스텀 도메인 설정

```bash
fly certs add your-domain.com
```

DNS 설정:
```
CNAME your-domain.com -> suwon-healing-backend.fly.dev
```

## 📊 모니터링

### 1. 앱 상태 확인

```bash
fly status
```

### 2. 로그 확인

```bash
fly logs
```

실시간 로그:
```bash
fly logs --follow
```

### 3. 메트릭 확인

```bash
fly dashboard
```

웹 브라우저에서 대시보드 열기:
```bash
fly dashboard --web
```

## 🔄 자동 배포 설정

### 1. GitHub Actions 설정

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to Fly.io

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Fly.io
        uses: superfly/flyctl-actions/setup-flyctl@master
      
      - name: Deploy app
        run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### 2. Fly API 토큰 설정

1. Fly.io 대시보드에서 API 토큰 생성
2. GitHub 저장소의 Secrets에 추가:
   - `FLY_API_TOKEN`: 생성한 API 토큰

## 🚨 문제 해결

### 1. 배포 실패

**문제**: Docker 빌드 오류
**해결**: Dockerfile 확인 및 수정

```bash
fly logs
```

### 2. 환경 변수 오류

**문제**: 환경 변수 누락
**해결**: secrets 재설정

```bash
fly secrets list
fly secrets set KEY="value"
```

### 3. 메모리 부족

**문제**: 앱이 메모리 부족으로 재시작
**해결**: 리소스 할당 증가

```bash
fly scale memory 512
```

## 💰 비용 관리

### 1. 무료 플랜 한계

- 3개 앱까지 무료
- 3GB 저장소
- 160GB 대역폭/월
- 3개 공유 IP

### 2. 비용 절약 팁

1. **자동 스케일링 활용**: `min_machines_running = 0`
2. **사용량 모니터링**: `fly dashboard`로 확인
3. **불필요한 앱 삭제**: 사용하지 않는 앱 제거

## 🔗 프론트엔드 연동

### 1. CORS 설정

프론트엔드 도메인을 CORS_ORIGINS에 추가:

```bash
fly secrets set CORS_ORIGINS="https://your-frontend.vercel.app,http://localhost:3000"
```

### 2. API 엔드포인트 업데이트

프론트엔드의 API 설정에서 Fly.io URL로 변경:

```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = 'https://suwon-healing-backend.fly.dev';
```

## 🛠️ 유용한 명령어

### 앱 관리
```bash
fly apps list          # 앱 목록
fly status             # 앱 상태
fly logs               # 로그 확인
fly dashboard          # 대시보드 열기
```

### 배포 관리
```bash
fly deploy             # 배포
fly deploy --remote-only  # 원격 빌드
fly deploy --local-only   # 로컬 빌드
```

### 환경 변수 관리
```bash
fly secrets list       # 시크릿 목록
fly secrets set KEY="value"  # 시크릿 설정
fly secrets unset KEY  # 시크릿 삭제
```

### 스케일링
```bash
fly scale count 1      # 인스턴스 수 조정
fly scale memory 512   # 메모리 조정
fly scale vm shared-cpu-1x  # VM 타입 변경
```

## 📝 체크리스트

- [ ] Fly CLI 설치
- [ ] 계정 생성 및 로그인
- [ ] 앱 생성 (`fly launch`)
- [ ] 환경 변수 설정
- [ ] 헬스 체크 엔드포인트 확인
- [ ] 배포 실행
- [ ] 로그 확인
- [ ] 프론트엔드 CORS 설정
- [ ] API 엔드포인트 업데이트
- [ ] 자동 배포 설정 (선택사항)

## 🎯 다음 단계

1. **데이터베이스 설정**: Supabase 또는 PlanetScale 연결
2. **프론트엔드 배포**: Vercel에 Next.js 배포
3. **도메인 설정**: 커스텀 도메인 연결
4. **모니터링**: 성능 및 오류 모니터링 설정
5. **백업 설정**: 데이터베이스 백업 구성
