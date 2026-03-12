import React from 'react';
import { apiService } from '../services/api';
import './ScriptPreview.css';

interface ScriptPreviewProps {
  script: string;
  loading?: boolean;
  error?: string;
}

export const ScriptPreview: React.FC<ScriptPreviewProps> = ({ script, loading = false, error }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await apiService.copyToClipboard(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="script-preview">
        <div className="loading">Generating script...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="script-preview">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="script-preview">
        <div className="empty">No script generated yet</div>
      </div>
    );
  }

  return (
    <div className="script-preview">
      <div className="script-header">
        <h3>Generated Postman Test Script</h3>
        <button className="btn-copy" onClick={handleCopy}>
          {copied ? '✓ Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
      <pre className="script-code">{script}</pre>
    </div>
  );
};
