#!/bin/bash

# Start the API to Postman Test Generator application
# This script starts both backend and frontend servers in development mode

echo ""
echo "===================================="
echo "API to Postman Test Generator"
echo "Starting Application..."
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if port 3000 is already in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "[WARNING] Port 3000 is already in use."
    echo "Killing existing process on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    echo "[OK] Port 3000 freed."
    sleep 2
fi

# Navigate to script directory
cd "$(dirname "$0")/.."

echo "[*] Backend: http://localhost:3000"
echo "[*] Frontend: http://localhost:5173"
echo "[*] API Endpoint: http://localhost:3000/api/postman"
echo ""
echo "[INFO] Starting servers..."
echo "[INFO] Press Ctrl+C to stop the application"
echo ""

# Start the dev servers
npm run dev
