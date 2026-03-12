# 🚀 API to Postman Test Generator

> Turn API responses into Postman test scripts automatically.

[![Version](https://img.shields.io/badge/version-2.0.0-blue)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](#)
[![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)](#)

**Execute APIs → Inspect responses → Generate tests → Export to Postman**

---

## ⚡ Quick Start (3 Steps)

```bash
npm run install-all    # 1. Install dependencies
npm run dev           # 2. Start both servers
# 3. Open http://localhost:5173
```

Done! 🎉

---

## ✨ Features

✅ **Execute APIs** - GET, POST, PUT, PATCH, DELETE  
✅ **Inspect Responses** - Headers, body, timing  
✅ **17 Validation Rules** - Type, format, exact, ranges, regex  
✅ **Generate Tests** - Automatic Postman `pm.*` scripts  
✅ **Swagger Support** - Import OpenAPI/Swagger specs  
✅ **Export Collections** - Save for Postman  

---

## 🏗️ Clean Project Structure

```
api-to-postman-generator/
├── 📁 docs/              # All documentation
├── 📁 scripts/           # Start/stop (all platforms)
├── 📁 examples/          # Sample files
├── 📁 backend/           # Express API
├── 📁 frontend/          # React UI
├── SKILL.md              # Recreation guide
├── START_STOP_GUIDE.md   # How to run
└── package.json
```

**Clean structure ✓** — Fewer files, everything organized!

---

## 🖥️ Requirements

- **Node.js** 18.0+
- **npm** 9.0+
- **OS** - Windows, macOS, or Linux

Check: `node --version` && `npm --version`

---

## 📖 Documentation

| Document | For | Time |
|----------|-----|------|
| [docs/QUICK_START.md](docs/QUICK_START.md) | New users | 5 min |
| [docs/INSTALLATION.md](docs/INSTALLATION.md) | Setup help | 20 min |
| [START_STOP_GUIDE.md](START_STOP_GUIDE.md) | Running app | 5 min |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Developers | 15 min |
| [docs/API_REFERENCE.md](docs/API_REFERENCE.md) | API details | 10 min |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Contributing | 20 min |
| [docs/README.md](docs/README.md) | All docs | 📚 browse |

---

## 🚀 Available Commands

```bash
npm run dev              # Start both servers (RECOMMENDED!)
npm run backend          # Backend only
npm run frontend         # Frontend only
npm run build            # Build for production
npm run stop-app         # Stop all servers
npm run install-all      # Install all dependencies
```

**Windows?** Double-click `scripts/start-app.bat`

---

## 💻 What It Does

1. **Enter API URL** → http://localhost:5173
2. **Click Execute** → Get response
3. **Select Rules** → Choose validations
4. **Generate Test** → Get Postman script
5. **Copy/Export** → Use in Postman

---

## 📡 5 API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /execute-api` | Run HTTP request |
| `POST /generate-tests-with-validation` | Create test script |
| `POST /get-response-fields` | Extract response fields |
| `POST /import-swagger` | Parse Swagger spec |
| `POST /convert-swagger-endpoint` | Convert to request |

See [docs/API_REFERENCE.md](docs/API_REFERENCE.md) for details.

---

## 🎓 Examples

Realworld examples in [examples/](examples/) folder:
- Sample API requests
- Swagger specs
- Generated Postman collections

---

## 💡 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Kill: `lsof -ti:3000 \| xargs kill -9` |
| npm ERR: Module | Run: `npm run install-all` |
| "Can't connect" | Check: `http://localhost:3000/api/postman/health` |

More help? See [docs/INSTALLATION.md](docs/INSTALLATION.md)

---

## 📚 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Build:** npm

---

## 👥 Team Setup

Friends can get started in **5 minutes**:

```bash
git clone <url>
cd api-to-postman-generator
npm run install-all
npm run dev
```

Then go to: **http://localhost:5173**

---

## 📄 License

MIT — Free for personal & commercial use

---

## 📊 By The Numbers

- **1,400+** lines of documentation
- **2,500+** lines of production code
- **47+** organized files
- **5** API endpoints
- **17** validation rule types
- **6** start/stop scripts (cross-platform)

---

## 🎉 Ready?

**Choose your path:**

1. 🚀 **Quick demo?** → `npm run dev` then http://localhost:5173
2. 📖 **Want details?** → Read [docs/README.md](docs/README.md)
3. 👨‍💻 **Want to code?** → See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
4. 🔧 **Need help?** → Check [docs/INSTALLATION.md](docs/INSTALLATION.md)

---

**Built with ❤️ for QA Engineers & Developers**

Version 2.0.0 | March 2024
