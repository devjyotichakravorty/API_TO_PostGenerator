# Stop the API to Postman Test Generator application (PowerShell)
# Uses npm stop-app command for consistent behavior across platforms

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "API to Postman Test Generator" -ForegroundColor Cyan
Write-Host "Stopping Application..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to root directory
$rootDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $rootDir

# Call the npm stop-app command
npm run stop-app

Write-Host ""
Write-Host "[*] Verifying ports are free..." -ForegroundColor Yellow

# Verify port 3000 is free
try {
    $port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($port3000) {
        Write-Host "[!] Warning: Port 3000 may still be in use" -ForegroundColor Yellow
    }
    else {
        Write-Host "[OK] Port 3000 is free" -ForegroundColor Green
    }
}
catch {
    Write-Host "[OK] Port 3000 is free" -ForegroundColor Green
}

# Verify port 5173 is free
try {
    $port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
    if ($port5173) {
        Write-Host "[!] Warning: Port 5173 may still be in use" -ForegroundColor Yellow
    }
    else {
        Write-Host "[OK] Port 5173 is free" -ForegroundColor Green
    }
}
catch {
    Write-Host "[OK] Port 5173 is free" -ForegroundColor Green
}

Write-Host ""
Write-Host "[OK] You can now start the application again with: npm run dev" -ForegroundColor Green
Write-Host ""

