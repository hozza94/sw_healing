#!/bin/bash

# GitHub Pages 배포 스크립트
# 사용법: ./scripts/deploy-github-pages.sh

set -e

echo "🚀 GitHub Pages 배포 시작..."

# 현재 브랜치 확인
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  현재 브랜치가 main이 아닙니다: $CURRENT_BRANCH"
    read -p "계속하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 환경 변수 확인
if [ -z "$VITE_API_BASE_URL" ]; then
    echo "⚠️  VITE_API_BASE_URL 환경 변수가 설정되지 않았습니다."
    echo "기본값 http://localhost:8000을 사용합니다."
    export VITE_API_BASE_URL="http://localhost:8000"
fi

# 프론트엔드 의존성 설치
echo "📦 프론트엔드 의존성 설치 중..."
cd frontend
npm install

# 프론트엔드 빌드
echo "🔨 프론트엔드 빌드 중..."
npm run build

# GitHub Pages 배포
echo "🚀 GitHub Pages 배포 중..."
npm run deploy

echo ""
echo "✅ GitHub Pages 배포 완료!"
echo ""
echo "📊 배포 정보:"
echo "- 프론트엔드: https://[username].github.io/suwon_healing"
echo "- API URL: $VITE_API_BASE_URL"
echo ""
echo "🔧 유용한 명령어:"
echo "- 로컬 개발 서버: cd frontend && npm run dev"
echo "- 빌드 테스트: cd frontend && npm run build"
echo "- 배포 확인: npm run deploy"
echo ""
echo "📞 문제가 발생하면 다음을 확인하세요:"
echo "1. GitHub 저장소 설정 → Pages 활성화"
echo "2. gh-pages 패키지 설치: npm install --save-dev gh-pages"
echo "3. package.json의 homepage 설정 확인" 