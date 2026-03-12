import { Router } from 'express';
import * as postmanController from '../controllers/postmanController';

const router = Router();

// Original endpoints
router.post('/generate-script', postmanController.generateScript);
router.post('/generate-collection', postmanController.generateCollection);
router.post('/append-to-collection', postmanController.appendToCollection);

// Advanced QA Workflow endpoints
router.post('/execute-api', postmanController.executeApi);
router.post('/generate-tests-with-validation', postmanController.generateTestsWithValidation);
router.post('/import-swagger', postmanController.importSwagger);
router.post('/convert-swagger-endpoint', postmanController.convertSwaggerEndpoint);
router.post('/get-response-fields', postmanController.getResponseFields);

// Health check
router.get('/health', postmanController.health);

export default router;
