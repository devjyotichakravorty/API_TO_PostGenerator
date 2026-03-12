import React from 'react';
import { ApiResponse, ResponseField } from '../types';
import '../styles/components.css';

interface ResponseInspectorProps {
  response?: ApiResponse;
  loading?: boolean;
  error?: string;
  onFieldsExtracted?: (fields: ResponseField[]) => void;
}

export const ResponseInspector: React.FC<ResponseInspectorProps> = ({
  response,
  error,
  onFieldsExtracted,
}) => {
  const getFieldsFromResponse = (body: Record<string, unknown>): ResponseField[] => {
    return Object.entries(body).map(([key, value]) => ({
      key,
      type: typeof value,
      value,
      isArray: Array.isArray(value),
      isObject: typeof value === 'object' && value !== null && !Array.isArray(value),
    }));
  };

  const extractFields = () => {
    if (response?.body) {
      const fields = getFieldsFromResponse(response.body);
      onFieldsExtracted?.(fields);
    }
  };

  const formatValue = (val: unknown, truncate = true): string => {
    if (val === null) return 'null';
    if (typeof val === 'object') {
      const str = JSON.stringify(val, null, 2);
      return truncate && str.length > 100 ? str.substring(0, 100) + '...' : str;
    }
    return String(val);
  };

  return (
    <div className="response-inspector">
      <h2>API Response</h2>

      {error && <div className="error-banner">{error}</div>}

      {response && (
        <>
          {/* Response Metadata */}
          <div className="response-metadata">
            <div className="metadata-item">
              <span className="metadata-label">Status Code:</span>
              <span className={`status-code ${response.statusCode < 400 ? 'success' : 'error'}`}>
                {response.statusCode}
              </span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Response Time:</span>
              <span>{response.responseTime}ms</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Timestamp:</span>
              <span>{new Date(response.timestamp).toLocaleString()}</span>
            </div>
          </div>

          {/* Response Headers */}
          <div className="response-section">
            <h3>Response Headers</h3>
            <div className="headers-table">
              {Object.entries(response.headers).map(([key, val]) => (
                <div key={key} className="header-row">
                  <div className="header-key">{key}</div>
                  <div className="header-value">{formatValue(val)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Body */}
          <div className="response-section">
            <h3>Response Body</h3>
            <div className="body-container">
              <pre>{JSON.stringify(response.body, null, 2)}</pre>
            </div>
          </div>

          {/* Field Inspector Table */}
          <div className="response-section">
            <div className="section-header">
              <h3>Response Fields</h3>
              <button className="btn-secondary" onClick={extractFields}>
                Inspect Fields
              </button>
            </div>
            <table className="fields-table">
              <thead>
                <tr>
                  <th>Field Name</th>
                  <th>Type</th>
                  <th>Value Preview</th>
                </tr>
              </thead>
              <tbody>
                {getFieldsFromResponse(response.body).map((field) => (
                  <tr key={field.key}>
                    <td className="field-name">{field.key}</td>
                    <td className="field-type">
                      <span className="type-badge">{field.type}</span>
                    </td>
                    <td className="field-value">
                      <code>{formatValue(field.value, true)}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!response && !error && <div className="placeholder">Execute an API request to see the response</div>}
    </div>
  );
};

export default ResponseInspector;
