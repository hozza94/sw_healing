#!/bin/bash

echo "🚀 수원 힐링 상담센터 빠른 시작 스크립트"
echo "=========================================="

# Docker 리소스 정리
echo "🧹 Docker 리소스 정리 중..."
docker system prune -f

# 컨테이너 중지
echo "🛑 기존 컨테이너 중지 중..."
docker compose -f docker-compose.dev.yml down

# 이미지 재빌드 (캐시 사용)
echo "🔨 이미지 재빌드 중..."
docker compose -f docker-compose.dev.yml build --parallel

# 컨테이너 시작
echo "▶️ 컨테이너 시작 중..."
docker compose -f docker-compose.dev.yml up -d

# 상태 확인
echo "📊 컨테이너 상태 확인 중..."
sleep 10
docker compose -f docker-compose.dev.yml ps

echo ""
echo "✅ 시작 완료!"
echo "🌐 프론트엔드: http://localhost:3000"
echo "🔧 백엔드 API: http://localhost:8000"
echo "📊 상태 확인: docker compose -f docker-compose.dev.yml logs -f"
echo "" 