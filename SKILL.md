# SKILL: API to Postman Test Generator

**Version:** 1.0.0  
**Last Updated:** March 12, 2026  
**Status:** Production Ready

---

## 📋 Overview

The **API to Postman Test Generator** is an enterprise-grade full-stack application that converts API definitions into ready-to-use Postman test scripts. It enables QA engineers and developers to execute APIs, inspect responses, apply validation rules, and generate Postman-compatible test scripts automatically.

**Core Objective:** Generate **Post Response Test Scripts** that can be directly used in the Tests tab of Postman requests or collections.

---

## 🎯 Key Features

✅ **API Request Builder** - Configure and execute HTTP requests (GET, POST, PUT, PATCH, DELETE)  
✅ **Real API Execution** - Execute actual APIs with response capture and timing  
✅ **Response Inspection** - Analyze response structure and extract fields  
✅ **17 Validation Rule Types** - Comprehensive validation options for test generation  
✅ **Auto Validation** - Suggest validations based on field types  
✅ **Swagger/OpenAPI Support** - Import and parse API specifications  
✅ **Postman Compatible Scripts** - Generate Postman `pm.*` syntax directly  
✅ **Collection Export** - Export as Postman collection JSON  
✅ **Cross-Platform** - Works on Windows, macOS, Linux

---

## 🏗️ Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18
- **Language:** TypeScript 5.1
- **HTTP Client:** Axios
- **Build Tool:** TypeScript Compiler (tsc)

### Frontend
- **Framework:** React 18.2
- **Build Tool:** Vite 4.4
- **Language:** TypeScript 5.1
- **Styling:** CSS3 (Flexbox, Responsive)

---

## 📁 Project Structure

```
api-to-postman-generator/
├── docs/                          # Documentation
│   ├── INSTALLATION.md            # Setup instructions for all OS/IDEs
│   ├── QUICK_START.md             # Quick start guide
│   ├── API_REFERENCE.md           # API endpoints documentation
│   ├── ARCHITECTURE.md            # System design and components
│   ├── VALIDATION_RULES.md        # All 17 validation types
│   └── START_STOP_GUIDE.md        # Application lifecycle management
│
├── scripts/                       # Automation scripts
│   ├── start-app.bat              # Windows batch script
│   ├── stop-app.bat               # Windows stop script
│   ├── start-app.sh               # Unix/Linux/macOS script
│   ├── stop-app.sh                # Unix/Linux/macOS stop script
│   ├── start-app.ps1              # PowerShell script
│   └── stop-app.ps1               # PowerShell stop script
│
├── examples/                      # Example files
│   ├── api-request-example.json   # Example API request
│   ├── swagger-example.json       # Example Swagger spec
│   └── postman-collection-example.json
│
├── backend/                       # Express.js backend
│   ├── src/
│   │   ├── server.ts              # Express server setup
│   │   ├── controllers/           # Request handlers
│   │   ├── services/              # Business logic
│   │   ├── routes/                # API routes
│   │   └── models/                # Type definitions
│   ├── dist/                      # Compiled output (generated)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      # React frontend
│   ├── src/
│   │   ├── main.tsx               # Entry point
│   │   ├── App.tsx                # Main component
│   │   ├── components/            # React components
│   │   ├── types/                 # TypeScript types
│   │   ├── styles/                # CSS files
│   │   └── api.ts                 # API client
│   ├── dist/                      # Build output (generated)
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── package.json                   # Root package.json
├── README.md                      # Project overview
├── SKILL.md                       # This file
├── .gitignore
└── .env.example                   # Environment template
```

---

## 🚀 How to Create/Recreate This Skill

### Prerequisites

Verify you have these installed on your system:

```bash
# Check Node.js (18+)
node --version  # Should be v18.0.0 or higher

# Check npm (9+)
npm --version   # Should be 9.0.0 or higher
```

If not installed, download from https://nodejs.org/

### Step 1: Initialize Project Structure

