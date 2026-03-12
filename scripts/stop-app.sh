#!/bin/bash

# Stop the API to Postman Test Generator application
# Uses npm stop-app command for consistent behavior across platforms

echo ""
echo "===================================="
echo "API to Postman Test Generator"
echo "Stopping Application..."
echo "===================================="
echo ""

# Navigate to root directory
cd "$(dirname "$0")/.."

# Call the npm stop-app command
npm run stop-app

echo ""
echo "[*] Verifying ports are free..."

# Check if port 3000 is free
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "[!] Warning: Port 3000 may still be in use"
else
    echo "[OK] Port 3000 is free"
fi

# Check if port 5173 is free
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "[!] Warning: Port 5173 may still be in use"
else
    echo "[OK] Port 5173 is free"
fi

echo ""
echo "[OK] You can now start the application again with: npm run dev"
echo ""

