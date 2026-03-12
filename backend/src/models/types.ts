export interface ApiParameter {
  name: string;
  value: string;
  description?: string;
}

export interface ApiHeader extends ApiParameter {}

export interface ApiDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  baseUrl: string;
  path: string;
  uriParameters: ApiParameter[];
  queryParameters: ApiParameter[];
  headers: ApiHeader[];
  requestBody?: Record<string, unknown>;
  expectedStatusCode: number;
  expectedResponseFields: string[];
  responseTimeThreshold: number;
  description?: string;
}

export interface PostmanTest {
  name: string;
  script: string;
}

export interface PostmanRequest {
  method: string;
  url: {
    raw?: string;
    protocol?: string;
    host?: string[];
    path?: string[];
    query?: Array<{
      key: string;
      value: string;
    }>;
  };
  header?: Array<{
    key: string;
    value: string;
  }>;
  body?: {
    mode: string;
    raw: string;
  };
}

export interface PostmanItem {
  name: string;
  request: PostmanRequest;
  response: Record<string, unknown>[];
  event?: Array<{
    listen: string;
    script: {
      type: string;
      exec: string[];
    };
  }>;
}

export interface PostmanCollection {
  info: {
    name: string;
    description: string;
    schema: string;
  };
  item: PostmanItem[];
  variable?: Array<{
    key: string;
    value: string;
  }>;
}

// Advanced QA Workflow Types

export type ValidationRuleType =
  | 'exact'
  | 'exists'
  | 'exists_not_empty'
  | 'valid_string'
  | 'valid_number'
  | 'valid_boolean'
  | 'valid_date'
  | 'valid_email'
  | 'valid_uuid'
  | 'regex'
  | 'array_length'
  | 'contains_value'
  | 'greater_than'
  | 'less_than'
  | 'range'
  | 'null_check'
  | 'skip';

export interface ValidationRule {
  rule: ValidationRuleType;
  value?: unknown;
  minValue?: number;
  maxValue?: number;
  regex?: string;
  arrayLength?: number;
  message?: string;
}

export interface ValidationConfig {
  [key: string]: ValidationRule;
}

export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  baseUrl: string;
  path: string;
  uriParameters?: ApiParameter[];
  queryParameters?: ApiParameter[];
  headers?: ApiHeader[];
  authentication?: {
    type: 'bearer' | 'basic' | 'oauth2' | 'none';
    token?: string;
    username?: string;
    password?: string;
  };
  requestBody?: Record<string, unknown>;
}

export interface ApiResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  responseTime: number;
  timestamp: string;
}

export interface ApiExecutionResult {
  success: boolean;
  request: ApiRequest;
  response: ApiResponse;
  error?: string;
}

export interface SwaggerEndpoint {
  method: string;
  path: string;
  summary?: string;
  description?: string;
  parameters?: Array<{
    name: string;
    in: string;
    required?: boolean;
    schema?: { type: string };
    description?: string;
  }>;
  requestBody?: {
    required?: boolean;
    content: Record<string, unknown>;
  };
  responses?: Record<string, unknown>;
  example?: Record<string, unknown>;
}

export interface SwaggerInfo {
  title: string;
  version: string;
  description?: string;
  endpoints: SwaggerEndpoint[];
}

export interface TestScriptResult {
  statusCodeTest: string;
  responseTimeTest: string;
  fieldTests: string[];
  fullScript: string;
}
