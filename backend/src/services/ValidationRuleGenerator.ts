import { ValidationRule } from '../models/types';

export class ValidationRuleGenerator {
  /**
   * Generate a Postman test script line for a validation rule
   */
  generateTestScript(fieldName: string, rule: ValidationRule): string {
    const jsFieldName = this.escapeFieldName(fieldName);

    switch (rule.rule) {
      case 'exact':
        return this.generateExactMatch(jsFieldName, rule.value);

      case 'exists':
        return this.generateExists(jsFieldName);

      case 'exists_not_empty':
        return this.generateExistsNotEmpty(jsFieldName);

      case 'valid_string':
        return this.generateValidString(jsFieldName);

      case 'valid_number':
        return this.generateValidNumber(jsFieldName);

      case 'valid_boolean':
        return this.generateValidBoolean(jsFieldName);

      case 'valid_date':
        return this.generateValidDate(jsFieldName);

      case 'valid_email':
        return this.generateValidEmail(jsFieldName);

      case 'valid_uuid':
        return this.generateValidUUID(jsFieldName);

      case 'regex':
        return this.generateRegexMatch(jsFieldName, rule.regex);

      case 'array_length':
        return this.generateArrayLength(jsFieldName, rule.arrayLength);

      case 'contains_value':
        return this.generateContainsValue(jsFieldName, rule.value);

      case 'greater_than':
        return this.generateGreaterThan(jsFieldName, rule.value);

      case 'less_than':
        return this.generateLessThan(jsFieldName, rule.value);

      case 'range':
        return this.generateRange(jsFieldName, rule.minValue, rule.maxValue);

      case 'null_check':
        return this.generateNullCheck(jsFieldName, rule.value);

      case 'skip':
        return ''; // No test for this field

      default:
        return '';
    }
  }

  private generateExactMatch(fieldName: string, expectedValue: unknown): string {
    const jsonFieldName = fieldName;
    const valueStr = JSON.stringify(expectedValue);
    return `pm.test("${jsonFieldName} is ${expectedValue}", function () {
    pm.expect(jsonData${this.getFieldAccessor(jsonFieldName)}).to.eql(${valueStr});
});`;
  }

  private generateExists(fieldName: string): string {
    return `pm.test("${fieldName} exists", function () {
    pm.expect(jsonData).to.have.property("${fieldName}");
});`;
  }

  private generateExistsNotEmpty(fieldName: string): string {
    return `pm.test("${fieldName} exists and is not empty", function () {
    pm.expect(jsonData).to.have.property("${fieldName}");
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.not.eql("");
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.not.eql(null);
});`;
  }

  private generateValidString(fieldName: string): string {
    return `pm.test("${fieldName} is a valid string", function () {
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.be.a("string");
});`;
  }

  private generateValidNumber(fieldName: string): string {
    return `pm.test("${fieldName} is a valid number", function () {
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.be.a("number");
});`;
  }

  private generateValidBoolean(fieldName: string): string {
    return `pm.test("${fieldName} is a valid boolean", function () {
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.be.a("boolean");
});`;
  }

  private generateValidDate(fieldName: string): string {
    return `pm.test("${fieldName} is a valid date", function () {
    var date = new Date(jsonData${this.getFieldAccessor(fieldName)});
    pm.expect(date.toString()).to.not.eql("Invalid Date");
});`;
  }

  private generateValidEmail(fieldName: string): string {

    return `pm.test("${fieldName} is a valid email", function () {
    var emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.match(emailRegex);
});`;
  }

  private generateValidUUID(fieldName: string): string {
    return `pm.test("${fieldName} is a valid UUID", function () {
    var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.match(uuidRegex);
});`;
  }

  private generateRegexMatch(fieldName: string, pattern?: string): string {
    const regex = pattern || '.*';
    return `pm.test("${fieldName} matches regex pattern", function () {
    var pattern = new RegExp("${regex}");
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.match(pattern);
});`;
  }

  private generateArrayLength(fieldName: string, length?: number): string {
    const comparison = length !== undefined ? `to.have.lengthOf(${length})` : `to.be.an("array")`;
    return `pm.test("${fieldName} is an array${length ? ` with ${length} items` : ''}", function () {
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.be.an("array").and.${comparison};
});`;
  }

  private generateContainsValue(fieldName: string, value?: unknown): string {
    const valueStr = JSON.stringify(value);
    return `pm.test("${fieldName} contains value ${value}", function () {
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.include(${valueStr});
});`;
  }

  private generateGreaterThan(fieldName: string, value?: unknown): string {
    return `pm.test("${fieldName} is greater than ${value}", function () {
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.be.above(${value});
});`;
  }

  private generateLessThan(fieldName: string, value?: unknown): string {
    return `pm.test("${fieldName} is less than ${value}", function () {
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.be.below(${value});
});`;
  }

  private generateRange(fieldName: string, min?: number, max?: number): string {
    return `pm.test("${fieldName} is in range [${min}, ${max}]", function () {
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.be.above(${min}).and.below(${max});
});`;
  }

  private generateNullCheck(fieldName: string, shouldBeNull?: unknown): string {
    if (shouldBeNull) {
      return `pm.test("${fieldName} is null", function () {
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.be.null;
});`;
    } else {
      return `pm.test("${fieldName} is not null", function () {
    pm.expect(jsonData${this.getFieldAccessor(fieldName)}).to.not.be.null;
});`;
    }
  }

  /**
   * Safely access nested fields
   */
  private getFieldAccessor(fieldName: string): string {
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(fieldName)) {
      return `.${fieldName}`;
    } else {
      return `["${fieldName}"]`;
    }
  }

  /**
   * Escape field names for safe use in strings
   */
  private escapeFieldName(fieldName: string): string {
    return fieldName.replace(/"/g, '\\"').replace(/\n/g, '\\n');
  }
}

export default new ValidationRuleGenerator();
