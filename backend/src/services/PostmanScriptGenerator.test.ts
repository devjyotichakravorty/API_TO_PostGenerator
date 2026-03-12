import { PostmanScriptGenerator } from '../services/PostmanScriptGenerator';
import { ApiDefinition } from '../models/types';

describe('PostmanScriptGenerator', () => {
  let generator: PostmanScriptGenerator;

  beforeEach(() => {
    generator = new PostmanScriptGenerator();
  });

  describe('generateTests', () => {
    it('should generate status code test', () => {
      const apiDefinition: ApiDefinition = {
        method: 'GET',
        baseUrl: 'https://api.example.com',
        path: '/users',
        uriParameters: [],
        queryParameters: [],
        headers: [],
        expectedStatusCode: 200,
        expectedResponseFields: [],
        responseTimeThreshold: 500,
      };

      const script = generator.generateTests(apiDefinition);
      expect(script).toContain('pm.test("Status code is 200"');
      expect(script).toContain('pm.response.to.have.status(200)');
    });

    it('should generate response time test', () => {
      const apiDefinition: ApiDefinition = {
        method: 'GET',
        baseUrl: 'https://api.example.com',
        path: '/users',
        uriParameters: [],
        queryParameters: [],
        headers: [],
        expectedStatusCode: 200,
        expectedResponseFields: [],
        responseTimeThreshold: 1000,
      };

      const script = generator.generateTests(apiDefinition);
      expect(script).toContain('pm.test("Response time is below 1000ms"');
      expect(script).toContain('pm.expect(pm.response.responseTime).to.be.below(1000)');
    });

    it('should generate response field tests', () => {
      const apiDefinition: ApiDefinition = {
        method: 'GET',
        baseUrl: 'https://api.example.com',
        path: '/users/123',
        uriParameters: [],
        queryParameters: [],
        headers: [],
        expectedStatusCode: 200,
        expectedResponseFields: ['id', 'name', 'email'],
        responseTimeThreshold: 500,
      };

      const script = generator.generateTests(apiDefinition);
      expect(script).toContain('var jsonData = pm.response.json()');
      expect(script).toContain('pm.test("Response contains id"');
      expect(script).toContain('pm.test("Response contains name"');
      expect(script).toContain('pm.test("Response contains email"');
    });
  });

  describe('generatePostmanCollection', () => {
    it('should generate valid Postman collection', () => {
      const apiDefinition: ApiDefinition = {
        method: 'POST',
        baseUrl: 'https://api.example.com',
        path: '/users',
        uriParameters: [],
        queryParameters: [{ name: 'limit', value: '10' }],
        headers: [{ name: 'Content-Type', value: 'application/json' }],
        requestBody: { name: 'John Doe', email: 'john@example.com' },
        expectedStatusCode: 201,
        expectedResponseFields: ['id', 'name'],
        responseTimeThreshold: 500,
        description: 'Create User API',
      };

      const collection = generator.generatePostmanCollection('Test Collection', '', apiDefinition);

      expect(collection.info.name).toBe('Test Collection');
      expect(collection.item.length).toBe(1);
      expect(collection.item[0].name).toBe('Create User API');
      expect(collection.item[0].request.method).toBe('POST');
      expect(collection.variable).toBeDefined();
    });

    it('should include variables in collection', () => {
      const apiDefinition: ApiDefinition = {
        method: 'GET',
        baseUrl: 'https://api.example.com',
        path: '/users',
        uriParameters: [],
        queryParameters: [],
        headers: [],
        expectedStatusCode: 200,
        expectedResponseFields: [],
        responseTimeThreshold: 500,
      };

      const collection = generator.generatePostmanCollection('Test', '', apiDefinition, true);

      expect(collection.variable).toBeDefined();
      expect(collection.variable?.[0].key).toBe('base_url');
      expect(collection.variable?.[1].key).toBe('auth_token');
    });
  });

  describe('appendToCollection', () => {
    it('should append new item to collection', () => {
      const existingCollection = {
        info: { name: 'Test', description: 'Test', schema: 'schema' },
        item: [],
        variable: [],
      };

      const apiDefinition: ApiDefinition = {
        method: 'GET',
        baseUrl: 'https://api.example.com',
        path: '/users',
        uriParameters: [],
        queryParameters: [],
        headers: [],
        expectedStatusCode: 200,
        expectedResponseFields: [],
        responseTimeThreshold: 500,
      };

      const updatedCollection = generator.appendToCollection(existingCollection, apiDefinition);

      expect(updatedCollection.item.length).toBe(1);
      expect(updatedCollection.item[0].request.method).toBe('GET');
    });

    it('should preserve existing items when appending', () => {
      const existingCollection = {
        info: { name: 'Test', description: 'Test', schema: 'schema' },
        item: [
          {
            name: 'Existing Item',
            request: { method: 'GET', url: {} },
            response: [],
          },
        ],
        variable: [],
      };

      const apiDefinition: ApiDefinition = {
        method: 'POST',
        baseUrl: 'https://api.example.com',
        path: '/users',
        uriParameters: [],
        queryParameters: [],
        headers: [],
        expectedStatusCode: 201,
        expectedResponseFields: [],
        responseTimeThreshold: 500,
      };

      const updatedCollection = generator.appendToCollection(existingCollection, apiDefinition);

      expect(updatedCollection.item.length).toBe(2);
      expect(updatedCollection.item[0].name).toBe('Existing Item');
      expect(updatedCollection.item[1].request.method).toBe('POST');
    });
  });
});
