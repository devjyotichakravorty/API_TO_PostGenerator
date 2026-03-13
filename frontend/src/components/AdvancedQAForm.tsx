import React, { useState } from 'react';
import { RequestBuilder } from './RequestBuilder';
import { ResponseInspector } from './ResponseInspector';
import { ValidationSelector } from './ValidationSelector';
import { ScriptPreview } from './ScriptPreview';
import { SwaggerImporter } from './SwaggerImporter';
import {
  ApiRequest,
  ApiResponse,
  ResponseField,
  ValidationConfig,
  TestScriptResult,
  SwaggerEndpoint,
  SwaggerInfo,
} from '../types';
import '../styles/components.css';

interface WorkflowState {
  step: 'builder' | 'import' | 'response' | 'validation' | 'preview';
  apiRequest?: ApiRequest;
  apiResponse?: ApiResponse;
  responseFields: ResponseField[];
  validationConfig: ValidationConfig;
  testScript?: TestScriptResult;
  swaggerInfo?: SwaggerInfo;
}

export const AdvancedQAForm: React.FC = () => {
  const [workflow, setWorkflow] = useState<WorkflowState>({
    step: 'builder',
    responseFields: [],
    validationConfig: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Handle API request execution
  const handleExecuteApi = async (request: ApiRequest) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/postman/execute-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error('Failed to execute API');
      const data = await response.json();
      const apiResponse = data.result.response;

      // Extract response fields
      const fieldsResponse = await fetch('http://localhost:3000/api/postman/get-response-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: apiResponse.body }),
      });

      const fieldsData = await fieldsResponse.json();

      setWorkflow((prev) => ({
        ...prev,
        step: 'response',
        apiRequest: request,
        apiResponse,
        responseFields: fieldsData.fields,
        validationConfig: fieldsData.fields.reduce((acc: ValidationConfig, field: ResponseField) => {
          acc[field.key] = { rule: 'exists_not_empty' };
          return acc;
        }, {}),
      }));

      setSuccessMessage('API executed successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute API');
    } finally {
      setLoading(false);
    }
  };

  // Handle validation rule changes
  const handleValidationChange = (config: ValidationConfig) => {
    setWorkflow((prev) => ({
      ...prev,
      validationConfig: config,
    }));
  };

  // Handle test generation
  const handleGenerateTests = async (config: ValidationConfig) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/postman/generate-tests-with-validation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: workflow.apiResponse,
          validationConfig: config,
          expectedStatusCode: workflow.apiResponse?.statusCode,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate tests');
      const data = await response.json();

      setWorkflow((prev) => ({
        ...prev,
        step: 'preview',
        testScript: data.result,
        validationConfig: config,
      }));

      setSuccessMessage('Test script generated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate tests');
    } finally {
      setLoading(false);
    }
  };

  // Handle Swagger endpoint selection
  const handleSwaggerEndpoint = (endpoint: SwaggerEndpoint, request: ApiRequest) => {
    setWorkflow((prev) => ({
      ...prev,
      step: 'builder',
      apiRequest: request,
    }));
    setSuccessMessage(`Loaded endpoint: ${endpoint.method} ${endpoint.path}`);
  };

  // Handle Swagger loaded
  const handleSwaggerLoaded = (swaggerInfo: SwaggerInfo) => {
    setWorkflow((prev) => ({
      ...prev,
      swaggerInfo,
    }));
  };

  // Copy script to clipboard
  const handleCopyScript = () => {
    if (workflow.testScript?.fullScript) {
      navigator.clipboard.writeText(workflow.testScript.fullScript);
      setSuccessMessage('Script copied to clipboard!');
    }
  };

  // Export as Postman collection
  const handleExportCollection = async () => {
    if (!workflow.testScript) return;

    try {
      const collectionName = `Test Collection - ${new Date().toISOString().split('T')[0]}`;
      const collection = {
        info: {
          name: collectionName,
          description: 'Generated Postman collection with validation tests',
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        },
        item: [
          {
            name: `${workflow.apiRequest?.method} ${workflow.apiRequest?.path || ''}`,
            request: {
              method: workflow.apiRequest?.method || 'GET',
              url: {
                raw: `${workflow.apiRequest?.baseUrl || 'https://api.example.com'}${workflow.apiRequest?.path || ''}`,
              },
              body: workflow.apiRequest?.requestBody
                ? {
                    mode: 'raw',
                    raw: JSON.stringify(workflow.apiRequest.requestBody, null, 2),
                  }
                : undefined,
            },
            event: [
              {
                listen: 'test',
                script: {
                  type: 'text/javascript',
                  exec: workflow.testScript.fullScript.split('\n'),
                },
              },
            ],
          },
        ],
      };

      const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${collectionName}.postman_collection.json`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccessMessage('Collection exported!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export collection');
    }
  };

  // Reset workflow
  const handleReset = () => {
    setWorkflow({
      step: 'builder',
      responseFields: [],
      validationConfig: {},
    });
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="advanced-qa-form">
      {/* Tab Navigation */}
      <div className="workflow-tabs">
        <button
          className={`tab ${workflow.step === 'builder' ? 'active' : ''} ${workflow.step === 'import' ? 'alt' : ''}`}
          onClick={() => setWorkflow((prev) => ({ ...prev, step: 'builder' }))}
        >
          API Request Builder
        </button>
        <button
          className={`tab ${workflow.step === 'import' ? 'active' : ''}`}
          onClick={() => setWorkflow((prev) => ({ ...prev, step: 'import' }))}
        >
          Swagger Import
        </button>
        {workflow.apiResponse && (
          <>
            <button
              className={`tab ${workflow.step === 'response' ? 'active' : ''}`}
              onClick={() => setWorkflow((prev) => ({ ...prev, step: 'response' }))}
            >
              Response Inspector
            </button>
            <button
              className={`tab ${workflow.step === 'validation' ? 'active' : ''}`}
              onClick={() => setWorkflow((prev) => ({ ...prev, step: 'validation' }))}
            >
              Validation Rules
            </button>
            {workflow.testScript && (
              <button
                className={`tab ${workflow.step === 'preview' ? 'active' : ''}`}
                onClick={() => setWorkflow((prev) => ({ ...prev, step: 'preview' }))}
              >
                Test Preview
              </button>
            )}
          </>
        )}
      </div>

      {/* Messages */}
      {error && <div className="error-banner">{error}</div>}
      {successMessage && (
        <div className="success-banner">{successMessage}</div>
      )}

      {/* Content */}
      <div className="workflow-content">
        {workflow.step === 'builder' && (
          <RequestBuilder
            onRequestChange={() => setError('')}
            onExecute={handleExecuteApi}
            loading={loading}
            initialRequest={workflow.apiRequest}
          />
        )}

        {workflow.step === 'import' && (
          <SwaggerImporter
            onSwaggerLoaded={handleSwaggerLoaded}
            onEndpointSelected={handleSwaggerEndpoint}
          />
        )}

        {workflow.step === 'response' && (
          <ResponseInspector
            response={workflow.apiResponse}
            error={error}
            onFieldsExtracted={(fields) => {
              setWorkflow((prev) => ({ ...prev, responseFields: fields }));
            }}
          />
        )}

        {workflow.step === 'validation' && workflow.responseFields.length > 0 && (
          <ValidationSelector
            fields={workflow.responseFields}
            onValidationChange={handleValidationChange}
            onGenerateTests={handleGenerateTests}
          />
        )}

        {workflow.step === 'preview' && workflow.testScript && (
          <div className="test-preview-container">
            <ScriptPreview
              script={workflow.testScript.fullScript}
            />
            <div className="preview-actions">
              <button className="btn-primary" onClick={handleCopyScript}>
                📋 Copy Script
              </button>
              <button className="btn-primary" onClick={handleExportCollection}>
                📤 Export Collection
              </button>
              <button className="btn-secondary" onClick={handleReset}>
                🔄 Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedQAForm;
