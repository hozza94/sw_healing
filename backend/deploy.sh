#!/bin/bash

# Cloudflare Workers 배포 스크립트

echo "🚀 수원 힐링 상담센터 API 배포 시작..."

# 1. Wrangler CLI 설치 확인
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI가 설치되지 않았습니다."
    echo "다음 명령어로 설치하세요: npm install -g wrangler"
    exit 1
fi

# 2. 로그인 확인
echo "🔐 Cloudflare 로그인 확인..."
wrangler whoami

# 3. 환경 변수 설정 확인
echo "⚙️ 환경 변수 설정 확인..."
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL 환경 변수가 설정되지 않았습니다."
    exit 1
fi

if [ -z "$DATABASE_AUTH_TOKEN" ]; then
    echo "❌ DATABASE_AUTH_TOKEN 환경 변수가 설정되지 않았습니다."
    exit 1
fi

# 4. 의존성 설치
echo "📦 Python 의존성 설치..."
pip install -r requirements.txt

# 5. Workers 배포
echo "🚀 Cloudflare Workers에 배포..."
wrangler deploy

echo "✅ 배포 완료!"
echo "🌐 API URL: https://sw-healing-api.workers.dev"
echo "📚 API 문서: https://sw-healing-api.workers.dev/docs"
