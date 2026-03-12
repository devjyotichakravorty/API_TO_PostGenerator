export interface ApiParameter {
  name: string;
  value: string;
  description?: string;
}

export interface ApiDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  baseUrl: string;
  path: string;
  uriParameters: ApiParameter[];
  queryParameters: ApiParameter[];
  headers: ApiParameter[];
  requestBody?: string;
  expectedStatusCode: number;
  expectedResponseFields: string[];
  responseTimeThreshold: number;
  description?: string;
}

// Advanced QA Workflow Types

export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  baseUrl: string;
  path: string;
  uriParameters?: ApiParameter[];
  queryParameters?: ApiParameter[];
  headers?: ApiParameter[];
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

export interface ResponseField {
  key: string;
  type: string;
  value: unknown;
  isArray: boolean;
  isObject: boolean;
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
