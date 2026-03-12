# Installation Guide: API to Postman Test Generator

Complete step-by-step installation guide for all operating systems and IDEs.

**Last Updated:** March 12, 2026  
**Supports:** Windows, macOS, Linux  
**IDE Support:** VS Code, WebStorm, IntelliJ, Sublime Text, others

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps (All OS)](#installation-steps-all-os)
3. [OS-Specific Setup](#os-specific-setup)
4. [IDE Setup](#ide-setup)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)
7. [Post-Installation](#post-installation)

---

## Prerequisites

### System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|------------|
| Node.js | 18.0.0 | 20.x LTS |
| npm | 9.0.0 | 10.x |
| RAM | 4GB | 8GB |
| Disk Space | 2GB | 5GB |
| OS | Windows 10, macOS 10.15, Linux | Latest versions |

### Check Your System

**Check Node.js version:**
```bash
node --version
# Output: v18.0.0 or higher
```

**Check npm version:**
```bash
npm --version
# Output: 9.0.0 or higher
```

**Check Git (optional but recommended):**
```bash
git --version
# Output: git version 2.x or higher
```

---

## Installation Steps (All OS)

### Step 1: Download the Project

#### Option A: Clone from Git (Recommended)

```bash
git clone <repository-url>
cd api-to-postman-generator
```

#### Option B: Download ZIP

1. Go to the repository
2. Click **Code** → **Download ZIP**
3. Extract the ZIP file
4. Open terminal in extracted folder

### Step 2: Install Node.js (If Not Installed)

**Windows:**
1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download **LTS version**
3. Run installer and follow prompts
4. Restart your computer
5. Verify: `node --version` and `npm --version`

**macOS:**
```bash
# Using Homebrew (recommended)
brew install node

# Or using MacPorts
sudo port install nodejs20 +universal

# Or download from https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
# Update package manager
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

**Linux (Fedora/RHEL):**
```bash
sudo yum install nodejs npm
```

**Linux (Arch):**
```bash
sudo pacman -S nodejs npm
```

### Step 3: Navigate to Project Directory

```bash
# Navigate to project folder
cd /path/to/api-to-postman-generator

# Verify you're in the right directory
ls
# Should see: backend, frontend, docs, scripts, package.json, etc.
```

### Step 4: Install Dependencies

**Install all dependencies:**
```bash
npm run install-all
```

This installs:
- Root project dependencies
- Backend dependencies (backend/node_modules)
- Frontend dependencies (frontend/node_modules)

**Installation takes 3-5 minutes** depending on internet speed.

### Step 5: Build the Project

**Compile TypeScript to JavaScript:**
```bash
npm run build
```

**Expected output:**
```
backend build complete ✓
frontend build complete ✓
dist/ directories created
```

### Step 6: Verify Installation

**Test backend:**
```bash
npm run build --prefix backend
# Should complete without errors
```

**Test frontend:**
```bash
npm run build --prefix frontend
# Should complete without errors
```

**If both succeed**, installation is complete! ✅

---

## OS-Specific Setup

### Windows

#### Using Command Prompt

```bash
# Open Command Prompt (cmd.exe)
# Navigate to project
cd d:\path\to\api-to-postman-generator

# Install dependencies
npm run install-all

# Build
npm run build

# Start application
npm run dev
```

#### Using PowerShell

```powershell
# Open PowerShell (right-click, "Run as Administrator" for some operations)
# Navigate to project
cd d:\path\to\api-to-postman-generator

# Install dependencies
npm run install-all

# Build
npm run build

# Start application
npm run dev
```

#### Using Git Bash

```bash
# Open Git Bash
cd /d/path/to/api-to-postman-generator

npm run install-all
npm run build
npm run dev
```

#### Using Batch Scripts

```batch
# Navigate to project folder using Explorer
# Double-click: scripts/start-app.bat

# Application starts automatically
```

### macOS

**Using Terminal:**

```bash
# Open Terminal (Cmd + Space, type Terminal)

# Navigate to project
cd ~/path/to/api-to-postman-generator

# Install dependencies
npm run install-all

# Build
npm run build

# Start
npm run dev
```

**Using bash script:**

```bash
# Make script executable (first time only)
chmod +x scripts/start-app.sh

# Run the script
./scripts/start-app.sh
```

**Using Homebrew (to install Node.js):**

```bash
# Install Homebrew if not present
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify
node --version
```

### Linux

**Using Terminal (Ubuntu/Debian):**

```bash
# Open Terminal (Ctrl + Alt + T)

# Install Node.js if needed
sudo apt update
sudo apt install nodejs npm

# Navigate to project
cd ~/path/to/api-to-postman-generator

# Install dependencies
npm run install-all

# Build
npm run build

# Start
npm run dev
```

**Using bash script:**

```bash
# Make script executable
chmod +x scripts/start-app.sh

# Run the script
./scripts/start-app.sh
```

**Using Docker (Optional):**

```bash
# Build Docker image
docker build -t api-to-postman-generator .

# Run Docker container
docker run -p 3000:3000 -p 5173:5173 api-to-postman-generator
```

---

## IDE Setup

### Visual Studio Code (Recommended)

#### 1. Open Project

- **File** → **Open Folder**
- Select `api-to-postman-generator` folder
- Trust the workspace

#### 2. Install VS Code Extensions

Click Extensions icon (Ctrl+Shift+X) and install:

- **TypeScript Vue Plugin** - vue@latest
- **Vetur** - juanblanco.vetur
- **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
- **Prettier** - esbenp.prettier-vscode
- **ESLint** - dbaeumer.vscode-eslint
- **Node.js Extension Pack** - waderyan.nodejs-extension-pack

#### 3. Configure VS Code

**`.vscode/settings.json`** (create if not exists):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": [
    "typescript",
    "typescriptreact",
    "javascript",
    "javascriptreact"
  ]
}
```

#### 4. Terminal Setup

- View → Terminal (Ctrl + `)
- Run: `npm run install-all`
- Run: `npm run build`
- Run: `npm run dev`

### WebStorm / IntelliJ IDEA

#### 1. Open Project

- **File** → **Open**
- Select project directory
- Choose **Open as Project**

#### 2. Configure Node

- **Settings** → **Languages & Frameworks** → **Node.js**
- Click **...** button
- Add Node.js interpreter (auto-detect if available)

#### 3. Mark Directories

- Right-click `backend/src` → **Mark Directory as** → **Resource Root**
- Right-click `frontend/src` → **Mark Directory as** → **Resource Root**
- Right-click `backend/node_modules` → **Mark Directory as** → **Excluded**
- Right-click `frontend/node_modules` → **Mark Directory as** → **Excluded**
- Right-click `backend/dist` → **Mark Directory as** → **Excluded**
- Right-click `frontend/dist` → **Mark Directory as** → **Excluded**

#### 4. Setup npm Scripts

- **Tools** → **npm** → **Show npm Scripts**
- Right-click on npm scripts and select runner
- Available scripts:
  - `dev` - Start both servers
  - `build` - Build both projects
  - `lint` - Lint code
  - `format` - Format code

### Sublime Text

#### 1. Open Project

- **File** → **Open Folder...**
- Select project directory

#### 2. Install Package Control

- Ctrl+Shift+P (Windows/Linux) or Cmd+Shift+P (macOS)
- Type "Install Package Control"
- Press Enter

#### 3. Install Packages

Ctrl+Shift+P, search:
- TypeScript
- Prettier
- ESLint
- Node.js
- ES6 Kit

#### 4. Terminal

View → Show Console
Run: `npm run dev`

### Atom

#### 1. Open Project

- **File** → **Add Project Folder**
- Select project directory

#### 2. Install Packages

- **Settings** → **Install** (left sidebar)
- Search and install:
  - atom-typescript
  - prettier-atom
  - linter-eslint
  - vim (optional)

#### 3. Configure prettier

- **Settings** for prettier-atom package
- Check "Format on Save"

### Vim / Neovim

#### 1. Use Any Terminal

```bash
nvim .
# or
vim .
```

#### 2. Install Plugins (Optional)

Use a plugin manager like vim-plug or packer

#### 3. Terminal

```bash
:!npm run dev
```

---

## Verification

### Step 1: Check Installation

```bash
# Navigate to project
cd /path/to/api-to-postman-generator

# Verify node_modules exist
ls node_modules
ls backend/node_modules
ls frontend/node_modules

# Verify dist exists
ls backend/dist
ls frontend/dist
```

### Step 2: Verify Environment

```bash
# Check Node.js
node --version     # Should be 18+

# Check npm
npm --version      # Should be 9+

# Check Git (optional)
git --version      # Should show git version
```

### Step 3: Check Ports (Before Starting)

**Windows:**
```bash
netstat -ano | findstr :3000
# Should be empty (port free)

netstat -ano | findstr :5173
# Should be empty (port free)
```

**macOS/Linux:**
```bash
lsof -i :3000
# Should show "command not found" or nothing

lsof -i :5173
# Should show "command not found" or nothing
```

### Step 4: Try Starting

```bash
# Start the application
npm run dev

# Should see output:
# ✓ Server running on http://localhost:3000
# ✓ Port 5173 is in use, trying another one...
# VITE v4.5.14  ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

### Step 5: Access in Browser

Open your browser:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/api/postman/health

---

## Troubleshooting

### Issue: Node.js Not Found

**Error:** `'node' is not recognized as an internal or external command`

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Add Node.js to PATH:
   - Windows: Restart computer after installation
   - macOS/Linux: `export PATH="$PATH:$(npm bin -g)"`
3. Verify: `node --version`

### Issue: npm Install Fails

**Error:** `npm ERR! ERR! code ERESOLVE`

**Solution:**
```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or use npm 7+ compatibility
npm ci
```

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

Or just run the stop script:
- Windows: Double-click `scripts/stop-app.bat`
- macOS/Linux: `bash scripts/stop-app.sh`

### Issue: Build Fails

**Error:** `tsc: command not found`

**Solution:**
```bash
# Reinstall TypeScript globally
npm install -g typescript

# Or use local version
npx tsc --version
```

### Issue: Frontend Not Loading

**Blank page at localhost:5173**

**Solution:**
```bash
# Clear browser cache
Ctrl+Shift+Delete (Windows/Linux)
Cmd+Shift+Delete (macOS)

# Then refresh page
Ctrl+R (Windows/Linux)
Cmd+R (macOS)

# Or check console for errors
F12 → Console tab
```

### Issue: API Requests Failing

**Error:** `Failed to fetch from localhost:3000`

**Solution:**
1. Verify backend is running
2. Check backend console for errors
3. Verify CORS is enabled (should be by default)
4. Try calling health endpoint: `curl http://localhost:3000/api/postman/health`

### Issue: Slow Performance

**Solution:**
```bash
# Check disk space
# Windows: check C: drive
# macOS/Linux: df -h

# Check memory usage
# Windows: Task Manager
# macOS: Activity Monitor
# Linux: top or htop

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all
```

### Issue: Git Clone Fails

**Error:** `fatal: unable to access repository`

**Solution:**
1. Check internet connection
2. Verify repository URL is correct
3. Check if Git is installed: `git --version`
4. For SSH: Verify SSH keys are configured

---

## Post-Installation

### Configure IDE

1. **Set Node as interpreter** (WebStorm/IntelliJ)
2. **Configure prettier** (all IDEs)
3. **Enable ESLint** (all IDEs)
4. **Set up debugging** (optional)

### Create Environment File (Optional)

**Create `backend/.env`:**

```bash
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

**Create `frontend/.env`:**

```bash
VITE_API_URL=http://localhost:3000/api/postman
```

### Run First Test

```bash
# Test API execution
curl -X POST http://localhost:3000/api/postman/execute-api \
  -H "Content-Type: application/json" \
  -d '{
    "method": "GET",
    "baseUrl": "https://jsonplaceholder.typicode.com",
    "path": "/posts/1",
    "uriParameters": [],
    "queryParameters": [],
    "headers": {},
    "authentication": {"type": "none"},
    "requestBody": ""
  }'

# Should return JSON response with success: true
```

### Team Setup Checklist

- [ ] Node.js installed (v18+)
- [ ] npm installed (v9+)
- [ ] Project cloned/downloaded
- [ ] Dependencies installed (`npm run install-all`)
- [ ] Project builds (`npm run build`)
- [ ] IDE configured
- [ ] Can start application (`npm run dev`)
- [ ] Can access Frontend (http://localhost:5173)
- [ ] Can access Backend (http://localhost:3000)
- [ ] Can call health endpoint

---

## Start/Stop the Application

### Quick Start

**Windows (Easy):**
```bash
# Double-click: scripts/start-app.bat
# Double-click: scripts/stop-app.bat
```

**All platforms:**
```bash
npm run dev       # Start
Ctrl+C            # Stop
```

See [START_STOP_GUIDE.md](START_STOP_GUIDE.md) for detailed instructions.

---

## Next Steps

1. ✅ Installation complete
2. 📖 Read [QUICK_START.md](QUICK_START.md)
3. 🏗️ Review [ARCHITECTURE.md](ARCHITECTURE.md)
4. 🔧 Check [API_REFERENCE.md](API_REFERENCE.md)
5. 🚀 Start developing!

---

## Support Resources

| Resource | Link |
|----------|------|
| Node.js Docs | https://nodejs.org/docs |
| npm Docs | https://docs.npmjs.com |
| Express Docs | https://expressjs.com |
| React Docs | https://react.dev |
| TypeScript Docs | https://www.typescriptlang.org |
| Vite Docs | https://vitejs.dev |

---

**Installation Complete!** 🎉  
**Questions?** Check the troubleshooting section or refer to other documentation files.
