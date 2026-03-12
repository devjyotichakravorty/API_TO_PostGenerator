import express from 'express';
import cors from 'cors';
import postmanRoutes from './routes/postmanRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/postman', postmanRoutes);

// Basic health check
app.get('/', (_req: express.Request, res: express.Response) => {
  res.json({
    message: 'API to Postman Script Generator API',
    version: '1.0.0',
    endpoints: {
      health: '/api/postman/health',
      generateScript: 'POST /api/postman/generate-script',
      generateCollection: 'POST /api/postman/generate-collection',
      appendToCollection: 'POST /api/postman/append-to-collection',
    },
  });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.info(`✓ Server running on http://localhost:${PORT}`);
  console.info(`✓ Frontend should run on http://localhost:5173`);
  console.info(`✓ API endpoint: http://localhost:${PORT}/api/postman`);
});

export default app;