```bash
# Create project root directory
mkdir api-to-postman-generator
cd api-to-postman-generator

# Initialize Git
git init

# Create folder structure
mkdir -p backend/src/{controllers,services,routes,models}
mkdir -p frontend/src/{components,types,styles}
mkdir -p docs scripts examples
```

### Step 2: Create Root Configuration

**Create `package.json` in project root:**

```json
{
  "name": "api-to-postman-generator",
  "version": "1.0.0",
  "description": "Convert API definitions into Postman test scripts",
  "main": "backend/dist/server.js",
  "scripts": {
    "start": "node backend/dist/server.js",
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\"",
    "build": "npm run build --prefix backend && npm run build --prefix frontend",
    "test": "npm run test --prefix backend && npm run test --prefix frontend",
    "lint": "npm run lint --prefix backend && npm run lint --prefix frontend",
    "format": "npm run format --prefix backend && npm run format --prefix frontend",
    "install-all": "npm install && npm install --prefix backend && npm install --prefix frontend",
    "backend": "npm run dev --prefix backend",
    "frontend": "npm run dev --prefix frontend"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

**Create `.gitignore`:**

```
node_modules/
dist/
build/
.env
.env.local
.DS_Store
*.log
*.swp
.vscode/
.idea/
```

### Step 3: Setup Backend

**Create `backend/package.json`:**

```json
{
  "name": "api-to-postman-backend",
  "version": "1.0.0",
  "description": "Backend for API to Postman script generator",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsnd --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.ts\""
  },
  "dependencies": {
    "axios": "^1.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^4.17.25",
    "@types/node": "^20.19.37",
    "@typescript-eslint/eslint-plugin": "^5.59.8",
    "@typescript-eslint/parser": "^5.59.8",
    "eslint": "^8.43.0",
    "prettier": "^2.8.8",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.1.3"
  }
}
```

**Create `backend/tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

