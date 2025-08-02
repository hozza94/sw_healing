#!/bin/bash

# 수원 힐링 상담센터 배포 스크립트
# 사용법: ./scripts/deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-staging}
DOMAIN="suwonhealing.com"

echo "🚀 수원 힐링 상담센터 배포 시작..."
echo "환경: $ENVIRONMENT"

# 환경 변수 파일 확인
if [ ! -f ".env.$ENVIRONMENT" ]; then
    echo "❌ .env.$ENVIRONMENT 파일이 없습니다."
    echo "env.production.example 파일을 .env.$ENVIRONMENT로 복사하고 설정하세요."
    exit 1
fi

# Docker 설치 확인
if ! command -v docker &> /dev/null; then
    echo "❌ Docker가 설치되어 있지 않습니다."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose가 설치되어 있지 않습니다."
    exit 1
fi

# 환경 변수 로드
source .env.$ENVIRONMENT

echo "📋 배포 전 체크리스트:"

# 1. Git 상태 확인
echo "1. Git 상태 확인..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  커밋되지 않은 변경사항이 있습니다."
    read -p "계속하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 2. 최신 코드 가져오기
echo "2. 최신 코드 가져오기..."
git pull origin main

# 3. 백업 생성
echo "3. 데이터베이스 백업 생성..."
if [ "$ENVIRONMENT" = "production" ]; then
    BACKUP_DIR="./backups"
    mkdir -p $BACKUP_DIR
    DATE=$(date +%Y%m%d_%H%M%S)
    
    if docker-compose -f docker-compose.prod.yml ps | grep -q postgres; then
        docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U healing_user suwon_healing > "$BACKUP_DIR/backup_$DATE.sql"
        echo "✅ 백업 생성 완료: backup_$DATE.sql"
    fi
fi

# 4. 기존 컨테이너 중지
echo "4. 기존 컨테이너 중지..."
docker-compose -f docker-compose.prod.yml down

# 5. 새 이미지 빌드
echo "5. 새 이미지 빌드..."
docker-compose -f docker-compose.prod.yml build --no-cache

# 6. 컨테이너 시작
echo "6. 컨테이너 시작..."
docker-compose -f docker-compose.prod.yml up -d

# 7. 헬스 체크
echo "7. 서비스 헬스 체크..."
sleep 30

# 백엔드 헬스 체크
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ 백엔드 서비스 정상"
else
    echo "❌ 백엔드 서비스 오류"
    docker-compose -f docker-compose.prod.yml logs backend
    exit 1
fi

# 프론트엔드 헬스 체크
if curl -f http://localhost:80 > /dev/null 2>&1; then
    echo "✅ 프론트엔드 서비스 정상"
else
    echo "❌ 프론트엔드 서비스 오류"
    docker-compose -f docker-compose.prod.yml logs frontend
    exit 1
fi

# 8. SSL 인증서 확인 (프로덕션)
if [ "$ENVIRONMENT" = "production" ]; then
    echo "8. SSL 인증서 확인..."
    if [ ! -f "./ssl/fullchain.pem" ] || [ ! -f "./ssl/privkey.pem" ]; then
        echo "⚠️  SSL 인증서가 없습니다."
        echo "다음 명령어로 SSL 인증서를 발급하세요:"
        echo "sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN -d api.$DOMAIN"
    else
        echo "✅ SSL 인증서 확인 완료"
    fi
fi

# 9. 로그 확인
echo "9. 서비스 로그 확인..."
docker-compose -f docker-compose.prod.yml logs --tail=20

echo ""
echo "🎉 배포 완료!"
echo ""
echo "📊 서비스 상태:"
echo "- 프론트엔드: http://localhost:80"
echo "- 백엔드 API: http://localhost:8000"
echo "- API 문서: http://localhost:8000/docs"
echo ""
echo "🔧 유용한 명령어:"
echo "- 로그 확인: docker-compose -f docker-compose.prod.yml logs -f"
echo "- 서비스 중지: docker-compose -f docker-compose.prod.yml down"
echo "- 서비스 재시작: docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "📞 문제가 발생하면 로그를 확인하세요:"
echo "docker-compose -f docker-compose.prod.yml logs [service_name]" 