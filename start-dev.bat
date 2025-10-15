@echo off
echo 🚀 수원 힐링 상담센터 개발 서버 시작
echo.

REM 로그 디렉토리 생성
if not exist logs mkdir logs

echo 📦 백엔드 서버 시작 중...
echo    - 로그: logs\backend.log
echo    - API: http://localhost:8787
echo    - API 문서: http://localhost:8787/docs
echo.

REM 백엔드 서버를 새 창에서 실행
start "Backend Server" cmd /k "cd backend && wrangler dev --env development"

timeout /t 5 /nobreak > nul

echo 🌐 프론트엔드 서버 시작 중...
echo    - 로그: logs\frontend.log
echo    - 웹사이트: http://localhost:3000
echo.

REM 프론트엔드 서버를 새 창에서 실행
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ 서버가 시작되었습니다!
echo.
echo 📱 프론트엔드: http://localhost:3000
echo 🔧 백엔드: http://localhost:8787
echo 📚 API 문서: http://localhost:8787/docs
echo.
echo 📋 로그 확인 방법:
echo    - 백엔드 로그: 새로 열린 "Backend Server" 창에서 확인
echo    - 프론트엔드 로그: 새로 열린 "Frontend Server" 창에서 확인
echo    - 또는 각 서버 창에서 직접 로그를 확인하세요
echo.
echo 🛑 종료하려면 각 서버 창을 닫거나 아무 키나 누르세요
pause

