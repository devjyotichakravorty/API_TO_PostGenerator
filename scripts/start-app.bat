@echo off
REM Start the API to Postman Test Generator application
REM This script starts both backend and frontend servers in development mode

echo.
echo ====================================
echo API to Postman Test Generator
echo Starting Application...
echo ====================================
echo.

REM Check if already running
netstat -ano | findstr :3000 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Port 3000 is already in use. 
    echo Killing existing process on port 3000...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    echo [OK] Port 3000 freed.
    timeout /t 2 /nobreak
)

REM Check Node.js installation
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Navigate to project root
cd /d "%~dp0.."

echo [*] Backend: http://localhost:3000
echo [*] Frontend: http://localhost:5173
echo [*] API Endpoint: http://localhost:3000/api/postman
echo.
echo [INFO] Starting servers...
echo [INFO] Press Ctrl+C to stop the application
echo.

REM Start the dev servers
npm run dev

pause
