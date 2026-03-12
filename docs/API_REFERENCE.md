# API Reference Guide

Complete reference for all API endpoints and validation rules.

## Base URL

```
http://localhost:3000/api/postman
```

---

## API Endpoints (5 Total)

### 1. Execute API Request

**Endpoint:** `POST /execute-api`

**Purpose:** Execute an HTTP request and capture the response.

**Request:**
```json
{
  "method": "POST",
  "baseUrl": "https://reqres.in/api",
  "path": "/users",
  "uriParameters": [{"name": "id", "value": "123"}],
  "queryParameters": [{"name": "page", "value": "1"}],
  "headers": [{"name": "Content-Type", "value": "application/json"}],
  "authentication": {
    "type": "bearer",
    "token": "your-token"
  },
  "requestBody": {"name": "John", "job": "QA"}
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "statusCode": 201,
    "headers": {...},
    "body": {...},
    "responseTime": 245,
    "timestamp": "2026-03-12T10:00:00.000Z"
  }
}
```

**Status Codes:** 200 (Success), 400 (Missing fields), 500 (Server error)

---

### 2. Generate Tests with Validation

**Endpoint:** `POST /generate-tests-with-validation`

**Purpose:** Generate Postman test scripts from response and validation rules.

**Request:**
```json
{
  "response": {
    "statusCode": 201,
    "body": {
      "id": 101,
      "name": "John",
      "email": "john@example.com",
      "age": 30
    },
    "responseTime": 245
  },
  "validationConfig": {
    "id": {"rule": "exists_not_empty"},
    "name": {"rule": "exact", "value": "John"},
    "email": {"rule": "valid_email"},
    "age": {"rule": "greater_than", "value": 18}
  },
  "expectedStatusCode": 201
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "statusCodeTest": "pm.test(\"Status code is 201\", ...)",
    "responseTimeTest": "pm.test(\"Response time is below 5000ms\", ...)",
    "fieldTests": [...],
    "fullScript": "pm.test(...)\n\npm.test(...)"
  }
}
```

---

### 3. Get Response Fields

**Endpoint:** `POST /get-response-fields`

**Purpose:** Extract field information from API response.

**Request:**
```json
{
  "responseBody": {
    "id": 101,
    "name": "John",
    "email": "john@example.com",
    "active": true,
    "createdAt": "2026-03-12T10:00:00Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "result": [
    {"name": "id", "type": "number"},
    {"name": "name", "type": "string"},
    {"name": "email", "type": "string"},
    {"name": "active", "type": "boolean"},
    {"name": "createdAt", "type": "string"}
  ]
}
```

---

### 4. Import Swagger

**Endpoint:** `POST /import-swagger`

**Purpose:** Parse Swagger 2.0 or OpenAPI 3.0+ specification.

**Request:**
```json
{
  "swaggerSpec": {
    "swagger": "2.0",
    "info": {"title": "User API", "version": "1.0.0"},
    "paths": {...}
  }
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "title": "User API",
    "baseUrl": "https://api.example.com",
    "endpoints": [
      {
        "path": "/users",
        "method": "POST",
        "summary": "Create user",
        "parameters": [...]
      }
    ]
  }
}
```

---

### 5. Convert Swagger Endpoint

**Endpoint:** `POST /convert-swagger-endpoint`

**Purpose:** Convert Swagger endpoint definition to API request.

**Request:**
```json
{
  "endpoint": {
    "path": "/users/{id}",
    "method": "GET",
    "parameters": [...]
  },
  "baseUrl": "https://api.example.com"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "method": "GET",
    "baseUrl": "https://api.example.com",
    "path": "/users/{id}",
    "uriParameters": [...],
    "queryParameters": [...]
  }
}
```

---

## Validation Rules (17 Types)

### Rules Summary

| Rule | Type | Input | Use Case |
|------|------|-------|----------|
| `exact` | Comparison | Value | Known fixed values |
| `exists` | Existence | None | Required field |
| `exists_not_empty` | Existence | None | Non-empty field |
| `valid_string` | Type | None | String validation |
| `valid_number` | Type | None | Number validation |
| `valid_boolean` | Type | None | Boolean validation |
| `valid_date` | Format | None | Date validation |
| `valid_email` | Format | None | Email validation |
| `valid_uuid` | Format | None | UUID validation |
| `regex` | Pattern | Pattern | Regex matching |
| `array_length` | Size | Length | Array size |
| `contains_value` | Search | Value | Array search |
| `greater_than` | Comparison | Number | Threshold |
| `less_than` | Comparison | Number | Ceiling |
| `range` | Range | Min, Max | Range check |
| `null_check` | Existence | Boolean | Null check |
| `skip` | None | None | Skip validation |

### Detailed Rules

#### 1. Exact Match
```json
{"rule": "exact", "value": "John"}
// Generates: pm.expect(jsonData.name).to.eql("John");
```

#### 2. Exists
```json
{"rule": "exists"}
// Generates: pm.expect(jsonData).to.have.property("id");
```

#### 3. Not Empty
```json
{"rule": "exists_not_empty"}
// Generates: Check property exists AND is not empty/null
```

#### 4-6. Type Validations
```json
{"rule": "valid_string"}    // Type === 'string'
{"rule": "valid_number"}    // Type === 'number'
{"rule": "valid_boolean"}   // Type === 'boolean'
```

#### 7-9. Format Validations
```json
{"rule": "valid_date"}      // ISO date format
{"rule": "valid_email"}     // Email regex
{"rule": "valid_uuid"}      // UUID format
```

#### 10. Regex Pattern
```json
{"rule": "regex", "value": "^[A-Z][a-z]+$"}
// Matches pattern
```

#### 11. Array Length
```json
{"rule": "array_length", "value": 5}
// Array length === 5
```

#### 12. Contains Value
```json
{"rule": "contains_value", "value": "admin"}
// Array/string contains value
```

#### 13-14. Numeric Comparisons
```json
{"rule": "greater_than", "value": 18}  // > 18
{"rule": "less_than", "value": 100}    // < 100
```

#### 15. Numeric Range
```json
{"rule": "range", "minValue": 0, "maxValue": 100}
// Between 0 and 100
```

#### 16. Null Check
```json
{"rule": "null_check", "value": false}
// value: false = must not be null
// value: true = must be null
```

#### 17. Skip
```json
{"rule": "skip"}
// No validation generated
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here",
  "result": null
}
```

### Common Errors

| Error | Cause |
|-------|-------|
| Missing required fields | Request body incomplete |
| Invalid JSON format | Malformed JSON |
| Network error | API unreachable |
| Invalid validation rule | Unknown rule type |
| Invalid Swagger spec | Malformed specification |

---

## Usage Examples

### Example 1: Execute GET Request

```bash
curl -X POST http://localhost:3000/api/postman/execute-api \
  -H "Content-Type: application/json" \
  -d '{
    "method": "GET",
    "baseUrl": "https://jsonplaceholder.typicode.com",
    "path": "/posts/1"
  }'
```

### Example 2: Generate Test Script

```bash
curl -X POST http://localhost:3000/api/postman/generate-tests-with-validation \
  -H "Content-Type: application/json" \
  -d '{
    "response": {
      "statusCode": 200,
      "body": {"id": 1, "title": "Test"},
      "responseTime": 100
    },
    "validationConfig": {
      "id": {"rule": "exists"},
      "title": {"rule": "exists_not_empty"}
    },
    "expectedStatusCode": 200
  }'
```

---

See [DEVELOPMENT.md](DEVELOPMENT.md) for backend architecture details.
