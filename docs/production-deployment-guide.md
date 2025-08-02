# 🚀 프로덕션 배포 완전 가이드

## 📋 배포 전 체크리스트

### 1. 도메인 및 호스팅 준비
- [ ] 도메인 구매 (예: suwonhealing.com)
- [ ] DNS 설정 준비
- [ ] SSL 인증서 준비
- [ ] 호스팅 서비스 선택

### 2. 보안 준비
- [ ] 환경 변수 설정
- [ ] 데이터베이스 보안 설정
- [ ] 방화벽 설정
- [ ] 백업 전략 수립

### 3. 모니터링 준비
- [ ] 로그 수집 시스템
- [ ] 성능 모니터링
- [ ] 에러 추적 시스템
- [ ] 알림 시스템

## 🌐 도메인 구매 및 설정

### 1. 도메인 구매 추천 사이트
- **가비아 (Gabia)**: 한국에서 가장 인기
- **후이즈 (HuiZ)**: 가격이 저렴
- **고대디 (GoDaddy)**: 글로벌 서비스
- **네임체어 (Namecheap)**: 보안에 강점

### 2. 도메인 선택 팁
```
추천 도메인 예시:
- suwonhealing.com
- suwon-healing.com
- suwonhealing.co.kr
- healing-suwon.com
```

### 3. DNS 설정
```bash
# A 레코드 설정
Type: A
Name: @
Value: [서버 IP 주소]

# CNAME 레코드 설정 (서브도메인)
Type: CNAME
Name: www
Value: suwonhealing.com

# API 서브도메인
Type: A
Name: api
Value: [서버 IP 주소]
```

## ☁️ 클라우드 호스팅 옵션

### 1. **AWS (Amazon Web Services)** - 추천
**장점**: 안정성, 확장성, 다양한 서비스
**단점**: 복잡성, 비용

#### AWS 배포 아키텍처
```
Internet Gateway
    ↓
Route 53 (DNS)
    ↓
CloudFront (CDN)
    ↓
ALB (Application Load Balancer)
    ↓
ECS/Fargate (컨테이너)
    ↓
RDS (PostgreSQL)
```

#### AWS 비용 예상 (월)
- EC2 (t3.small): $15-20
- RDS (db.t3.micro): $15-20
- CloudFront: $5-10
- Route 53: $1-2
- **총 예상 비용: $40-60/월**

### 2. **Google Cloud Platform (GCP)**
**장점**: 성능, AI/ML 서비스
**단점**: AWS보다 복잡

### 3. **Microsoft Azure**
**장점**: Windows 서버 친화적
**단점**: 비용이 높을 수 있음

### 4. **Vercel + Railway** - 간단한 배포
**장점**: 설정이 매우 간단
**단점**: 확장성 제한

#### Vercel + Railway 비용
- Vercel (프론트엔드): $20/월
- Railway (백엔드): $5-20/월
- **총 예상 비용: $25-40/월**

### 5. **국내 호스팅** - 초기 단계 추천
- **가비아 클라우드**: 한국 서버, 빠른 속도
- **네이버 클라우드**: 안정성, 한국어 지원
- **KT 클라우드**: 기업용 서비스

## 🐳 Docker 프로덕션 배포

### 1. 프로덕션용 Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: suwon_healing
      POSTGRES_USER: healing_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U healing_user"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      DATABASE_URL: postgresql://healing_user:${DB_PASSWORD}@postgres:5432/suwon_healing
      REDIS_URL: redis://redis:6379
      SECRET_KEY: ${SECRET_KEY}
      DEBUG: "False"
      ALLOWED_ORIGINS: https://suwonhealing.com,https://www.suwonhealing.com
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    environment:
      VITE_API_BASE_URL: https://api.suwonhealing.com
      VITE_APP_NAME: 수원 힐링 상담센터
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 2. 프로덕션용 Dockerfile

