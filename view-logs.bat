@echo off
echo 📋 수원 힐링 상담센터 로그 뷰어
echo.

if not exist logs (
    echo ❌ logs 디렉토리가 없습니다. 먼저 서버를 시작해주세요.
    pause
    exit /b 1
)

echo 사용 가능한 로그 파일:
echo 1. 백엔드 로그 (backend.log)
echo 2. 프론트엔드 로그 (frontend.log)
echo 3. 모든 로그 (실시간)
echo 4. 종료
echo.

set /p choice="선택하세요 (1-4): "

if "%choice%"=="1" (
    echo 📦 백엔드 로그를 실시간으로 표시합니다...
    echo 종료하려면 Ctrl+C를 누르세요
    echo.
    powershell -Command "Get-Content logs\backend.log -Wait -Tail 50"
) else if "%choice%"=="2" (
    echo 🌐 프론트엔드 로그를 실시간으로 표시합니다...
    echo 종료하려면 Ctrl+C를 누르세요
    echo.
    powershell -Command "Get-Content logs\frontend.log -Wait -Tail 50"
) else if "%choice%"=="3" (
    echo 📋 모든 로그를 실시간으로 표시합니다...
    echo 종료하려면 Ctrl+C를 누르세요
    echo.
    powershell -Command "Get-Content logs\*.log -Wait -Tail 50"
) else if "%choice%"=="4" (
    echo 👋 로그 뷰어를 종료합니다.
    exit /b 0
) else (
    echo ❌ 잘못된 선택입니다.
    pause
    exit /b 1
)

pause
