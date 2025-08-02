#!/bin/bash

# 개발 환경 시작 스크립트
echo "🚀 수원 힐링 상담센터 개발 환경을 시작합니다..."

# 기존 컨테이너 중지 및 제거
echo "📦 기존 컨테이너를 정리합니다..."
docker compose down

# 개발용 Docker Compose로 시작
echo "🔧 개발 모드로 컨테이너를 시작합니다..."
docker compose -f docker-compose.dev.yml up --build -d

# 로그 확인
echo "📋 컨테이너 상태를 확인합니다..."
docker compose -f docker-compose.dev.yml ps

echo "✅ 개발 환경이 시작되었습니다!"
echo ""
echo "🌐 접속 주소:"
echo "   - 프론트엔드: http://localhost:3000"
echo "   - 백엔드 API: http://localhost:8000"
echo "   - API 문서: http://localhost:8000/docs"
echo ""
echo "📝 유용한 명령어:"
echo "   - 로그 확인: docker compose -f docker-compose.dev.yml logs -f"
echo "   - 프론트엔드 로그: docker compose -f docker-compose.dev.yml logs -f frontend"
echo "   - 백엔드 로그: docker compose -f docker-compose.dev.yml logs -f backend"
echo "   - 중지: docker compose -f docker-compose.dev.yml down"
echo ""
echo "💡 코드 변경사항이 자동으로 반영됩니다!" 