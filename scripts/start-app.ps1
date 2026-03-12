# Start the API to Postman Test Generator application (PowerShell)
# This script starts both backend and frontend servers in development mode

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "API to Postman Test Generator" -ForegroundColor Cyan
Write-Host "Starting Application..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if port 3000 is already in use
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "[WARNING] Port 3000 is already in use." -ForegroundColor Yellow
    Write-Host "Killing existing process on port 3000..." -ForegroundColor Yellow
    $processId = $port3000.OwningProcess
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Write-Host "[OK] Port 3000 freed." -ForegroundColor Green
    Start-Sleep -Seconds 2
}

# Navigate to project root
Push-Location (Split-Path -Parent $PSScriptRoot)

# Display connection info
Write-Host "[*] Backend: http://localhost:3000" -ForegroundColor White
Write-Host "[*] Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "[*] API Endpoint: http://localhost:3000/api/postman" -ForegroundColor White
Write-Host ""
Write-Host "[INFO] Starting servers..." -ForegroundColor Cyan
Write-Host "[INFO] Press Ctrl+C to stop the application" -ForegroundColor Yellow
Write-Host ""

# Start the dev servers
npm run dev

Pop-Location
