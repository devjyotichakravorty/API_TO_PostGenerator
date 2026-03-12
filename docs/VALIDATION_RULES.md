# Validation Rules Documentation

**Version:** 1.0.0  
**Last Updated:** March 12, 2026  

## Overview

The API to Postman Test Generator supports **17 comprehensive validation rule types** for generating robust test scripts. These rules enable you to validate API responses across various data types, formats, and business logic requirements.

---

## 17 Validation Rule Types

### 1. Exact Value Match
**Description:** Validates that a field value exactly matches the expected value.

**Example:**
```json
{
  "type": "exact_match",
  "field": "status",
  "expected": "success"
}
```

**Generated Test:**
```javascript
pm.test("Status is exactly 'success'", () => {
  pm.expect(pm.response.json().status).to.equal("success");
});
```

---

### 2. Field Exists
**Description:** Validates that a field is present in the response (regardless of value).

**Example:**
```json
{
  "type": "field_exists",
  "field": "user_id"
}
```

**Generated Test:**
```javascript
pm.test("Field 'user_id' exists", () => {
  pm.expect(pm.response.json()).to.have.property('user_id');
});
```

---

### 3. Field Exists + Not Empty
**Description:** Validates that a field exists and is not empty or null.

**Example:**
```json
{
  "type": "field_not_empty",
  "field": "email"
}
```

**Generated Test:**
```javascript
pm.test("Field 'email' is not empty", () => {
  pm.expect(pm.response.json().email).to.not.be.empty;
});
```

---

### 4. Valid String
**Description:** Validates that a field is a valid string type.

**Example:**
```json
{
  "type": "valid_string",
  "field": "name"
}
```

**Generated Test:**
```javascript
pm.test("'name' is a valid string", () => {
  pm.expect(pm.response.json().name).to.be.a('string');
});
```

---

### 5. Valid Number
**Description:** Validates that a field is a valid number type (integer or float).

**Example:**
```json
{
  "type": "valid_number",
  "field": "age"
}
```

**Generated Test:**
```javascript
pm.test("'age' is a valid number", () => {
  pm.expect(pm.response.json().age).to.be.a('number');
});
```

---

### 6. Valid Boolean
**Description:** Validates that a field is a valid boolean value (true/false).

**Example:**
```json
{
  "type": "valid_boolean",
  "field": "is_active"
}
```

**Generated Test:**
```javascript
pm.test("'is_active' is a valid boolean", () => {
  pm.expect(pm.response.json().is_active).to.be.a('boolean');
});
```

---

### 7. Valid Date
**Description:** Validates that a field contains a valid date format (ISO 8601 or similar).

**Example:**
```json
{
  "type": "valid_date",
  "field": "created_at"
}
```

**Generated Test:**
```javascript
pm.test("'created_at' is a valid date", () => {
  pm.expect(new Date(pm.response.json().created_at)).to.not.be.invalid;
});
```

---

### 8. Valid Email
**Description:** Validates that a field contains a valid email address format.

**Example:**
```json
{
  "type": "valid_email",
  "field": "user_email"
}
```

**Generated Test:**
```javascript
pm.test("'user_email' is a valid email", () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  pm.expect(pm.response.json().user_email).to.match(emailRegex);
});
```

---

### 9. Valid UUID
**Description:** Validates that a field contains a valid UUID format.

**Example:**
```json
{
  "type": "valid_uuid",
  "field": "request_id"
}
```

**Generated Test:**
```javascript
pm.test("'request_id' is a valid UUID", () => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  pm.expect(pm.response.json().request_id).to.match(uuidRegex);
});
```

---

### 10. Regex Pattern
**Description:** Validates that a field matches a specified regular expression pattern.

**Example:**
```json
{
  "type": "regex_pattern",
  "field": "phone_number",
  "pattern": "^\\d{10}$"
}
```

**Generated Test:**
```javascript
pm.test("'phone_number' matches pattern", () => {
  pm.expect(pm.response.json().phone_number).to.match(/^\d{10}$/);
});
```

---

### 11. Array Length
**Description:** Validates that an array field has the expected length or meets length criteria.

**Example:**
```json
{
  "type": "array_length",
  "field": "items",
  "expected_length": 5
}
```

**Generated Test:**
```javascript
pm.test("Array 'items' has length 5", () => {
  pm.expect(pm.response.json().items).to.have.lengthOf(5);
});
```

---

### 12. Contains Value
**Description:** Validates that an array or string contains a specific value.

