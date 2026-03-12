import React, { useState } from 'react';
import { SwaggerInfo, SwaggerEndpoint, ApiRequest } from '../types';
import '../styles/components.css';

interface SwaggerImporterProps {
  onSwaggerLoaded?: (swaggerInfo: SwaggerInfo) => void;
  onEndpointSelected?: (endpoint: SwaggerEndpoint, apiRequest: ApiRequest) => void;
}

export const SwaggerImporter: React.FC<SwaggerImporterProps> = ({
  onSwaggerLoaded,
  onEndpointSelected,
}) => {
  const [swaggerInfo, setSwaggerInfo] = useState<SwaggerInfo | null>(null);
  const [baseUrl, setBaseUrl] = useState<string>('https://api.example.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<SwaggerEndpoint | null>(null);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError('');
    try {
      const text = await file.text();
      const spec = JSON.parse(text);

      // Send to backend to parse
      const response = await fetch('http://localhost:3000/api/postman/import-swagger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ swaggerSpec: spec }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse Swagger specification');
      }

      const data = await response.json();
      const swagger = data.swaggerInfo;
      setSwaggerInfo(swagger);
      onSwaggerLoaded?.(swagger);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleEndpointSelect = async (endpoint: SwaggerEndpoint) => {
    setSelectedEndpoint(endpoint);

    // Convert endpoint to API request
    try {
      const response = await fetch('http://localhost:3000/api/postman/convert-swagger-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint, baseUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        onEndpointSelected?.(endpoint, data.request);
      }
    } catch (err) {
      console.error('Failed to convert endpoint:', err);
    }
  };

  return (
    <div className="swagger-importer">
      <h2>Swagger / OpenAPI Import</h2>

      {error && <div className="error-banner">{error}</div>}

      {!swaggerInfo ? (
        <div className="swagger-upload">
          <div className="upload-area">
            <div className="upload-icon">📄</div>
            <h3>Import OpenAPI / Swagger File</h3>
            <p>Upload a Swagger (2.0) or OpenAPI (3.0+) JSON file</p>
            <label className="file-input-label">
              <input
                type="file"
                accept=".json"
                onChange={handleFileInputChange}
                disabled={loading}
              />
              <span className="btn-primary" style={{ display: 'inline-block' }}>
                {loading ? 'Uploading...' : 'Choose File'}
              </span>
            </label>
          </div>
        </div>
      ) : (
        <>
          {/* Swagger Info */}
          <div className="swagger-info">
            <div className="swagger-header">
              <h3>{swaggerInfo.title}</h3>
              <span className="version-badge">v{swaggerInfo.version}</span>
            </div>
            {swaggerInfo.description && <p>{swaggerInfo.description}</p>}
          </div>

          {/* Base URL Configuration */}
          <div className="base-url-config">
            <label>Base URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com"
            />
          </div>

          {/* Endpoints List */}
          <div className="endpoints-section">
            <h3>Available Endpoints ({swaggerInfo.endpoints.length})</h3>
            <div className="endpoints-list">
              {swaggerInfo.endpoints.map((endpoint, idx) => (
                <div
                  key={idx}
                  className={`endpoint-item ${selectedEndpoint === endpoint ? 'selected' : ''}`}
                  onClick={() => handleEndpointSelect(endpoint)}
                >
                  <div className="endpoint-badge">
                    <span className={`method badge-${endpoint.method.toLowerCase()}`}>
                      {endpoint.method}
                    </span>
                  </div>
                  <div className="endpoint-details">
                    <div className="endpoint-path">{endpoint.path}</div>
                    {endpoint.summary && <div className="endpoint-summary">{endpoint.summary}</div>}
                  </div>
                  <div className="endpoint-icon">→</div>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="swagger-actions">
            <button
              className="btn-secondary"
              onClick={() => {
                setSwaggerInfo(null);
                setSelectedEndpoint(null);
              }}
            >
              Load Different File
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SwaggerImporter;
