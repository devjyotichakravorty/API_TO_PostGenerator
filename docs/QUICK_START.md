# ⚡ Quick Start (5 Minutes)

Get the API to Postman Test Generator running in just 5 minutes!

## Prerequisites (1 minute)

Check you have Node.js installed:

```bash
node --version  # Should show 18 or higher
npm --version   # Should show 9 or higher
```

**Not installed?** [Download Node.js](https://nodejs.org/) (includes npm)

## Installation (2 minutes)

```bash
# 1. Navigate to project
cd api-to-postman-generator

# 2. Install all dependencies
npm run install-all

# Takes ~1 minute depending on internet speed
```

## Start (1 minute)

### Option 1: Windows (Easiest)
Just double-click: `scripts/start-app.bat`

### Option 2: Any OS
```bash
npm run dev
```

### Option 3: macOS/Linux Shell Script
```bash
bash scripts/start-app.sh
```

**Expected output:**
```
✓ Backend ready: http://localhost:3000
✓ Frontend ready: http://localhost:5173
```

## Try It! (1 minute)

1. Open: http://localhost:5173
2. Enter API URL: `https://jsonplaceholder.typicode.com/posts/1`
3. Click: **"Execute API"**
4. Click: **"Generate Test Script"**
5. See: Generated Postman test code! 🎉

## Next Steps

- 📖 **Full Setup Guide:** [INSTALLATION.md](INSTALLATION.md)
- 🛑 **Stop the App:** Press Ctrl+C or double-click `scripts/stop-app.bat`
- 📚 **Learn More:** [START_STOP_GUIDE.md](START_STOP_GUIDE.md)
- 🏗️ **Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)

---

**That's it! You're ready to generate Postman tests.** ✨
