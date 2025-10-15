#!/bin/bash

echo "📋 수원 힐링 상담센터 로그 뷰어"
echo ""

if [ ! -d "logs" ]; then
    echo "❌ logs 디렉토리가 없습니다. 먼저 서버를 시작해주세요."
    exit 1
fi

echo "사용 가능한 로그 파일:"
echo "1. 백엔드 로그 (backend.log)"
echo "2. 프론트엔드 로그 (frontend.log)"
echo "3. 모든 로그 (실시간)"
echo "4. 종료"
echo ""

read -p "선택하세요 (1-4): " choice

case $choice in
    1)
        echo "📦 백엔드 로그를 실시간으로 표시합니다..."
        echo "종료하려면 Ctrl+C를 누르세요"
        echo ""
        tail -f logs/backend.log
        ;;
    2)
        echo "🌐 프론트엔드 로그를 실시간으로 표시합니다..."
        echo "종료하려면 Ctrl+C를 누르세요"
        echo ""
        tail -f logs/frontend.log
        ;;
    3)
        echo "📋 모든 로그를 실시간으로 표시합니다..."
        echo "종료하려면 Ctrl+C를 누르세요"
        echo ""
        tail -f logs/*.log
        ;;
    4)
        echo "👋 로그 뷰어를 종료합니다."
        exit 0
        ;;
    *)
        echo "❌ 잘못된 선택입니다."
        exit 1
        ;;
esac
