import React from 'react';
import { ApiParameter } from '../types';
import './ParameterEditor.css';

interface ParameterEditorProps {
  parameters: ApiParameter[];
  label: string;
  onAdd: () => void;
  onDelete: (index: number) => void;
  onChange: (index: number, field: keyof ApiParameter, value: string) => void;
}

export const ParameterEditor: React.FC<ParameterEditorProps> = ({
  parameters,
  label,
  onAdd,
  onDelete,
  onChange,
}) => {
  return (
    <div className="parameter-editor">
      <div className="parameter-editor-header">
        <h3>{label}</h3>
        <button className="btn-add" onClick={onAdd}>
          + Add
        </button>
      </div>

      {parameters.length === 0 ? (
        <p className="empty-params">No {label.toLowerCase()} added yet</p>
      ) : (
        <div className="parameter-list">
          {parameters.map((param, index) => (
            <div key={index} className="parameter-row">
              <input
                type="text"
                placeholder="Name"
                value={param.name}
                onChange={(e) => onChange(index, 'name', e.target.value)}
                className="param-input"
              />
              <input
                type="text"
                placeholder="Value"
                value={param.value}
                onChange={(e) => onChange(index, 'value', e.target.value)}
                className="param-input"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={param.description || ''}
                onChange={(e) => onChange(index, 'description', e.target.value)}
                className="param-input"
              />
              <button className="btn-delete" onClick={() => onDelete(index)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
