#!/bin/bash

echo "🛑 수원 힐링 상담센터 개발 서버 종료"
echo ""

echo "📦 Node.js 프로세스 종료 중..."
pkill -f "node" 2>/dev/null || echo "No Node processes found"

echo "🔧 Wrangler 프로세스 종료 중..."
pkill -f "wrangler" 2>/dev/null || echo "No Wrangler processes found"

echo ""
echo "✅ 모든 개발 서버가 종료되었습니다."
echo ""
