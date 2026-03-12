# Application Start & Stop Guide

Complete guide to starting and stopping the **API to Postman Test Generator** application.

---

## Quick Start

### **Windows**

#### Option 1: Double-click the batch script (Easiest)

1. Navigate to the project root: `d:\AI_Training\API_to_Post_generator`
2. **Double-click** `start-app.bat` to start the application
3. Both servers will start automatically

**To stop:** Double-click `stop-app.bat`

#### Option 2: Command Prompt
```bash
cd d:\AI_Training\API_to_Post_generator
start-app.bat
```

---

### **macOS / Linux**

#### Option 1: Terminal
```bash
cd /path/to/API_to_Post_generator
bash start-app.sh
```

#### Option 2: Make it executable and run directly
```bash
chmod +x start-app.sh stop-app.sh
./start-app.sh
```

**To stop:** Press `Ctrl+C` or run `./stop-app.sh` in another terminal

---

## npm Commands

### Using npm scripts (Works on all platforms)

**Start the application:**
```bash
npm run dev
```

**Start only backend:**
```bash
npm run backend
```

**Start only frontend:**
```bash
npm run frontend
```

**Stop all Node processes:**
```bash
npm run stop-app
```

---

## Manual Methods

### Method 1: Windows Command Prompt

**Start:**
```bash
cd d:\AI_Training\API_to_Post_generator
npm run dev
```

**Stop in same terminal:** Press `Ctrl+C`

**Stop in different terminal:**
```bash
taskkill /F /IM node.exe
```

---

### Method 2: Windows PowerShell

**Start:**
```powershell
cd d:\AI_Training\API_to_Post_generator
npm run dev
```

**Stop in same terminal:** Press `Ctrl+C`

**Stop in different terminal:**
```powershell
Stop-Process -Name node -Force
```

---

### Method 3: Linux/macOS Terminal

**Start:**
```bash
cd /path/to/API_to_Post_generator
npm run dev
```

**Stop in same terminal:** Press `Ctrl+C`

**Stop in different terminal:**
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9   # Kill backend
lsof -ti:5173 | xargs kill -9   # Kill frontend

# Or kill all Node.js processes
killall node
```

---

## Server Details

### Default Access URLs

| Service | Port | URL |
|---------|------|-----|
| **Backend API** | 3000 | http://localhost:3000 |
| **Frontend UI** | 5173 | http://localhost:5173 |
| **API Endpoint** | 3000 | http://localhost:3000/api/postman |
| **Health Check** | 3000 | http://localhost:3000/api/postman/health |

---

## Troubleshooting

### Issue: Port already in use

If you get `EADDRINUSE: address already in use :::3000`:

**Windows:**
```bash
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

The batch/shell scripts automatically handle this!

---

### Issue: Node.js command not found

**Solution:** Install Node.js from https://nodejs.org/ and add to PATH

**Verify installation:**
```bash
node --version
npm --version
```

---

### Issue: Dependencies not installed

**Solution:** Run dependency installation:
```bash
npm run install-all
```

This installs:
- Root project dependencies
- Backend dependencies (`backend/node_modules`)
- Frontend dependencies (`frontend/node_modules`)

---

## Advanced Usage

### Start backend and frontend separately

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm run frontend
```

Benefits:
- Faster module reload during development
- Easier to see server logs separately
- Can restart one without affecting the other

---

### Production Start

**Build the application first:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

This runs the compiled backend on port 3000. Frontend must be served separately through a web server.

---

## Script Files

### `start-app.bat` (Windows)
- Checks if Node.js is installed
- Frees port 3000 if already in use
- Starts both backend and frontend
- Shows server URLs
- Waits for user input after completion

### `stop-app.bat` (Windows)
- Kills backend server (port 3000)
- Kills frontend server (port 5173)
- Shows status messages

### `start-app.sh` (macOS/Linux)
- Checks if Node.js is installed
- Frees port 3000 if already in use
- Starts both backend and frontend
- Shows server URLs

### `stop-app.sh` (macOS/Linux)
- Kills backend server (port 3000)
- Kills frontend server (port 5173)
- Shows status messages

---

## Examples

### Example 1: Quick Start & Stop

**Windows:**
```bash
# Start application
double-click start-app.bat

# ... use the application ...

# Stop application
double-click stop-app.bat
```

### Example 2: Development with separate terminals

**Terminal 1:**
```bash
npm run backend
```
Output:
```
✓ Server running on http://localhost:3000
✓ Frontend should run on http://localhost:5173
```

**Terminal 2:**
```bash
npm run frontend
```
Output:
```
  VITE v4.5.14  ready in 235 ms

  ➜  Local:   http://localhost:5173/
```

### Example 3: Build and run production

```bash
# Build application
npm run build

# Start production backend
npm start
```

Access frontend at: Frontend build in `frontend/dist/`

---

## Environment Variables

### Backend (Optional)

Create `.env` file in `backend/` directory:

```bash
PORT=3000
NODE_ENV=development
```

### Frontend (Optional)

Frontend uses Vite environment variables. Create `.env` in `frontend/` directory:

```bash
VITE_API_URL=http://localhost:3000/api/postman
```

---

## Tips & Best Practices

✅ **DO:**
- Use the batch/shell scripts for automatic port cleanup
- Run `npm run install-all` after pulling code changes
- Use separate terminals for backend/frontend during development
- Run `npm run build` before production deployment
- Press `Ctrl+C` to gracefully stop servers

❌ **DON'T:**
- Forget to stop the application when switching code branches
- Run multiple instances on the same port simultaneously  
- Kill Node.js processes with -9 flag unless necessary
- Commit `.env` files to version control
- Run production on development ports

---

## Summary

| Task | Command |
|------|---------|
| Start app (easy) | Double-click `start-app.bat` (Windows) or run `npm run dev` |
| Stop app (easy) | Double-click `stop-app.bat` (Windows) or press `Ctrl+C` |
| Start backend only | `npm run backend` |
| Start frontend only | `npm run frontend` |
| Build for production | `npm run build` |
| Install dependencies | `npm run install-all` |
| Run linter | `npm run lint` |
| Format code | `npm run format` |

---

**Need help?** Check the logs in the terminal or refer to [ARCHITECTURE.md](ARCHITECTURE.md) for technical details.