#### 백엔드 Dockerfile.prod
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# 비root 사용자 생성
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Gunicorn으로 실행
CMD ["gunicorn", "app.main:app", "--bind", "0.0.0.0:8000", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker"]
```

#### 프론트엔드 Dockerfile.prod
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Nginx 설정

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    upstream frontend {
        server frontend:80;
    }

    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 보안 헤더
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    server {
        listen 80;
        server_name suwonhealing.com www.suwonhealing.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name suwonhealing.com www.suwonhealing.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # 프론트엔드
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 백엔드 API
        location /api {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 정적 파일 캐싱
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    server {
        listen 443 ssl http2;
        server_name api.suwonhealing.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## 🔐 SSL 인증서 설정

### 1. Let's Encrypt 무료 SSL

```bash
# Certbot 설치
sudo apt update
sudo apt install certbot

# 도메인 인증서 발급
sudo certbot certonly --standalone -d suwonhealing.com -d www.suwonhealing.com -d api.suwonhealing.com

# 자동 갱신 설정
sudo crontab -e
# 다음 줄 추가:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. 유료 SSL 인증서 (추천)
- **Comodo SSL**: $10-50/년
- **DigiCert**: $100-500/년
- **GlobalSign**: $200-1000/년

## 📊 모니터링 및 로깅

### 1. Prometheus + Grafana 설정

```yaml
# monitoring/docker-compose.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  grafana_data:
```

### 2. 로그 수집 (ELK Stack)

```yaml
# logging/docker-compose.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

  kibana:
    image: docker.elastic.co/kibana/kibana:7.17.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

  logstash:
    image: docker.elastic.co/logstash/logstash:7.17.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch
```

## 🔄 CI/CD 파이프라인

### 1. GitHub Actions 설정

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test Backend
        run: |
          cd backend
          pip install -r requirements.txt
          pytest
      - name: Test Frontend
        run: |
          cd frontend
          npm install
          npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Server
        run: |
          # 서버에 SSH 접속하여 배포
          ssh user@your-server.com << 'EOF'
            cd /opt/suwon_healing
            git pull origin main
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml up -d --build
          EOF
```

## 💰 비용 최적화

### 1. 클라우드 비용 절약 팁

#### AWS 비용 절약
```bash
# 예약 인스턴스 사용 (1년 약정 시 40% 할인)
# Spot Instance 사용 (70% 할인, 단 불안정)
# S3 Intelligent Tiering 사용
# CloudFront 캐싱 최적화
```

#### 일반적인 비용 절약
- **CDN 사용**: 정적 파일 전송 비용 절약
- **이미지 최적화**: 용량 절약
- **데이터베이스 최적화**: 쿼리 성능 향상
- **캐싱 전략**: 서버 부하 감소

### 2. 월 예상 비용 (소규모)

| 서비스 | 비용 (월) | 설명 |
|--------|-----------|------|
| 도메인 | $1-2 | 연간 $10-20 |
| 호스팅 | $20-50 | VPS 또는 클라우드 |
| SSL | $0 | Let's Encrypt 무료 |
| 백업 | $5-10 | 클라우드 스토리지 |
| 모니터링 | $5-10 | 기본 모니터링 |
| **총계** | **$30-70** | 월 예상 비용 |

## 🚨 보안 체크리스트

### 1. 필수 보안 설정
- [ ] 방화벽 설정 (UFW)
- [ ] SSH 키 인증만 허용
- [ ] 비밀번호 인증 비활성화
- [ ] 포트 스캔 방지
- [ ] DDoS 방어 설정

### 2. 애플리케이션 보안
- [ ] HTTPS 강제 리다이렉트
- [ ] 보안 헤더 설정
- [ ] SQL Injection 방지
- [ ] XSS 방지
- [ ] CSRF 토큰 설정

### 3. 데이터 보안
- [ ] 데이터베이스 암호화
- [ ] 백업 암호화
- [ ] 개인정보 암호화
- [ ] 로그 파일 보안

## 📞 지원 및 유지보수

### 1. 모니터링 도구
- **Uptime Robot**: 무료 웹사이트 모니터링
- **Google Analytics**: 트래픽 분석
- **Sentry**: 에러 추적
- **LogRocket**: 사용자 세션 재생

### 2. 백업 전략
```bash
# 자동 백업 스크립트
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# 데이터베이스 백업
docker exec postgres pg_dump -U healing_user suwon_healing > $BACKUP_DIR/db_$DATE.sql

# 파일 백업
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /app/uploads/

# 30일 이상 된 백업 삭제
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### 3. 장애 대응
- **자동 재시작**: Docker restart policy
- **헬스 체크**: 서비스 상태 모니터링
- **알림 시스템**: Slack/Email 알림
- **롤백 전략**: 이전 버전으로 복구

## 🎯 배포 단계별 가이드

### 1단계: 개발 환경 테스트 (1-2일)
```bash
# 로컬에서 모든 기능 테스트
docker-compose up -d
# 모든 API 엔드포인트 테스트
# 프론트엔드 기능 테스트
```

### 2단계: 스테이징 환경 구축 (2-3일)
```bash
# 테스트 서버에 배포
# 실제 데이터베이스 연결 테스트
# 성능 테스트
# 보안 테스트
```

### 3단계: 프로덕션 배포 (1일)
```bash
# 도메인 설정
# SSL 인증서 발급
# 프로덕션 서버 배포
# 모니터링 설정
```

### 4단계: 최적화 및 모니터링 (지속적)
```bash
# 성능 최적화
# 사용자 피드백 수집
# 지속적인 보안 업데이트
```

이 가이드를 따라하면 안전하고 확장 가능한 프로덕션 환경을 구축할 수 있습니다! 🚀 