import React, { useState } from 'react';
import { ApiRequest, ApiParameter } from '../types';
import '../styles/components.css';

interface RequestBuilderProps {
  onRequestChange?: (request: ApiRequest) => void;
  onExecute?: (request: ApiRequest) => void;
  loading?: boolean;
}

interface RequestBuilderProps {
  onRequestChange?: (request: ApiRequest) => void;
  onExecute?: (request: ApiRequest) => void;
  loading?: boolean;
  initialRequest?: ApiRequest;
}

export const RequestBuilder: React.FC<RequestBuilderProps> = ({
  onRequestChange,
  onExecute,
  loading = false,
  initialRequest,
}) => {
  const [request, setRequest] = useState<ApiRequest>(
    initialRequest || {
      method: 'GET',
      baseUrl: 'https://reqres.in/api',
      path: '/users',
      uriParameters: [],
      queryParameters: [],
      headers: [{ name: 'Content-Type', value: 'application/json' }],
      authentication: { type: 'none' },
      requestBody: {},
    }
  );

  const [bodyJson, setBodyJson] = useState<string>(
    initialRequest && initialRequest.requestBody ? JSON.stringify(initialRequest.requestBody, null, 2) : '{}'
  );

  // Update state if initialRequest changes (e.g., when switching builder step)
  React.useEffect(() => {
    if (initialRequest) {
      setRequest(initialRequest);
      setBodyJson(initialRequest.requestBody ? JSON.stringify(initialRequest.requestBody, null, 2) : '{}');
    }
  }, [initialRequest]);

  const handleMethodChange = (method: ApiRequest['method']) => {
    const updated = { ...request, method };
    setRequest(updated);
    onRequestChange?.(updated);
  };

  const handleBaseUrlChange = (baseUrl: string) => {
    const updated = { ...request, baseUrl };
    setRequest(updated);
    onRequestChange?.(updated);
  };

  const handlePathChange = (path: string) => {
    const updated = { ...request, path };
    setRequest(updated);
    onRequestChange?.(updated);
  };

  const handleAuthChange = (
    field: 'type' | 'token' | 'username' | 'password',
    value: string
  ) => {
    let authentication: ApiRequest['authentication'] = {
      type: ((request.authentication?.type || 'none') as 'bearer' | 'basic' | 'oauth2' | 'none'),
      ...(request.authentication as Record<string, unknown>),
      [field]: value,
    };
    // If switching to bearer, clear token if user id/password are entered
    if (field === 'type' && value === 'bearer') {
      authentication = { type: 'bearer', username: '', password: '', token: '' };
    }
    const updated = { ...request, authentication };
    setRequest(updated);
    onRequestChange?.(updated);
  };

  const handleBodyChange = (body: string) => {
    setBodyJson(body);
    try {
      const updated = { ...request, requestBody: JSON.parse(body) };
      setRequest(updated);
      onRequestChange?.(updated);
    } catch {
      // Invalid JSON - keep as is for now
    }
  };

  const addParameter = (type: 'query' | 'header' | 'uri') => {
    const key = type === 'uri' ? 'uriParameters' : type === 'header' ? 'headers' : 'queryParameters';
    const updated = {
      ...request,
      [key]: [...(request[key as keyof ApiRequest] as ApiParameter[]), { name: '', value: '' }],
    };
    setRequest(updated);
    onRequestChange?.(updated);
  };

  const updateParameter = (
    type: 'query' | 'header' | 'uri',
    index: number,
    field: 'name' | 'value',
    value: string
  ) => {
    const key = type === 'uri' ? 'uriParameters' : type === 'header' ? 'headers' : 'queryParameters';
    const params = [...(request[key as keyof ApiRequest] as ApiParameter[])];
    params[index] = { ...params[index], [field]: value };
    const updated = { ...request, [key]: params };
    setRequest(updated);
    onRequestChange?.(updated);
  };

  const removeParameter = (type: 'query' | 'header' | 'uri', index: number) => {
    const key = type === 'uri' ? 'uriParameters' : type === 'header' ? 'headers' : 'queryParameters';
    const params = (request[key as keyof ApiRequest] as ApiParameter[]).filter((_, i) => i !== index);
    const updated = { ...request, [key]: params };
    setRequest(updated);
    onRequestChange?.(updated);
  };

  return (
    <div className="request-builder">
      <h2>API Request Builder</h2>

      {/* Method & URL */}
      <div className="builder-section">
        <h3>Request Configuration</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Method</label>
            <select
              value={request.method}
              onChange={(e) => handleMethodChange(e.target.value as ApiRequest['method'])}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label>Base URL</label>
            <input
              type="text"
              placeholder="https://api.example.com"
              value={request.baseUrl}
              onChange={(e) => handleBaseUrlChange(e.target.value)}
            />
          </div>

          <div className="form-group flex-1">
            <label>Path</label>
            <input
              type="text"
              placeholder="/endpoint"
              value={request.path}
              onChange={(e) => handlePathChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="builder-section">
        <h3>Authentication</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select
              value={request.authentication?.type || 'none'}
              onChange={(e) => handleAuthChange('type', e.target.value)}
            >
              <option value="none">None</option>
              <option value="bearer">Bearer Token</option>
              <option value="basic">Basic Auth</option>
              <option value="oauth2">OAuth2</option>
            </select>
          </div>

          {request.authentication?.type === 'bearer' && (
            <>
              {/* If token exists, show token and disable user/pass fields */}
              {request.authentication?.token ? (
                <div className="form-group flex-1">
                  <label>Token (auto-fetched)</label>
                  <input
                    type="text"
                    value={request.authentication?.token}
                    readOnly
                    style={{ background: '#f0f0f0' }}
                  />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>User ID (email)</label>
                    <input
                      type="text"
                      placeholder="Enter user id/email"
                      value={request.authentication?.username || ''}
                      onChange={(e) => handleAuthChange('username', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={request.authentication?.password || ''}
                      onChange={(e) => handleAuthChange('password', e.target.value)}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {request.authentication?.type === 'basic' && (
            <>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={request.authentication?.username || ''}
                  onChange={(e) => handleAuthChange('username', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={request.authentication?.password || ''}
                  onChange={(e) => handleAuthChange('password', e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Query Parameters */}
      <div className="builder-section">
        <div className="section-header">
          <h3>Query Parameters</h3>
          <button className="btn-secondary" onClick={() => addParameter('query')}>
            + Add
          </button>
        </div>
        <div className="parameters-list">
          {request.queryParameters?.map((param, idx) => (
            <div key={idx} className="parameter-row">
              <input
                type="text"
                placeholder="Parameter name"
                value={param.name}
                onChange={(e) => updateParameter('query', idx, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                value={param.value}
                onChange={(e) => updateParameter('query', idx, 'value', e.target.value)}
              />
              <button className="btn-delete" onClick={() => removeParameter('query', idx)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Headers */}
      <div className="builder-section">
        <div className="section-header">
          <h3>Headers</h3>
          <button className="btn-secondary" onClick={() => addParameter('header')}>
            + Add
          </button>
        </div>
        <div className="parameters-list">
          {request.headers?.map((header, idx) => (
            <div key={idx} className="parameter-row">
              <input
                type="text"
                placeholder="Header name"
                value={header.name}
                onChange={(e) => updateParameter('header', idx, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                value={header.value}
                onChange={(e) => updateParameter('header', idx, 'value', e.target.value)}
              />
              <button className="btn-delete" onClick={() => removeParameter('header', idx)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Request Body */}
      {['POST', 'PUT', 'PATCH'].includes(request.method) && (
        <div className="builder-section">
          <h3>Request Body (JSON)</h3>
          <textarea
            className="json-editor"
            value={bodyJson}
            onChange={(e) => handleBodyChange(e.target.value)}
            placeholder='{"key": "value"}'
          />
        </div>
      )}

      {/* Execute Button */}
      <div className="builder-actions">
        <button
          className="btn-primary"
          onClick={() => onExecute?.(request)}
          disabled={loading}
        >
          {loading ? 'Executing...' : 'Run API'}
        </button>
      </div>
    </div>
  );
};

export default RequestBuilder;
