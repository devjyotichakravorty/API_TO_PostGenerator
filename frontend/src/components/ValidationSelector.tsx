import React, { useState } from 'react';
import { ResponseField, ValidationConfig, ValidationRuleType } from '../types';
import '../styles/components.css';

interface ValidationSelectorProps {
  fields: ResponseField[];
  onValidationChange?: (config: ValidationConfig) => void;
  onGenerateTests?: (config: ValidationConfig) => void;
}

const VALIDATION_RULES = [
  { rule: 'exact', label: 'Exact Value Match', description: 'Field equals exact value', requiresValue: true },
  { rule: 'exists', label: 'Field Exists', description: 'Field is present in response', requiresValue: false },
  { rule: 'exists_not_empty', label: 'Exists + Not Empty', description: 'Field exists and is not empty', requiresValue: false },
  { rule: 'valid_string', label: 'Valid String', description: 'Field is a string', requiresValue: false },
  { rule: 'valid_number', label: 'Valid Number', description: 'Field is a number', requiresValue: false },
  { rule: 'valid_boolean', label: 'Valid Boolean', description: 'Field is a boolean', requiresValue: false },
  { rule: 'valid_date', label: 'Valid Date', description: 'Field is a valid date', requiresValue: false },
  { rule: 'valid_email', label: 'Valid Email', description: 'Field is a valid email', requiresValue: false },
  { rule: 'valid_uuid', label: 'Valid UUID', description: 'Field is a valid UUID', requiresValue: false },
  { rule: 'regex', label: 'Regex Match', description: 'Field matches regex pattern', requiresValue: true },
  { rule: 'array_length', label: 'Array Length', description: 'Array has specific length', requiresValue: true },
  { rule: 'contains_value', label: 'Contains Value', description: 'Array/String contains value', requiresValue: true },
  { rule: 'greater_than', label: 'Greater Than', description: 'Number is greater than value', requiresValue: true },
  { rule: 'less_than', label: 'Less Than', description: 'Number is less than value', requiresValue: true },
  { rule: 'range', label: 'Range Validation', description: 'Number is within range', requiresValue: true },
  { rule: 'skip', label: 'Skip Validation', description: 'No validation for this field', requiresValue: false },
];

export const ValidationSelector: React.FC<ValidationSelectorProps> = ({
  fields,
  onValidationChange,
  onGenerateTests,
}) => {
  const [validationConfig, setValidationConfig] = useState<ValidationConfig>(
    fields.reduce((acc, field) => {
      acc[field.key] = { rule: 'exists_not_empty' };
      return acc;
    }, {} as ValidationConfig)
  );

  const updateValidation = (fieldName: string, rule: ValidationRuleType) => {
    const updated = { ...validationConfig, [fieldName]: { rule } };
    setValidationConfig(updated);
    onValidationChange?.(updated);
  };

  const updateValidationValue = (fieldName: string, key: string, value: unknown) => {
    const updated = {
      ...validationConfig,
      [fieldName]: { ...validationConfig[fieldName], [key]: value },
    };
    setValidationConfig(updated);
    onValidationChange?.(updated);
  };

  return (
    <div className="validation-selector">
      <h2>Validation Rules</h2>
      <p className="section-description">Select validation rules for each response field:</p>

      <div className="validation-rules">
        {fields.map((field) => {
          const fieldValidation = validationConfig[field.key];
          const selectedRule = VALIDATION_RULES.find((r) => r.rule === fieldValidation?.rule);

          return (
            <div key={field.key} className="validation-rule-item">
              <div className="rule-header">
                <div className="field-info">
                  <span className="field-name">{field.key}</span>
                  <span className="field-type-badge">{field.type}</span>
                  <span className="field-value-preview">
                    {typeof field.value === 'object'
                      ? JSON.stringify(field.value).substring(0, 50)
                      : String(field.value).substring(0, 50)}
                  </span>
                </div>
              </div>

              <div className="rule-select-container">
                <select
                  value={fieldValidation?.rule || 'skip'}
                  onChange={(e) => updateValidation(field.key, e.target.value as ValidationRuleType)}
                >
                  {VALIDATION_RULES.map((rule) => (
                    <option key={rule.rule} value={rule.rule}>
                      {rule.label}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRule?.description && (
                <p className="rule-description">{selectedRule.description}</p>
              )}

              {/* Rule-specific input fields */}
              {fieldValidation?.rule === 'exact' && (
                <div className="rule-input">
                  <label>Expected Value</label>
                  <input
                    type="text"
                    placeholder="Enter expected value"
                    value={String(fieldValidation.value || '')}
                    onChange={(e) => updateValidationValue(field.key, 'value', e.target.value)}
                  />
                </div>
              )}

              {fieldValidation?.rule === 'regex' && (
                <div className="rule-input">
                  <label>Regex Pattern</label>
                  <input
                    type="text"
                    placeholder="Enter regex pattern"
                    value={fieldValidation.regex || ''}
                    onChange={(e) => updateValidationValue(field.key, 'regex', e.target.value)}
                  />
                </div>
              )}

              {fieldValidation?.rule === 'array_length' && (
                <div className="rule-input">
                  <label>Expected Length</label>
                  <input
                    type="number"
                    placeholder="Enter array length"
                    value={fieldValidation.arrayLength || ''}
                    onChange={(e) => updateValidationValue(field.key, 'arrayLength', parseInt(e.target.value))}
                  />
                </div>
              )}

              {fieldValidation?.rule === 'contains_value' && (
                <div className="rule-input">
                  <label>Value to Find</label>
                  <input
                    type="text"
                    placeholder="Enter value to find"
                    value={String(fieldValidation.value || '')}
                    onChange={(e) => updateValidationValue(field.key, 'value', e.target.value)}
                  />
                </div>
              )}

              {['greater_than', 'less_than'].includes(fieldValidation?.rule || '') && (
                <div className="rule-input">
                  <label>Threshold Value</label>
                  <input
                    type="number"
                    placeholder="Enter threshold"
                    value={(fieldValidation.value as string) || ''}
                    onChange={(e) => updateValidationValue(field.key, 'value', parseFloat(e.target.value))}
                  />
                </div>
              )}

              {fieldValidation?.rule === 'range' && (
                <div className="rule-input">
                  <div className="range-inputs">
                    <div className="input-group">
                      <label>Min Value</label>
                      <input
                        type="number"
                        placeholder="Min"
                        value={fieldValidation.minValue || ''}
                        onChange={(e) => updateValidationValue(field.key, 'minValue', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="input-group">
                      <label>Max Value</label>
                      <input
                        type="number"
                        placeholder="Max"
                        value={fieldValidation.maxValue || ''}
                        onChange={(e) => updateValidationValue(field.key, 'maxValue', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="validation-actions">
        <button
          className="btn-primary"
          onClick={() => onGenerateTests?.(validationConfig)}
        >
          Generate Validation Tests
        </button>
      </div>
    </div>
  );
};

export default ValidationSelector;
