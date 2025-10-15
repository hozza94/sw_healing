#!/bin/bash

echo "🚀 수원 힐링 상담센터 개발 서버 시작"
echo ""

# 로그 디렉토리 생성
mkdir -p logs

echo "📦 백엔드 서버 시작 중..."
echo "   - 로그: logs/backend.log"
echo "   - API: http://localhost:8787"
echo "   - API 문서: http://localhost:8787/docs"
echo ""

# 백엔드 서버를 백그라운드에서 실행하고 로그 파일에 저장
cd backend
nohup wrangler dev --env development > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

sleep 5

echo "🌐 프론트엔드 서버 시작 중..."
echo "   - 로그: logs/frontend.log"
echo "   - 웹사이트: http://localhost:3000"
echo ""

# 프론트엔드 서버를 백그라운드에서 실행하고 로그 파일에 저장
cd frontend
nohup npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ 서버가 시작되었습니다!"
echo ""
echo "📱 프론트엔드: http://localhost:3000"
echo "🔧 백엔드: http://localhost:8787"
echo "📚 API 문서: http://localhost:8787/docs"
echo ""
echo "📋 로그 확인 명령어:"
echo "   - 백엔드 로그: tail -f logs/backend.log"
echo "   - 프론트엔드 로그: tail -f logs/frontend.log"
echo "   - 모든 로그: tail -f logs/*.log"
echo ""
echo "🛑 종료하려면 Ctrl+C를 누르세요"

# 종료 시 백그라운드 프로세스들도 함께 종료
cleanup() {
    echo ""
    echo "🛑 서버를 종료합니다..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ 모든 서버가 종료되었습니다."
    exit 0
}

trap cleanup SIGINT SIGTERM

# 대기
wait

