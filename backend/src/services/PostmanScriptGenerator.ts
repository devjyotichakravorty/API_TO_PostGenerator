import { ApiDefinition, PostmanCollection, PostmanItem, ApiResponse, ValidationConfig, TestScriptResult } from '../models/types';
import ValidationRuleGenerator from './ValidationRuleGenerator';

export class PostmanScriptGenerator {
  /**
   * Generate Postman test scripts from API definition
   */
  generateTests(apiDefinition: ApiDefinition): string {
    const tests: string[] = [];

    // Status code test
    tests.push(this.generateStatusCodeTest(apiDefinition.expectedStatusCode));

    // Response time test
    tests.push(this.generateResponseTimeTest(apiDefinition.responseTimeThreshold));

    // Expected response fields tests
    if (apiDefinition.expectedResponseFields.length > 0) {
      tests.push(...this.generateResponseFieldTests(apiDefinition.expectedResponseFields));
    }

    return tests.join('\n\n');
  }

  /**
   * Generate status code validation test
   */
  private generateStatusCodeTest(statusCode: number): string {
    return `pm.test("Status code is ${statusCode}", function () {
    pm.response.to.have.status(${statusCode});
});`;
  }

  /**
   * Generate response time validation test
   */
  private generateResponseTimeTest(threshold: number): string {
    return `pm.test("Response time is below ${threshold}ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(${threshold});
});`;
  }