**Example:**
```json
{
  "type": "contains_value",
  "field": "tags",
  "value": "important"
}
```

**Generated Test:**
```javascript
pm.test("'tags' array contains 'important'", () => {
  pm.expect(pm.response.json().tags).to.include('important');
});
```

---

### 13. Greater Than
**Description:** Validates that a numeric field value is greater than a specified threshold.

**Example:**
```json
{
  "type": "greater_than",
  "field": "score",
  "threshold": 50
}
```

**Generated Test:**
```javascript
pm.test("'score' is greater than 50", () => {
  pm.expect(pm.response.json().score).to.be.greaterThan(50);
});
```

---

### 14. Less Than
**Description:** Validates that a numeric field value is less than a specified threshold.

**Example:**
```json
{
  "type": "less_than",
  "field": "count",
  "threshold": 100
}
```

**Generated Test:**
```javascript
pm.test("'count' is less than 100", () => {
  pm.expect(pm.response.json().count).to.be.lessThan(100);
});
```

---

### 15. Range Validation
**Description:** Validates that a numeric field value is within a specified range (min and max).

**Example:**
```json
{
  "type": "range",
  "field": "temperature",
  "min": -10,
  "max": 50
}
```

**Generated Test:**
```javascript
pm.test("'temperature' is in range [-10, 50]", () => {
  pm.expect(pm.response.json().temperature).to.be.within(-10, 50);
});
```

---

### 16. Null/Not Null
**Description:** Validates whether a field is null or not null.

**Example (Not Null):**
```json
{
  "type": "not_null",
  "field": "user_name"
}
```

**Generated Test:**
```javascript
pm.test("'user_name' is not null", () => {
  pm.expect(pm.response.json().user_name).to.not.be.null;
});
```

**Example (Is Null):**
```json
{
  "type": "is_null",
  "field": "optional_field"
}
```

**Generated Test:**
```javascript
pm.test("'optional_field' is null", () => {
  pm.expect(pm.response.json().optional_field).to.be.null;
});
```

---

### 17. Skip Validation
**Description:** Skips validation for a field (useful for placeholder or optional tests).

**Example:**
```json
{
  "type": "skip",
  "field": "future_field",
  "reason": "Not yet implemented"
}
```

**Generated Test:**
```javascript
pm.test.skip("Validation for 'future_field' - Not yet implemented", () => {
  // Test skipped
});
```

---

## Summary

| No. | Rule Type | Use Case | Example |
|-----|-----------|----------|---------|
| 1 | Exact Value Match | Fixed expected values | Status codes, confirmations |
| 2 | Field Exists | Essential fields | Required API response fields |
| 3 | Field Exists + Not Empty | Non-empty data | Names, descriptions, IDs |
| 4 | Valid String | Type validation | Text fields, descriptions |
| 5 | Valid Number | Numeric validation | Counts, prices, scores |
| 6 | Valid Boolean | Flag validation | Feature flags, toggles |
| 7 | Valid Date | Date format validation | Timestamps, expiration dates |
| 8 | Valid Email | Email format validation | User emails, contact info |
| 9 | Valid UUID | UUID format validation | Unique identifiers |
| 10 | Regex Pattern | Complex patterns | Phone numbers, custom formats |
| 11 | Array Length | Collection size | List lengths, batch sizes |
| 12 | Contains Value | Collection membership | Tags, categories, roles |
| 13 | Greater Than | Numeric lower bounds | Minimum thresholds |
| 14 | Less Than | Numeric upper bounds | Maximum limits |
| 15 | Range Validation | Numeric boundaries | Temperature, percentages |
| 16 | Null/Not Null | Null checking | Optional vs required fields |
| 17 | Skip Validation | Deferred testing | Future features, WIP |

---

## Best Practices

1. **Use Exact Match** for fixed, predictable values (status codes, constants)
2. **Use Field Exists** to verify API contract compliance
3. **Use Type Validations** (string, number, boolean, date) for type safety
4. **Use Regex Pattern** for complex custom formats
5. **Use Range Validation** for numeric fields with boundaries
6. **Use Array Length** for paginated or batch responses
7. **Use Skip** for tests under development or placeholder tests

---

## Related Documentation

- [API Reference](API_REFERENCE.md) - Complete API endpoint documentation
- [Quick Start Guide](QUICK_START.md) - Getting started with the generator
- [Development Guide](DEVELOPMENT.md) - Building custom validation rules

