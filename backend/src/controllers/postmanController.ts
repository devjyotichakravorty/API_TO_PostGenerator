import { Request, Response } from 'express';
import { PostmanScriptGenerator } from '../services/PostmanScriptGenerator';
import { ApiExecutor } from '../services/ApiExecutor';
import { SwaggerParser } from '../services/SwaggerParser';
import { ApiDefinition, ApiRequest } from '../models/types';

const generator = new PostmanScriptGenerator();
const apiExecutor = new ApiExecutor();
const swaggerParser = new SwaggerParser();

export const generateScript = (req: Request, res: Response): void => {
  try {
    const apiDefinition: ApiDefinition = req.body;

    // Validate required fields
    if (!apiDefinition.method || !apiDefinition.baseUrl || !apiDefinition.path) {
      res.status(400).json({
        error: 'Missing required fields: method, baseUrl, path',
      });
      return;
    }

    const script = generator.generateTests(apiDefinition);

    res.json({
      success: true,
      script,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate script',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const generateCollection = (req: Request, res: Response): void => {
  try {
    const { collectionName, baseUrl, apiDefinition } = req.body;

    if (!collectionName || !apiDefinition) {
      res.status(400).json({
        error: 'Missing required fields: collectionName, apiDefinition',
      });
      return;
    }

    const collection = generator.generatePostmanCollection(collectionName, baseUrl || '', apiDefinition, true);

    res.json({
      success: true,
      collection,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate collection',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const appendToCollection = (req: Request, res: Response): void => {
  try {
    const { collection, apiDefinition } = req.body;

    if (!collection || !apiDefinition) {
      res.status(400).json({
        error: 'Missing required fields: collection, apiDefinition',
      });
      return;
    }

    const updatedCollection = generator.appendToCollection(collection, apiDefinition);

    res.json({
      success: true,
      collection: updatedCollection,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to append to collection',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Execute API request and return response
 */
export const executeApi = async (req: Request, res: Response): Promise<void> => {
  try {
    const apiRequest: ApiRequest = req.body;

    if (!apiRequest.method || !apiRequest.baseUrl) {
      res.status(400).json({
        error: 'Missing required fields: method, baseUrl',
      });
      return;
    }

    const result = await apiExecutor.executeRequest(apiRequest);

    res.json({
      success: result.success,
      result,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to execute API request',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Generate test scripts from API response with validation rules
 */
export const generateTestsWithValidation = (req: Request, res: Response): void => {
  try {
    const { response, validationConfig, expectedStatusCode } = req.body;

    if (!response || !validationConfig) {
      res.status(400).json({
        error: 'Missing required fields: response, validationConfig',
      });
      return;
    }

    const result = generator.generateTestsFromValidation(response, validationConfig, expectedStatusCode);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to generate tests with validation',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Import and parse Swagger/OpenAPI specification
 */
export const importSwagger = (req: Request, res: Response): void => {
  try {
    const { swaggerSpec } = req.body;

    if (!swaggerSpec) {
      res.status(400).json({
        error: 'Missing required field: swaggerSpec',
      });
      return;
    }

    // Validate Swagger spec
    const validation = swaggerParser.validateSwagger(swaggerSpec);
    if (!validation.valid) {
      res.status(400).json({
        error: 'Invalid Swagger specification',
        validationErrors: validation.errors,
      });
      return;
    }

    const swaggerInfo = swaggerParser.parseSwagger(swaggerSpec);

    res.json({
      success: true,
      swaggerInfo,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to import Swagger specification',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Convert Swagger endpoint to API request
 */
export const convertSwaggerEndpoint = (req: Request, res: Response): void => {
  try {
    const { endpoint, baseUrl } = req.body;

    if (!endpoint || !baseUrl) {
      res.status(400).json({
        error: 'Missing required fields: endpoint, baseUrl',
      });
      return;
    }

    const apiRequest = swaggerParser.convertEndpointToRequest(endpoint, baseUrl);

    res.json({
      success: true,
      request: apiRequest,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to convert Swagger endpoint',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Extract response field information
 */
export const getResponseFields = (req: Request, res: Response): void => {
  try {
    const { response } = req.body;

    if (!response) {
      res.status(400).json({
        error: 'Missing required field: response',
      });
      return;
    }

    const fieldsInfo = apiExecutor.getResponseFieldsInfo(response);

    res.json({
      success: true,
      fields: fieldsInfo,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to extract response fields',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const health = (_req: Request, res: Response): void => {
  res.json({
    status: 'OK',
    service: 'API to Postman Script Generator',
    timestamp: new Date().toISOString(),
  });
};