**Create Core Backend Files** (src/server.ts, controllers, services, models, routes - see [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed code)

### Step 4: Setup Frontend

**Create `frontend/package.json`:**

```json
{
  "name": "api-to-postman-frontend",
  "version": "1.0.0",
  "description": "Frontend for API to Postman script generator",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "jest",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  },
  "dependencies": {
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^14.0.0",
    "@types/jest": "^29.5.2",
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^5.59.8",
    "@typescript-eslint/parser": "^5.59.8",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.43.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^2.8.8",
    "typescript": "^5.1.6",
    "vite": "^4.5.14"
  }
}
```

**Create `frontend/vite.config.ts`:**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

**Create `frontend/tsconfig.json` and React components** (see [ARCHITECTURE.md](docs/ARCHITECTURE.md))

### Step 5: Install Dependencies

```bash
# From project root
npm run install-all
```

This installs:
- Root dependencies (concurrently)
- Backend dependencies (express, axios, typescript, etc.)
- Frontend dependencies (react, vite, typescript, etc.)

### Step 6: Build the Project

```bash
npm run build
```

This compiles:
- Backend TypeScript → JavaScript
- Frontend React → optimized production build

### Step 7: Create Documentation Files

Copy all documentation files from `docs/`:
- INSTALLATION.md
- QUICK_START.md
- API_REFERENCE.md
- ARCHITECTURE.md
- VALIDATION_RULES.md
- START_STOP_GUIDE.md

### Step 8: Create Scripts

Copy automation scripts from `scripts/`:
- start-app.bat / .sh / .ps1
- stop-app.bat / .sh / .ps1

### Step 9: Verify Installation

```bash
# Test backend compilation
npm run build --prefix backend

# Test frontend compilation
npm run build --prefix frontend

# Run linter
npm run lint

# Start servers
npm run dev
```

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API Health: http://localhost:3000/api/postman/health

---

## 📦 Dependencies Breakdown

### Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework |
| axios | ^1.6.0 | HTTP client for API execution |
| cors | ^2.8.5 | Cross-Origin Resource Sharing |
| dotenv | ^16.3.1 | Environment variables |

### Backend Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ^5.1.3 | Type checking |
| ts-node-dev | ^2.0.0 | Development server |
| @types/express | ^4.17.25 | Express types |
| @types/node | ^20.19.37 | Node.js types |
| eslint | ^8.43.0 | Linting |
| prettier | ^2.8.8 | Code formatting |

### Frontend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | React DOM rendering |

### Frontend Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^4.4.5 | Build tool |
| typescript | ^5.1.6 | Type checking |
| @vitejs/plugin-react | ^4.2.1 | React support |
| eslint | ^8.43.0 | Linting |
| prettier | ^2.8.8 | Code formatting |

### Root Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| concurrently | ^8.2.0 | Run multiple commands |

---

## 🔧 Configuration Files

### Environment Variables

**Create `.env` in backend/**:

```bash
PORT=3000
NODE_ENV=development
```

### TypeScript Configuration

- `backend/tsconfig.json` - Backend compilation settings
- `frontend/tsconfig.json` - Frontend compilation settings

### Build Configuration

- `frontend/vite.config.ts` - Vite build and dev server
- `backend/` uses TypeScript compiler only

---

## 🎓 Backend Services Architecture

### 1. **ApiExecutor.ts** (250 lines)
- Executes HTTP requests using Axios
- Handles authentication (Bearer, Basic, OAuth2)
- Measures response time
- Extracts response field information

### 2. **SwaggerParser.ts** (220 lines)
- Parses Swagger 2.0 and OpenAPI 3.0+ specs
- Converts endpoints to API requests
- Generates example data
- Validates specifications

### 3. **ValidationRuleGenerator.ts** (280 lines)
- Generates Postman test code for 17 rule types
- Outputs `pm.*` syntax
- Supports Chai assertions

### 4. **PostmanScriptGenerator.ts** (280 lines)
- Main test script generator
- Creates status code tests
- Creates response time tests
- Combines validations into full script

### 5. **postmanController.ts** (200 lines)
- 5 endpoint handlers
- API execution
- Validation-based generation
- Swagger import

---

## 🎨 Frontend Components Architecture

### 5 Main Components

1. **RequestBuilder.tsx** (280 lines)
   - HTTP method selection
   - Base URL and path
   - Query parameters, headers
   - Request body editor

2. **ResponseInspector.tsx** (180 lines)
   - Display response metadata
   - Show headers table
   - JSON body viewer
   - Field extraction

3. **ValidationSelector.tsx** (320 lines)
   - Field selection dropdown
   - Rule type selection (17 types)
   - Context-aware input fields
   - Rule descriptions

4. **SwaggerImporter.tsx** (220 lines)
   - File upload
   - Swagger parsing
   - Endpoint listing
   - Endpoint selection

5. **AdvancedQAForm.tsx** (280 lines)
   - Tab-based workflow
   - State management
   - Component orchestration
   - Script export

---

## 📊 Validation Rule Types

The system supports **17 validation rule types**:

1. Exact Value Match
2. Field Exists
3. Field Exists + Not Empty
4. Valid String
5. Valid Number
6. Valid Boolean
7. Valid Date
8. Valid Email
9. Valid UUID
10. Regex Pattern
11. Array Length
12. Contains Value
13. Greater Than
14. Less Than
15. Range Validation
16. Null/Not Null
17. Skip Validation

See [VALIDATION_RULES.md](docs/VALIDATION_RULES.md) for detailed documentation.

---

## 🚀 Deployment

### For Production

```bash
# 1. Build the project
npm run build

# 2. Install production dependencies only
npm ci --production

# 3. Start the backend server
npm start

# 4. Serve frontend from dist/ using a web server
# (Nginx, Apache, or any static file server)
```

### Docker (Optional)

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm run install-all

COPY . .

RUN npm run build

EXPOSE 3000 5173

CMD ["npm", "start"]
```

---

## 📝 API Endpoints

### Base URL
```
http://localhost:3000/api/postman
```

### Available Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /execute-api | Execute API request |
| POST | /get-response-fields | Extract response fields |
| POST | /generate-tests-with-validation | Generate test script |
| POST | /import-swagger | Parse Swagger spec |
| POST | /convert-swagger-endpoint | Convert endpoint to request |
| GET | /health | Health check |

See [API_REFERENCE.md](docs/API_REFERENCE.md) for detailed documentation.

---

## 🔍 Testing

### Run Tests

```bash
# Backend tests
npm run test --prefix backend

# Frontend tests
npm run test --prefix frontend

# All tests
npm run test
```

### Code Quality

```bash
# Linting
npm run lint

# Code formatting
npm run format
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### Node Modules Issues

```bash
# Clear and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all
```

### Build Errors

```bash
# Clean and rebuild
npm run build --prefix backend
npm run build --prefix frontend
```

See [INSTALLATION.md](docs/INSTALLATION.md) for more troubleshooting.

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project overview |
| [INSTALLATION.md](docs/INSTALLATION.md) | Setup for all OS/IDEs |
| [QUICK_START.md](docs/QUICK_START.md) | 5-minute quickstart |
| [START_STOP_GUIDE.md](docs/START_STOP_GUIDE.md) | Start/stop instructions |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design |
| [API_REFERENCE.md](docs/API_REFERENCE.md) | API endpoints |
| [VALIDATION_RULES.md](docs/VALIDATION_RULES.md) | All 17 validation types |

---

## 👥 Team Setup

For team members to get started:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd api-to-postman-generator
   ```

2. **Follow INSTALLATION.md**
   ```bash
   npm run install-all
   ```

3. **Start the application**
   - Windows: Double-click `scripts/start-app.bat`
   - macOS/Linux: `bash scripts/start-app.sh`
   - Any OS: `npm run dev`

4. **Stop the application**
   - Windows: Double-click `scripts/stop-app.bat`
   - macOS/Linux: `bash scripts/stop-app.sh`
   - Any OS: `Ctrl+C`

See [START_STOP_GUIDE.md](docs/START_STOP_GUIDE.md) for detailed instructions.

---

## 📈 Performance

### Response Times
- API Execution: < 1000ms (depends on target API)
- Test Generation: < 100ms
- Swagger Parsing: < 200ms

### Optimization
- Lazy loading components
- Memoized API calls
- Efficient field extraction
- Optimized Postman script generation

---

## 🔐 Security Considerations

✅ **Authentication Support:** Bearer, Basic, OAuth2  
✅ **HTTPS Ready:** Configure backend for HTTPS  
✅ **CORS Configured:** Adjust for your domain  
✅ **Input Validation:** All inputs validated  
✅ **Error Handling:** Comprehensive error messages  

---

## 📋 Checklist for Team Collaboration

- [ ] Repository created (GitHub, GitLab, Bitbucket)
- [ ] Team members cloned repository
- [ ] All team members ran `npm run install-all`
- [ ] All team members can start app with scripts
- [ ] All team members can access http://localhost:5173
- [ ] API endpoints tested at http://localhost:3000/api/postman
- [ ] Documentation shared with team
- [ ] .gitignore configured
- [ ] Development environment documented
- [ ] Backup and deployment plan created

---

## 📞 Support & Contribution

For issues or contributions:

1. Check existing documentation
2. Review [ARCHITECTURE.md](docs/ARCHITECTURE.md) for design decisions
3. Follow code style guidelines (run `npm run format`)
4. Submit pull requests with test coverage
5. Update documentation for changes

---

## 📄 License

[Add your license here - MIT, Apache 2.0, etc.]

---

## 🎉 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Mar 12, 2026 | Production Ready - API execution, test generation, 17 validation types, Swagger support |

---

**Last Updated:** March 12, 2026  
**Maintained By:** [Your Team Name]  
**Contact:** [Contact Information]
