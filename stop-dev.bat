@echo off
echo 🛑 수원 힐링 상담센터 개발 서버 종료
echo.

echo 📦 Node.js 프로세스 종료 중...
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

echo 🔧 Wrangler 프로세스 종료 중...
Get-Process -Name "wrangler" -ErrorAction SilentlyContinue | Stop-Process -Force

echo.
echo ✅ 모든 개발 서버가 종료되었습니다.
echo.
pause