  /**
   * Generate tests for expected response fields
   */
  private generateResponseFieldTests(fields: string[]): string[] {
    const tests: string[] = [];

    tests.push('var jsonData = pm.response.json();\n');

    fields.forEach((field) => {
      const fieldName = field.trim();
      const escapedField = fieldName.replace(/"/g, '\\"');

      tests.push(`pm.test("Response contains ${escapedField}", function () {
    pm.expect(jsonData).to.have.property("${fieldName}");
});`);
    });

    return tests;
  }

  /**
   * Generate complete Postman collection JSON
   */
  generatePostmanCollection(
    name: string,
    baseUrl: string,
    apiDefinition: ApiDefinition,
    includeVariables: boolean = true
  ): PostmanCollection {
    const url = this.buildUrl(apiDefinition.baseUrl || baseUrl, apiDefinition);
    const headers = this.buildHeaders(apiDefinition.headers);

    const postmanItem: PostmanItem = {
      name: apiDefinition.description || `${apiDefinition.method} ${apiDefinition.path}`,
      request: {
        method: apiDefinition.method,
        url: {
          raw: url,
          protocol: this.extractProtocol(apiDefinition.baseUrl || baseUrl),
          host: this.extractHost(apiDefinition.baseUrl || baseUrl),
          path: this.extractPath(apiDefinition.path),
          query: this.buildQueryParams(apiDefinition.queryParameters),
        },
        header: headers.length > 0 ? headers : undefined,
        body: apiDefinition.requestBody
          ? {
              mode: 'raw',
              raw: JSON.stringify(apiDefinition.requestBody, null, 2),
            }
          : undefined,
      },
      response: [],
      event: [
        {
          listen: 'test',
          script: {
            type: 'text/javascript',
            exec: this.generateTests(apiDefinition).split('\n'),
          },
        },
      ],
    };

    const collection: PostmanCollection = {
      info: {
        name,
        description: `API Test Collection for ${name}`,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      item: [postmanItem],
    };

    if (includeVariables) {
      collection.variable = [
        {
          key: 'base_url',
          value: apiDefinition.baseUrl || baseUrl,
        },
        {
          key: 'auth_token',
          value: '',
        },
      ];
    }

    return collection;
  }

  /**
   * Append API definition to existing Postman collection
   */
  appendToCollection(collection: PostmanCollection, apiDefinition: ApiDefinition): PostmanCollection {
    const newItem: PostmanItem = {
      name: apiDefinition.description || `${apiDefinition.method} ${apiDefinition.path}`,
      request: {
        method: apiDefinition.method,
        url: {
          raw: this.buildUrl('{{base_url}}', apiDefinition),
          protocol: 'https',
          host: ['{{base_url}}'],
          path: this.extractPath(apiDefinition.path),
          query: this.buildQueryParams(apiDefinition.queryParameters),
        },
        header: this.buildHeaders(apiDefinition.headers),
        body: apiDefinition.requestBody
          ? {
              mode: 'raw',
              raw: JSON.stringify(apiDefinition.requestBody, null, 2),
            }
          : undefined,
      },
      response: [],
      event: [
        {
          listen: 'test',
          script: {
            type: 'text/javascript',
            exec: this.generateTests(apiDefinition).split('\n'),
          },
        },
      ],
    };

    return {
      ...collection,
      item: [...collection.item, newItem],
    };
  }

  /**
   * Build complete URL
   */
  private buildUrl(baseUrl: string, apiDefinition: ApiDefinition): string {
    let url = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    url += apiDefinition.path;

    // Replace URI parameters
    apiDefinition.uriParameters.forEach((param) => {
      url = url.replace(`{${param.name}}`, param.value);
    });

    // Add query parameters
    const queryParams = this.buildQueryString(apiDefinition.queryParameters);
    if (queryParams) {
      url += `?${queryParams}`;
    }

    return url;
  }

  /**
   * Build query string from parameters
   */
  private buildQueryString(params: Array<{ name: string; value: string }>): string {
    return params.map((param) => `${encodeURIComponent(param.name)}=${encodeURIComponent(param.value)}`).join('&');
  }

  /**
   * Build query parameter array for Postman
   */
  private buildQueryParams(
    params: Array<{ name: string; value: string }>
  ): Array<{ key: string; value: string }> {
    return params.map((param) => ({
      key: param.name,
      value: param.value,
    }));
  }

  /**
   * Build headers array
   */
  private buildHeaders(headers: Array<{ name: string; value: string }>): Array<{ key: string; value: string }> {
    return headers.map((header) => ({
      key: header.name,
      value: header.value,
    }));
  }

  /**
   * Extract protocol from URL
   */
  private extractProtocol(url: string): string {
    const match = url.match(/^(https?):\/\//);
    return match ? match[1] : 'https';
  }

  /**
   * Extract host from URL
   */
  private extractHost(url: string): string[] {
    const cleanUrl = url.replace(/^https?:\/\//, '').split('/')[0];
    return cleanUrl.split('.');
  }

  /**
   * Generate Postman test scripts from API response and validation configuration
   */
  generateTestsFromValidation(response: ApiResponse, validationConfig: ValidationConfig, expectedStatusCode?: number): TestScriptResult {
    const tests: string[] = [];

    // Status code test
    const statusCodeTest = this.generateStatusCodeTest(expectedStatusCode || response.statusCode);
    tests.push(statusCodeTest);

    // Response time test
    tests.push(this.generateResponseTimeTest(5000));

    // Parse response and generate field tests
    tests.push('var jsonData = pm.response.json();\n');

    const fieldTests: string[] = [];
    for (const [fieldName, rule] of Object.entries(validationConfig)) {
      if (rule.rule !== 'skip') {
        const testScript = ValidationRuleGenerator.generateTestScript(fieldName, rule);
        if (testScript) {
          tests.push(testScript);
          fieldTests.push(testScript);
        }
      }
    }

    return {
      statusCodeTest,
      responseTimeTest: this.generateResponseTimeTest(5000),
      fieldTests,
      fullScript: tests.join('\n\n'),
    };
  }

  /**
   * Extract path from endpoint
   */
  private extractPath(endpoint: string): string[] {
    return endpoint
      .split('/')
      .filter((part) => part.length > 0)
      .map((part) => part.replace(/{([^}]+)}/g, ':$1'));
  }
}
