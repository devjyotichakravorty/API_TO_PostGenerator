# Advanced QA Test Generator - Architecture Guide

## System Overview

The Advanced QA Test Generator is a full-stack application that enables QA engineers to:
1. Define and execute API requests
2. Capture and inspect API responses
3. Select validation rules for response fields
4. Generate Postman test scripts with validation logic
5. Import and test endpoints from Swagger/OpenAPI specifications
6. Export complete Postman collections

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────┐  │
│  │ RequestBuilder  │  │ SwaggerImporter  │  │ ApiForm    │  │
│  │ (API Config)    │  │ (Spec Parser)    │  │ (Legacy)   │  │
│  └────────┬────────┘  └────────┬─────────┘  └────────────┘  │
│           │                    │                              │
│           ▼                    ▼                              │
│  ┌──────────────────────────────────────┐                    │
│  │   ResponseInspector                  │                    │
│  │   (Display Response + Field Viewer)  │                    │
│  └────────┬─────────────────────────────┘                    │
│           │                                                   │
│           ▼                                                   │
│  ┌──────────────────────────────────────┐                    │
│  │   ValidationSelector                 │                    │
│  │   (Configure Validation Rules)       │                    │
│  └────────┬─────────────────────────────┘                    │
│           │                                                   │
│           ▼                                                   │
│  ┌──────────────────────────────────────┐                    │
│  │   ScriptPreview                      │                    │
│  │   (Display Generated Test Script)    │                    │
│  └──────────────────────────────────────┘                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP (JSON)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│               Backend (Node.js + Express)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────┐  │
│  │ ApiExecutor     │  │ SwaggerParser    │  │ Validation │  │
│  │ (HTTP Calls)    │  │ (Spec Parse)     │  │ Generator  │  │
│  └────────┬────────┘  └────────┬─────────┘  └────┬───────┘  │
│           │                    │                 │            │
│           └────────────────────┴─────────────────┘            │
│                    │                                          │
│                    ▼                                          │
│        ┌───────────────────────┐                             │
│        │ PostmanScriptGenerator│                             │
│        │ (Test Generation)     │                             │
│        └───────────┬───────────┘                             │
│                    │                                          │
│        Controllers │ Routes                                   │
│        ────────────┼────────────────────                       │
│        • /execute-api                                         │
│        • /generate-tests-with-validation                     │
│        • /import-swagger                                      │
│        • /convert-swagger-endpoint                            │
│        • /get-response-fields                                 │
│        • /generate-script (legacy)                            │
│        • /generate-collection (legacy)                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Backend Services

### 1. **ApiExecutor.ts**
Handles API request execution with full parameter support.

**Key Methods:**
- `executeRequest(apiRequest: ApiRequest)` - Executes HTTP request
- `buildUrl(apiRequest)` - Constructs full URL with parameters
- `buildAxiosConfig(apiRequest)` - Creates Axios configuration
- `getResponseFieldsInfo(response)` - Extracts field information

**Features:**
- Supports all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- URI parameter replacement
- Query parameter encoding
- Custom header management
- Bearer token & basic auth support
- Request body JSON handling
- Response time measurement
- Error handling with status codes

### 2. **SwaggerParser.ts**
Parses OpenAPI/Swagger specifications and extracts endpoint information.

**Key Methods:**
- `parseSwagger(swaggerSpec)` - Main parser
- `parseEndpoint(path, method, methodSpec)` - Parses single endpoint
- `convertEndpointToRequest(endpoint, baseUrl)` - Converts to API request
- `generateExampleFromSchema(schema)` - Creates example data
- `validateSwagger(swaggerSpec)` - Validates specification

**Features:**
- Supports Swagger 2.0 and OpenAPI 3.0+
- Extracts endpoints, parameters, request bodies
- Generates example data from schema
- Parameter type identification (path, query, header)
- Specification validation

### 3. **ValidationRuleGenerator.ts**
Generates Postman test script code for validation rules.

**Supported Rules:**
- `exact` - Exact value match
- `exists` - Field exists
- `exists_not_empty` - Field exists and not empty
- `valid_string` - Type validation (string)
- `valid_number` - Type validation (number)
- `valid_boolean` - Type validation (boolean)
- `valid_date` - ISO date validation
- `valid_email` - Email format validation
- `valid_uuid` - UUID format validation
- `regex` - Regular expression matching
- `array_length` - Array length check
- `contains_value` - Array/string contains value
- `greater_than` - Numeric comparison
- `less_than` - Numeric comparison
- `range` - Numeric range check
- `null_check` - Null/not null validation
- `skip` - No validation

### 4. **PostmanScriptGenerator.ts** (Enhanced)
Generates complete Postman test scripts with legacy support.

## Frontend Components

### 1. **RequestBuilder.tsx**
Allows users to configure API requests interactively.

**Features:**
- HTTP method selector
- Base URL & endpoint path input
- Authentication configuration (Bearer, Basic, OAuth2)
- Query parameter management
- Header management
- Request body JSON editor (for POST/PUT/PATCH)
- Real-time preview

### 2. **ResponseInspector.tsx**
Displays API response with metadata and field information.

**Features:**
- Status code display with color coding
- Response time display
- Response headers table
- Response body JSON viewer
- Field extraction table
- Type information for each field
- Value preview

### 3. **ValidationSelector.tsx**
Allows selection of validation rules for each response field.

**Features:**
- Dynamic field list from response
- Rule selector dropdown for each field
- Context-aware input fields
- Live preview of validation rules
- Rule descriptions and hints

### 4. **SwaggerImporter.tsx**
Imports and parses Swagger/OpenAPI specifications.

**Features:**
- File upload interface
- Swagger spec validation
- Endpoint list display
- HTTP method color coding
- Base URL configuration
- Endpoint selection

### 5. **AdvancedQAForm.tsx**
Main orchestrator component for the entire workflow.

**Workflow Steps:**
1. API Request Builder (or Swagger Import)
2. Response Inspector (after API execution)
3. Validation Selector (select rules for fields)
4. Test Preview (view generated script)

## Data Flow

### Execution Flow

```
User → RequestBuilder → ExecuteAPI → Response →
ResponseInspector → ValidationSelector → GenerateTests →
ScriptPreview → Export/Copy
```

### Swagger Flow

```
User → SwaggerImporter → SelectEndpoint →
ConvertToRequest → ExecuteAPI → [Continue as above]
```

## Tech Stack

**Backend:**
- Node.js + Express.js
- TypeScript 5.1+
- Axios (HTTP client)
- ts-node-dev (dev server)

**Frontend:**
- React 18+
- TypeScript 5.1+
- Vite 4.4+
- CSS3 (flexbox, grid)

## Key Features

✅ **API Request Builder** - Configure complex HTTP requests
✅ **API Execution** - Execute requests and capture responses
✅ **Response Inspector** - Analyze response data with field information
✅ **Validation Rules** - 17+ validation rule types
✅ **Test Generation** - Automatic Postman test script generation
✅ **Swagger Support** - Import and test OpenAPI specifications
✅ **Collection Export** - Export as Postman collections
✅ **Authentication** - Bearer token, Basic auth support
✅ **Error Handling** - Comprehensive error messages
✅ **Type Safety** - Full TypeScript support

---

See [API_REFERENCE.md](API_REFERENCE.md) for endpoint details.
