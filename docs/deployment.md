# 배포 가이드

## 1. 개발 환경 설정

### 1.1 필수 소프트웨어

- **Python 3.8+**
- **Node.js 18+**
- **PostgreSQL 13+**
- **Git**

### 1.2 로컬 개발 환경 설정

```bash
# 프로젝트 클론
git clone <repository-url>
cd suwon_healing

# 백엔드 설정
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 프론트엔드 설정
cd ../frontend
npm install
```

## 2. 환경 변수 설정

### 2.1 백엔드 환경 변수

`backend/.env` 파일을 생성하고 다음 내용을 추가:

```bash
# 데이터베이스 설정
DATABASE_URL=postgresql://username:password@localhost:5432/suwon_healing

# JWT 설정
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# 서버 설정
DEBUG=True
HOST=0.0.0.0
PORT=8000

# CORS 설정
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 2.2 프론트엔드 환경 변수

`frontend/.env` 파일을 생성하고 다음 내용을 추가:

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=수원 힐링 상담센터
```

## 3. 데이터베이스 설정

### 3.1 PostgreSQL 설치

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
PostgreSQL 공식 웹사이트에서 설치 프로그램 다운로드

### 3.2 데이터베이스 생성

```bash
# PostgreSQL 접속
sudo -u postgres psql

# 데이터베이스 및 사용자 생성
CREATE DATABASE suwon_healing;
CREATE USER healing_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE suwon_healing TO healing_user;
\q
```

### 3.3 마이그레이션 실행

```bash
cd backend
alembic upgrade head
```

## 4. 개발 서버 실행

### 4.1 백엔드 서버

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4.2 프론트엔드 서버

```bash
cd frontend
npm run dev
```

## 5. Docker를 사용한 배포

### 5.1 Docker Compose 설정

`docker-compose.yml` 파일 생성:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: suwon_healing
      POSTGRES_USER: healing_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://healing_user:your_password@postgres:5432/suwon_healing
      SECRET_KEY: your-secret-key-here
      ALGORITHM: HS256
      ACCESS_TOKEN_EXPIRE_MINUTES: 30
    ports:
      - "8000:8000"
    depends_on:
      - postgres
    volumes:
      - ./backend:/app

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      VITE_API_BASE_URL: http://localhost:8000

volumes:
  postgres_data:
```

### 5.2 백엔드 Dockerfile

`backend/Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 5.3 프론트엔드 Dockerfile

`frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### 5.4 Docker 실행

```bash
# Docker Compose로 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 서비스 중지
docker-compose down
```

## 6. 프로덕션 배포

### 6.1 클라우드 배포 옵션

#### 6.1.1 Vercel (프론트엔드)

1. **Vercel CLI 설치:**
```bash
npm install -g vercel
```

2. **프로젝트 배포:**
```bash
cd frontend
vercel --prod
```

#### 6.1.2 Railway (백엔드)

1. **Railway CLI 설치:**
```bash
npm install -g @railway/cli
```

2. **프로젝트 배포:**
```bash
cd backend
railway login
railway init
railway up
```

#### 6.1.3 AWS EC2

1. **EC2 인스턴스 생성**
2. **Docker 설치**
3. **프로젝트 클론 및 실행**

```bash
# EC2 인스턴스에서 실행
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# 프로젝트 클론
git clone <repository-url>
cd suwon_healing

# Docker Compose 실행
docker-compose -f docker-compose.prod.yml up -d
```

### 6.2 프로덕션 환경 변수

#### 6.2.1 백엔드 프로덕션 설정

```bash
# 프로덕션 환경 변수
DATABASE_URL=postgresql://username:password@host:5432/suwon_healing
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_ORIGINS=https://your-domain.com
```

#### 6.2.2 프론트엔드 프로덕션 설정

```bash
# 프로덕션 환경 변수
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_NAME=수원 힐링 상담센터
```

## 7. SSL/HTTPS 설정

### 7.1 Let's Encrypt 사용

```bash
# Certbot 설치
sudo apt install certbot

# SSL 인증서 발급
sudo certbot certonly --standalone -d your-domain.com

# Nginx 설정
sudo nano /etc/nginx/sites-available/suwon_healing

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 8. 모니터링 및 로깅

### 8.1 로그 설정

#### 8.1.1 백엔드 로깅

```python
# backend/app/core/logging.py
import logging
from logging.handlers import RotatingFileHandler

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            RotatingFileHandler('app.log', maxBytes=10000000, backupCount=5),
            logging.StreamHandler()
        ]
    )
```

#### 8.1.2 프론트엔드 에러 추적

```typescript
// frontend/src/utils/errorTracking.ts
export const trackError = (error: Error, context?: any) => {
  console.error('Error:', error, context);
  // 에러 추적 서비스 연동 (Sentry 등)
};
```

### 8.2 헬스 체크

```python
# backend/app/api/v1/health.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}
```

## 9. 백업 및 복구

### 9.1 데이터베이스 백업

```bash
# 자동 백업 스크립트
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="suwon_healing"

pg_dump $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# 30일 이상 된 백업 삭제
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete
```

### 9.2 파일 백업

```bash
# 업로드된 파일 백업
rsync -av /app/uploads/ /backups/uploads/
```

## 10. 성능 최적화

### 10.1 백엔드 최적화

- **데이터베이스 인덱싱**
- **캐싱 (Redis)**
- **비동기 처리**
- **API 응답 압축**

### 10.2 프론트엔드 최적화

- **코드 스플리팅**
- **이미지 최적화**
- **CDN 사용**
- **Service Worker 캐싱**

## 11. 보안 설정

### 11.1 방화벽 설정

```bash
# UFW 방화벽 설정
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 11.2 보안 헤더 설정

```nginx
# Nginx 보안 헤더
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

## 12. 트러블슈팅

### 12.1 일반적인 문제들

1. **데이터베이스 연결 실패**
   - 연결 문자열 확인
   - 방화벽 설정 확인
   - 데이터베이스 서비스 상태 확인

2. **CORS 오류**
   - ALLOWED_ORIGINS 설정 확인
   - 프론트엔드 도메인 추가

3. **메모리 부족**
   - Docker 메모리 제한 설정
   - 로그 파일 정리

### 12.2 로그 확인

```bash
# Docker 로그 확인
docker-compose logs backend
docker-compose logs frontend

# 시스템 로그 확인
sudo journalctl -u docker
``` 