# Application Start & Stop Guide

Complete guide to starting and stopping the **API to Postman Test Generator** application.

---

## Quick Start

### **Windows** (Easiest)

1. Double-click: `scripts/start-app.bat`
2. Both servers will start automatically
3. **To stop:** Double-click `scripts/stop-app.bat`

### **macOS / Linux**

```bash
bash scripts/start-app.sh
```

**To stop:** Press `Ctrl+C` or run `bash scripts/stop-app.sh` in another terminal

### **Any OS**

```bash
npm run dev
```

**To stop:** Press `Ctrl+C`

---

## Available Commands

| Command | Purpose | Platforms |
|---------|---------|-----------|
| `npm run dev` | Start both servers | All |
| `npm run backend` | Start backend only | All |
| `npm run frontend` | Start frontend only | All |
| `npm run stop-app` | Stop all servers | All |
| `bash scripts/start-app.sh` | Start (shell script) | macOS/Linux |
| `bash scripts/stop-app.sh` | Stop (shell script) | macOS/Linux |
| Double-click `scripts/start-app.bat` | Start (batch) | Windows |
| Double-click `scripts/stop-app.bat` | Stop (batch) | Windows |

---

## Access the Application

Once started, open your browser to:

```
http://localhost:5173
```

### Server URLs

| Service | Port | URL |
|---------|------|-----|
| **Frontend** | 5173 | http://localhost:5173 |
| **Backend** | 3000 | http://localhost:3000 |
| **API** | 3000 | http://localhost:3000/api/postman |
| **Health** | 3000 | http://localhost:3000/api/postman/health |

---

## Platform-Specific Instructions

### Windows

#### Method 1: Double-click scripts (Recommended)

1. Navigate to project folder
2. Double-click `scripts/start-app.bat`
3. CMD window opens and shows running servers
4. Double-click `scripts/stop-app.bat` to stop

#### Method 2: Command Prompt

```bash
# Start
cd d:\AI_Training\API_to_Post_generator
npm run dev

# Stop: Press Ctrl+C
```

#### Method 3: PowerShell

```powershell
# Start
cd d:\AI_Training\API_to_Post_generator
npm run dev

# Stop: Press Ctrl+C
```

#### Method 4: Kill processes manually

```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill by PID
taskkill /PID 12345 /F

# Or kill all Node processes
taskkill /F /IM node.exe
```

---

### macOS / Linux

#### Method 1: Shell script (Recommended)

```bash
# Start
bash scripts/start-app.sh

# Stop: Press Ctrl+C or run in another terminal:
bash scripts/stop-app.sh
```

#### Method 2: Terminal

```bash
# Start
npm run dev

# Stop: Press Ctrl+C
```

#### Method 3: Kill processes manually

```bash
# Kill frontend (port 5173)
lsof -ti:5173 | xargs kill -9

# Kill backend (port 3000)
lsof -ti:3000 | xargs kill -9

# Or kill all Node processes
killall node
```

---

## Development Setup

### Separate Terminal Windows (Advanced)

Better for development - see logs separately:

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm run frontend
```

### With Hot Reload

Both setup methods support hot reload:
- Backend: Changes to `backend/src/` restart server
- Frontend: Changes to `frontend/src/` reload browser

---

## Production Deployment

### Build First

```bash
npm run build
```

This creates:
- `backend/dist/` - Compiled backend
- `frontend/dist/` - Frontend build

### Run Production

```bash
npm start
```

Or for specific services:

```bash
# Backend only
npm start --prefix backend

# Frontend only
npm start --prefix frontend
```

---

## Troubleshooting

### Port Already in Use

**Error:**
```
EADDRINUSE: address already in use :::3000
```

**Solution:** The scripts handle this automatically! But if needed:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Command Not Found

**Error:**
```
'npm' is not recognized as an internal or external command
```

**Solution:** Install Node.js from https://nodejs.org/

**Verify:**
```bash
node --version   # Should show 18+
npm --version    # Should show 9+
```

### Dependencies Missing

**Error:**
```
Module not found: express
```

**Solution:**
```bash
npm run install-all
```

### Port Conflicts

Change the ports in configuration:

**Backend** (edit `backend/package.json`):
```json
"dev": "PORT=3001 ts-node-dev src/server.ts"
```

**Frontend** (edit `frontend/vite.config.ts`):
```typescript
server: {
  port: 5174
}
```

---

## Script Files

### Windows Scripts

**`scripts/start-app.bat`**
- ✓ Checks Node.js installation
- ✓ Clears port 3000
- ✓ Starts backend & frontend
- ✓ Ready status display

**`scripts/stop-app.bat`**
- ✓ Kills port 3000 process
- ✓ Kills port 5173 process
- ✓ Confirmation messages

### Unix Scripts

**`scripts/start-app.sh`**
- ✓ Checks Node.js installation
- ✓ Clears port 3000
- ✓ Starts backend & frontend
- ✓ URL display

**`scripts/stop-app.sh`**
- ✓ Kills port 3000 process
- ✓ Kills port 5173 process
- ✓ Status messages

---

## Common Workflows

### Workflow 1: Quick Test

```bash
# 1. Start
npm run dev

# 2. Use at http://localhost:5173

# 3. Stop
# Press Ctrl+C
```

### Workflow 2: Development

```bash
# Terminal 1
npm run backend

# Terminal 2
npm run frontend

# Both support hot reload
# Stop with Ctrl+C in each terminal
```

### Workflow 3: Production

```bash
# Build once
npm run build

# Run
npm start

# Access at http://localhost:3000 (for API)
# Serve frontend from separate web server
```

---

## Tips & Tricks

### Tip 1: Check if servers are running

```bash
# Backend health check
curl http://localhost:3000/api/postman/health

# Frontend
curl http://localhost:5173
```

### Tip 2: View live logs

```bash
# Backend only
npm run backend

# Frontend only
npm run frontend
```

### Tip 3: Faster startup

First install, subsequent runs are faster:
```bash
npm run install-all  # Initial setup
npm run dev          # Subsequent runs
```

### Tip 4: System resources

- Backend: ~50MB memory
- Frontend: ~100MB memory
- Total: ~150MB minimum

---

## Support

- Detailed help: See [README.md](../README.md)
- Architecture info: See [ARCHITECTURE.md](ARCHITECTURE.md)
- Full setup: See [INSTALLATION.md](INSTALLATION.md)
- API docs: See [API_REFERENCE.md](API_REFERENCE.md)

---

**Happy testing!** 🚀
