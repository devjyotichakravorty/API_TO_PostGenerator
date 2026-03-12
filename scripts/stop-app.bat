@echo off
REM Stop the API to Postman Test Generator application
REM Directly kills processes on ports 3000 and 5173

setlocal enabledelayedexpansion

echo.
echo ====================================
echo API to Postman Test Generator
echo Stopping Application...
echo ====================================
echo.

REM Kill processes on port 3000
echo [*] Checking port 3000...
netstat -ano | findstr :3000 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [*] Stopping backend server...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    echo [OK] Backend stopped
) else (
    echo [OK] Port 3000 already free
)

timeout /t 1 /nobreak >nul

REM Kill processes on port 5173
echo [*] Checking port 5173...
netstat -ano | findstr :5173 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [*] Stopping frontend server...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    echo [OK] Frontend stopped
) else (
    echo [OK] Port 5173 already free
)

echo.
echo [✓] Application stopped successfully!
echo [✓] You can now start the application again with: npm run dev
echo.

