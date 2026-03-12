import React, { useState } from 'react';
import { ApiDefinition, ApiParameter } from '../types';
import { ParameterEditor } from './ParameterEditor';
import { ScriptPreview } from './ScriptPreview';
import { apiService } from '../services/api';
import './ApiForm.css';

const INITIAL_API_DEFINITION: ApiDefinition = {
  method: 'GET',
  baseUrl: 'https://api.example.com',
  path: '/users',
  uriParameters: [],
  queryParameters: [],
  headers: [],
  expectedStatusCode: 200,
  expectedResponseFields: [],
  responseTimeThreshold: 500,
  description: '',
};

export const ApiForm: React.FC = () => {
  const [apiDef, setApiDef] = useState<ApiDefinition>(INITIAL_API_DEFINITION);
  const [script, setScript] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [collectionName, setCollectionName] = useState('My API Collection');
  const [responseFields, setResponseFields] = useState('');
  const [requestBodyJson, setRequestBodyJson] = useState('');

  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const payload = {
        ...apiDef,
        requestBody: requestBodyJson ? requestBodyJson : undefined,
      };
      const generatedScript = await apiService.generateScript(payload);
      setScript(generatedScript);
      setSuccessMessage('Script generated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate script');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCollection = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const payload = {
        ...apiDef,
        requestBody: requestBodyJson ? requestBodyJson : undefined,
      };
      const collection = await apiService.generateCollection(collectionName, apiDef.baseUrl, payload);
      apiService.downloadCollection(collection, `${collectionName}.postman_collection.json`);
      setSuccessMessage('Collection exported successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate collection');
    } finally {
      setLoading(false);
    }
  };

  const updateApiDef = (field: keyof ApiDefinition, value: unknown) => {
    setApiDef((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addParameter = (paramType: 'uriParameters' | 'queryParameters' | 'headers') => {
    setApiDef((prev) => ({
      ...prev,
      [paramType]: [...prev[paramType], { name: '', value: '' }],
    }));
  };

  const deleteParameter = (paramType: 'uriParameters' | 'queryParameters' | 'headers', index: number) => {
    setApiDef((prev) => ({
      ...prev,
      [paramType]: prev[paramType].filter((_, i) => i !== index),
    }));
  };

  const updateParameter = (
    paramType: 'uriParameters' | 'queryParameters' | 'headers',
    index: number,
    field: keyof ApiParameter,
    value: string
  ) => {
    setApiDef((prev) => ({
      ...prev,
      [paramType]: prev[paramType].map((param, i) =>
        i === index ? { ...param, [field]: value } : param
      ),
    }));
  };

  const handleResponseFieldsChange = (value: string) => {
    setResponseFields(value);
    const fields = value
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
    updateApiDef('expectedResponseFields', fields);
  };

  const handleReset = () => {
    setApiDef(INITIAL_API_DEFINITION);
    setScript('');
    setError('');
    setSuccessMessage('');
    setCollectionName('My API Collection');
    setResponseFields('');
    setRequestBodyJson('');
  };

  return (
    <div className="api-form-container">
      <div className="form-section">
        <h2>API Definition</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleGenerateScript}>
          {/* Basic API Info */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              placeholder="e.g., Get User by ID"
              value={apiDef.description || ''}
              onChange={(e) => updateApiDef('description', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="method">HTTP Method</label>
              <select
                id="method"
                value={apiDef.method}
                onChange={(e) => updateApiDef('method', e.target.value as ApiDefinition['method'])}
                className="form-input"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="baseUrl">Base URL</label>
              <input
                id="baseUrl"
                type="url"
                placeholder="https://api.example.com"
                value={apiDef.baseUrl}
                onChange={(e) => updateApiDef('baseUrl', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="path">Endpoint Path</label>
            <input
              id="path"
              type="text"
              placeholder="/users/{id}"
              value={apiDef.path}
              onChange={(e) => updateApiDef('path', e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Parameters */}
          <ParameterEditor
            parameters={apiDef.uriParameters}
            label="URI Parameters"
            onAdd={() => addParameter('uriParameters')}
            onDelete={(index) => deleteParameter('uriParameters', index)}
            onChange={(index, field, value) => updateParameter('uriParameters', index, field, value)}
          />

          <ParameterEditor
            parameters={apiDef.queryParameters}
            label="Query Parameters"
            onAdd={() => addParameter('queryParameters')}
            onDelete={(index) => deleteParameter('queryParameters', index)}
            onChange={(index, field, value) => updateParameter('queryParameters', index, field, value)}
          />

          <ParameterEditor
            parameters={apiDef.headers}
            label="Headers"
            onAdd={() => addParameter('headers')}
            onDelete={(index) => deleteParameter('headers', index)}
            onChange={(index, field, value) => updateParameter('headers', index, field, value)}
          />

          {/* Request Body */}
          <div className="form-group">
            <label htmlFor="requestBody">Request Body (JSON)</label>
            <textarea
              id="requestBody"
              placeholder='{ "name": "John", "email": "john@example.com" }'
              value={requestBodyJson}
              onChange={(e) => setRequestBodyJson(e.target.value)}
              className="form-textarea"
              rows={4}
            />
            <small className="form-hint">Optional. Enter valid JSON for POST/PUT/PATCH requests</small>
          </div>

          {/* Expected Response */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="statusCode">Expected Status Code</label>
              <input
                id="statusCode"
                type="number"
                min="100"
                max="599"
                placeholder="200"
                value={apiDef.expectedStatusCode}
                onChange={(e) => updateApiDef('expectedStatusCode', parseInt(e.target.value) || 200)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="responseTime">Response Time Threshold (ms)</label>
              <input
                id="responseTime"
                type="number"
                min="1"
                placeholder="500"
                value={apiDef.responseTimeThreshold}
                onChange={(e) => updateApiDef('responseTimeThreshold', parseInt(e.target.value) || 500)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="responseFields">Expected Response Fields</label>
            <input
              id="responseFields"
              type="text"
              placeholder="id, name, email"
              value={responseFields}
              onChange={(e) => handleResponseFieldsChange(e.target.value)}
              className="form-input"
            />
            <small className="form-hint">Comma-separated field names to validate in response</small>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating...' : '🚀 Generate Test Script'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={loading}>
              Reset Form
            </button>
          </div>
        </form>

        {/* Collection Export */}
        {script && (
          <div className="collection-export">
            <h3>Export Postman Collection</h3>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="collectionName">Collection Name</label>
                <input
                  id="collectionName"
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  className="form-input"
                />
              </div>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleGenerateCollection}
                disabled={loading}
                style={{ alignSelf: 'flex-end' }}
              >
                {loading ? 'Exporting...' : '📥 Export Collection'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="preview-section">
        <ScriptPreview script={script} loading={loading} error={error ? undefined : ''} />
      </div>
    </div>
  );
};
