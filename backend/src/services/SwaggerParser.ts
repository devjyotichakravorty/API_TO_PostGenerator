import { SwaggerInfo, SwaggerEndpoint, ApiRequest } from '../models/types';

export class SwaggerParser {
  /**
   * Parse OpenAPI/Swagger specification
   */
  parseSwagger(swaggerSpec: Record<string, unknown>): SwaggerInfo {
    const info = swaggerSpec.info as Record<string, unknown>;
    const paths = swaggerSpec.paths as Record<string, Record<string, unknown>>;

    const endpoints: SwaggerEndpoint[] = [];

    if (paths) {
      for (const [pathName, pathSpec] of Object.entries(paths)) {
        for (const [method, methodSpec] of Object.entries(pathSpec)) {
          if (['get', 'post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
            const endpoint = this.parseEndpoint(pathName, method, methodSpec as Record<string, unknown>);
            endpoints.push(endpoint);
          }
        }
      }
    }

    return {
      title: (info?.title as string) || 'Unknown API',
      version: (info?.version as string) || '1.0.0',
      description: (info?.description as string) || '',
      endpoints,
    };
  }

  /**
   * Parse a single endpoint from Swagger spec
   */
  private parseEndpoint(path: string, method: string, methodSpec: Record<string, unknown>): SwaggerEndpoint {
    const parameters = methodSpec.parameters as Array<Record<string, unknown>> | undefined;
    const requestBody = methodSpec.requestBody as Record<string, unknown> | undefined;
    const responses = methodSpec.responses as Record<string, unknown> | undefined;
    const summary = methodSpec.summary as string | undefined;
    const description = methodSpec.description as string | undefined;

    const endpointParameters = parameters
      ? parameters.map((param) => ({
          name: (param.name as string) || '',
          in: (param.in as string) || 'query',
          required: (param.required as boolean) || false,
          schema: param.schema as { type: string } | undefined,
          description: (param.description as string) || '',
        }))
      : undefined;

    // Extract example response
    let example: Record<string, unknown> | undefined;
    if (responses) {
      for (const [, response] of Object.entries(responses)) {
        const responseObj = response as Record<string, unknown>;
        const content = responseObj.content as Record<string, Record<string, unknown>> | undefined;
        if (content && content['application/json']) {
          const jsonContent = content['application/json'];
          if (jsonContent.example) {
            example = jsonContent.example as Record<string, unknown>;
          } else if (jsonContent.schema) {
            example = this.generateExampleFromSchema(jsonContent.schema as Record<string, unknown>);
          }
        }
      }
    }

    return {
      method: method.toUpperCase(),
      path,
      summary,
      description,
      parameters: endpointParameters,
      requestBody: requestBody as { required?: boolean; content: Record<string, unknown>; } | undefined,
      responses,
      example,
    };
  }

  /**
   * Convert Swagger endpoint to API request
   */
  convertEndpointToRequest(
    endpoint: SwaggerEndpoint,
    baseUrl: string,
    overrides?: Partial<ApiRequest>,
  ): ApiRequest {
    const request: ApiRequest = {
      method: endpoint.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
      baseUrl,
      path: endpoint.path,
      headers: [],
      queryParameters: [],
      uriParameters: [],
      authentication: { type: 'none' },
      ...overrides,
    };

    // Extract parameters by type
    if (endpoint.parameters) {
      for (const param of endpoint.parameters) {
        if (param.in === 'path') {
          request.uriParameters?.push({
            name: param.name,
            value: `{${param.name}}`, // Placeholder
            description: param.description,
          });
        } else if (param.in === 'query') {
          request.queryParameters?.push({
            name: param.name,
            value: '',
            description: param.description,
          });
        } else if (param.in === 'header') {
          request.headers?.push({
            name: param.name,
            value: '',
            description: param.description,
          });
        }
      }
    }

    // Add example request body
    if (endpoint.example && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
      request.requestBody = endpoint.example;
    }

    return request;
  }

  /**
   * Generate example data from JSON schema
   */
  private generateExampleFromSchema(schema: Record<string, unknown>): Record<string, unknown> {
    const example: Record<string, unknown> = {};

    if (schema.properties) {
      const properties = schema.properties as Record<string, Record<string, unknown>>;
      for (const [key, prop] of Object.entries(properties)) {
        example[key] = this.generateExampleValue(prop);
      }
    }

    return example;
  }

  /**
   * Generate example value based on schema type
   */
  private generateExampleValue(prop: Record<string, unknown>): unknown {
    const type = prop.type as string;
    const format = prop.format as string | undefined;

    if (prop.example) {
      return prop.example;
    }

    switch (type) {
      case 'string':
        if (format === 'date') return '2026-03-12';
        if (format === 'date-time') return '2026-03-12T10:00:00.000Z';
        if (format === 'email') return 'user@example.com';
        if (format === 'uuid') return '550e8400-e29b-41d4-a716-446655440000';
        return 'string';
      case 'integer':
        return 0;
      case 'number':
        return 0.0;
      case 'boolean':
        return true;
      case 'array':
        return [];
      case 'object':
        return {};
      default:
        return null;
    }
  }

  /**
   * Validate Swagger specification
   */
  validateSwagger(swaggerSpec: Record<string, unknown>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!swaggerSpec.swagger && !swaggerSpec.openapi) {
      errors.push('Missing "swagger" or "openapi" version field');
    }

    if (!swaggerSpec.info) {
      errors.push('Missing "info" object');
    }

    if (!swaggerSpec.paths) {
      errors.push('Missing "paths" object');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default new SwaggerParser();
