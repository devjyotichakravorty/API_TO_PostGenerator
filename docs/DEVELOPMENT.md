# Development Guide

Complete guide for developers working on the API to Postman Test Generator project.

---

## Getting Started

### Prerequisites

- Node.js 18.0+
- npm 9.0+
- Git

### Initial Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd api-to-postman-generator

# 2. Install all dependencies
npm run install-all

# 3. Build the project
npm run build

# 4. Start development servers
npm run dev
```

---

## Project Structure

```
api-to-postman-generator/
├── backend/              # Express.js backend
│   ├── src/
│   │   ├── server.ts     # Express entry point
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   │   ├── ApiExecutor.ts
│   │   │   ├── SwaggerParser.ts
│   │   │   ├── ValidationRuleGenerator.ts
│   │   │   └── PostmanScriptGenerator.ts
│   │   ├── models/       # TypeScript types
│   │   └── server.ts
│   └── package.json
├── frontend/             # React + Vite frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API client
│   │   ├── types/        # TypeScript types
│   │   ├── styles/       # CSS
│   │   └── App.tsx
│   └── package.json
├── docs/                 # Documentation
└── scripts/              # Automation scripts
```

---

## Backend Development

### Backend Architecture

**Service Layer Pattern:**
- **ApiExecutor.ts** - Executes HTTP requests, handles responses
- **SwaggerParser.ts** - Parses Swagger/OpenAPI specifications
- **ValidationRuleGenerator.ts** - Generates validation test code
- **PostmanScriptGenerator.ts** - Main test script generator

### Backend Commands

```bash
cd backend

# Dev server with hot reload
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

### Adding a New API Endpoint

1. Create handler in `controllers/postmanController.ts`:
```typescript
export const myNewEndpoint = async (req: Request, res: Response) => {
  try {
    // Your logic here
    res.json({ success: true, result: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

2. Add route in `routes/postmanRoutes.ts`:
```typescript
router.post('/my-endpoint', myNewEndpoint);
```

3. Call from frontend:
```typescript
const response = await fetch('http://localhost:3000/api/postman/my-endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

### Adding a New Validation Rule

1. Add rule type to `ValidationRuleGenerator.ts`:
```typescript
case 'my_rule':
  return `pm.test("my_rule validation", function () {
    // Your validation logic
  });`;
```

2. Update validation types in `models/types.ts`:
```typescript
type ValidationRuleType = '...' | 'my_rule';
```

3. Submit in validation config:
```json
{"rule": "my_rule", "value": "..."}
```

---

## Frontend Development

### Frontend Architecture

**Component Structure:**
- **RequestBuilder.tsx** - Configure API requests
- **ResponseInspector.tsx** - View API responses
- **ValidationSelector.tsx** - Select validation rules
- **SwaggerImporter.tsx** - Import Swagger specs
- **AdvancedQAForm.tsx** - Main workflow orchestrator
- **ScriptPreview.tsx** - Display generated scripts

### Frontend Commands

```bash
cd frontend

# Dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

### Adding a New Component

1. Create component file in `src/components/`:
```typescript
interface MyComponentProps {
  onEvent?: (data: any) => void;
  loading?: boolean;
  data?: any;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  onEvent,
  loading,
  data
}) => {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

2. Add to App.tsx or parent component:
```typescript
import { MyComponent } from './components/MyComponent';

<MyComponent onEvent={handleEvent} data={myData} />
```

3. Add styles in `src/styles/`:
```css
.my-component {
  /* Styles */
}
```

### State Management

Current approach: Component props + React hooks

For future enhancement, consider Redux or Zustand.

---

## Common Development Tasks

### Task 1: Fix a Bug

1. Create branch: `git checkout -b fix/bug-name`
2. Make changes
3. Test locally: `npm run dev`
4. Commit: `git commit -m "Fix: description"`
5. Push: `git push origin fix/bug-name`
6. Create Pull Request

### Task 2: Add a Feature

1. Create branch: `git checkout -b feature/feature-name`
2. Implement feature
3. Add tests if applicable
4. Test locally: `npm run dev`
5. Update documentation if needed
6. Commit: `git commit -m "Feat: description"`
7. Push: `git push origin feature/feature-name`
8. Create Pull Request

### Task 3: Improve Performance

1. Profile the code using browser DevTools
2. Identify bottlenecks
3. Implement optimization
4. Verify improvement with measurements
5. Document the change

---

## Testing

### Running Tests

```bash
# All tests
npm run test

# Backend only
npm run test --prefix backend

# Frontend only
npm run test --prefix frontend

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Writing Tests

**Backend (Jest):**
```typescript
describe('ApiExecutor', () => {
  it('should execute GET request', async () => {
    const executor = new ApiExecutor();
    const result = await executor.executeRequest({
      method: 'GET',
      baseUrl: 'https://api.example.com',
      path: '/users'
    });
    expect(result.statusCode).toBe(200);
  });
});
```

**Frontend (React Testing Library):**
```typescript
describe('RequestBuilder', () => {
  it('should render form fields', () => {
    render(<RequestBuilder />);
    expect(screen.getByPlaceholderText('Base URL')).toBeInTheDocument();
  });
});
```

---

## Code Quality

### Linting

```bash
# Check for issues
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Formatting

```bash
# Format all code
npm run format

# Format specific file
npx prettier --write src/file.ts
```

### Type Checking

```bash
# Check TypeScript errors
npx tsc --noEmit
```

---

## Debugging

### Backend Debugging

**Option 1: Console logs**
```typescript
console.log('Debug info:', variable);
```

**Option 2: Node debugger**
```bash
node --inspect-brk dist/server.js
# Open chrome://inspect in Chrome
```

### Frontend Debugging

**Option 1: Browser DevTools**
- F12 in browser
- Check Console, Network, Elements tabs

**Option 2: React DevTools**
- Install React DevTools extension
- Inspect component props and state

---

## Git Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/name` - New features
- `fix/name` - Bug fixes
- `docs/name` - Documentation updates

### Commit Messages

```
Feat: Add new validation rule type
Fix: Correct API response parsing
Docs: Update architecture guide
Chore: Update dependencies
```

---

## Environment Variables

### Backend (.env)

```env
PORT=3000
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_BASE=http://localhost:3000/api/postman
```

---

## Performance Tips

1. **Lazy load components** - Split code with React.lazy()
2. **Memoize expensive computations** - Use useMemo/useCallback
3. **Paginate large lists** - Don't render all at once
4. **Cache API responses** - Avoid duplicate requests
5. **Optimize bundle size** - Review dependencies regularly

---

## Security Best Practices

1. **Never commit secrets** - Use .env files
2. **Validate input** - Sanitize all user input
3. **Use HTTPS** - In production
4. **CORS configuration** - Only allow trusted origins
5. **Rate limiting** - Implement on sensitive endpoints
6. **Keep dependencies updated** - Regular npm audit

---

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy Backend

```bash
# Using Node directly
npm start

# Using PM2 (production process manager)
pm2 start dist/server.js --name "postman-gen"
```

### Deploy Frontend

```bash
# Built files in frontend/dist/
# Serve with a web server (nginx, Apache, etc.)
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Kill process: `lsof -ti:3000 \| xargs kill -9` |
| Module not found | Run: `npm run install-all` |
| TypeScript errors | Run: `npm run build` |
| Hot reload not working | Restart dev server |

---

## Resources

- [Node.js Docs](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)

---

See [ARCHITECTURE.md](ARCHITECTURE.md) for system design details.
