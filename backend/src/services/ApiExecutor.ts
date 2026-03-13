import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { ApiRequest, ApiResponse, ApiExecutionResult } from '../models/types';
import { tokenManager } from './TokenManager';

export class ApiExecutor {
  /**
   * Executes an API request and captures the response
   */
  async executeRequest(apiRequest: ApiRequest): Promise<ApiExecutionResult> {
    try {
      const startTime = Date.now();
      const url = this.buildUrl(apiRequest);
      const config = this.buildAxiosConfig(apiRequest);

      // Auto Bearer Token logic
      let envToken: string | undefined = undefined;
      if (apiRequest.authentication?.type === 'bearer') {
        // If token is provided, use it; else fetch using credentials
        if (apiRequest.authentication.token) {
          envToken = apiRequest.authentication.token;
        } else if (apiRequest.authentication.username && apiRequest.authentication.password) {
          envToken = await tokenManager.getToken(apiRequest.baseUrl, {
            email: apiRequest.authentication.username,
            password: apiRequest.authentication.password,
          });
        } else {
          envToken = await tokenManager.getToken(apiRequest.baseUrl);
        }
        if (envToken) {
          if (!config.headers) config.headers = {};
          (config.headers as Record<string, string>)['Authorization'] = `Bearer ${envToken}`;
          // Save token back to request for frontend display
          apiRequest.authentication.token = envToken;
        }
      }

      const response = await axios({
        method: apiRequest.method.toLowerCase(),
        url,
        ...config,
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const apiResponse: ApiResponse = {
        statusCode: response.status,
        headers: this.flattenHeaders(response.headers),
        body: response.data || {},
        responseTime,
        timestamp: new Date().toISOString(),
      };

      return {
        success: true,
        request: apiRequest,
        response: apiResponse,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      const endTime = Date.now();

      const apiResponse: ApiResponse = {
        statusCode: axiosError.response?.status || 0,
        headers: this.flattenHeaders(axiosError.response?.headers as Record<string, unknown>),
        body: (axiosError.response?.data as Record<string, unknown>) || {},
        responseTime: endTime - (Date.now() - 5000), // Approximate
        timestamp: new Date().toISOString(),
      };

      return {
        success: false,
        request: apiRequest,
        response: apiResponse,
        error: axiosError.message,
      };
    }
  }

  /**
   * Builds the full URL from request components
   */
  private buildUrl(apiRequest: ApiRequest): string {
    let url = apiRequest.baseUrl.endsWith('/') ? apiRequest.baseUrl.slice(0, -1) : apiRequest.baseUrl;
    
    // Add path
    const path = apiRequest.path.startsWith('/') ? apiRequest.path : `/${apiRequest.path}`;
    url += path;

    // Replace URI parameters
    if (apiRequest.uriParameters && apiRequest.uriParameters.length > 0) {
      apiRequest.uriParameters.forEach((param) => {
        url = url.replace(`{${param.name}}`, param.value).replace(`:${param.name}`, param.value);
      });
    }

    // Add query parameters
    if (apiRequest.queryParameters && apiRequest.queryParameters.length > 0) {
      const queryString = apiRequest.queryParameters
        .map((param) => `${encodeURIComponent(param.name)}=${encodeURIComponent(param.value)}`)
        .join('&');
      url += `?${queryString}`;
    }

    return url;
  }

  /**
   * Builds Axios configuration from request
   */
  private buildAxiosConfig(apiRequest: ApiRequest): AxiosRequestConfig {
    const config: AxiosRequestConfig = {
      headers: {},
      timeout: 30000,
      validateStatus: () => true, // Don't throw on any status
    };

    // Add headers
    if (apiRequest.headers && apiRequest.headers.length > 0) {
      apiRequest.headers.forEach((header) => {
        (config.headers as Record<string, string>)[header.name] = header.value;
      });
    }

    // Add authentication
    if (apiRequest.authentication) {
      switch (apiRequest.authentication.type) {
        case 'bearer':
          if (apiRequest.authentication.token) {
            (config.headers as Record<string, string>)['Authorization'] = `Bearer ${apiRequest.authentication.token}`;
          }
          break;
        case 'basic':
          if (apiRequest.authentication.username && apiRequest.authentication.password) {
            const credentials = Buffer.from(`${apiRequest.authentication.username}:${apiRequest.authentication.password}`).toString('base64');
            (config.headers as Record<string, string>)['Authorization'] = `Basic ${credentials}`;
          }
          break;
      }
    }

    // Add request body
    if (apiRequest.requestBody && ['POST', 'PUT', 'PATCH'].includes(apiRequest.method)) {
      config.data = apiRequest.requestBody;
      (config.headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    return config;
  }

  /**
   * Flattens axios headers object to simple key-value pairs
   */
  private flattenHeaders(headers: Record<string, unknown> | undefined): Record<string, string> {
    if (!headers) return {};
    
    const flattened: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      flattened[key] = String(value);
    }
    return flattened;
  }

  /**
   * Extracts response field keys and types
   */
  getResponseFieldsInfo(response: Record<string, unknown>): Array<{
    key: string;
    type: string;
    value: unknown;
    isArray: boolean;
    isObject: boolean;
  }> {
    return Object.entries(response).map(([key, value]) => ({
      key,
      type: typeof value,
      value,
      isArray: Array.isArray(value),
      isObject: typeof value === 'object' && value !== null && !Array.isArray(value),
    }));
  }
}

export default new ApiExecutor();
