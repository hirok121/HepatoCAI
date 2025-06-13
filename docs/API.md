# API Documentation

<div align="center">
  <h2>🔌 HepatoCAI REST API Reference</h2>
  <p>Comprehensive guide to the HepatoCAI backend API</p>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Common Patterns](#common-patterns)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
- [Examples](#examples)
- [SDKs and Tools](#sdks-and-tools)

## 🎯 Overview

The HepatoCAI API is a RESTful service that provides access to all platform functionality including user management, AI assistant features, diagnostic tools, and administrative capabilities.

### Key Features

- **RESTful Design**: Standard HTTP methods and status codes
- **JSON Responses**: All responses are in JSON format
- **JWT Authentication**: Secure token-based authentication
- **OpenAPI Documentation**: Interactive API documentation
- **Rate Limiting**: Protection against abuse
- **Comprehensive Logging**: Full audit trail

### API Versions

- **Current Version**: v1 (implicit)
- **Endpoint Pattern**: `/{resource}/`
- **Documentation**: Available at `/api/docs/swagger/` and `/api/docs/redoc/`

## 🔐 Authentication

### JWT Token Authentication

The API uses JWT (JSON Web Tokens) for authentication. All protected endpoints require a valid JWT token in the Authorization header.

#### Obtaining a Token

```bash
POST /accounts/token/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response:**

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_staff": false
  }
}
```

#### Using the Token

Include the access token in all API requests:

```bash
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### Refreshing Tokens

```bash
POST /accounts/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### OAuth Authentication

The platform supports OAuth authentication with Google and GitHub.

#### Google OAuth

```
GET /accounts/google/login/
```

#### GitHub OAuth

```
GET /accounts/github/login/
```

## 🌐 Base URL

### Development

```
http://localhost:8000
```

### Production

```
https://hepatocai-backend.onrender.com
```

All endpoint URLs should be prefixed with the base URL.

## 🔄 Common Patterns

### Standard Response Format

All API responses follow a consistent structure:

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-01-13T10:30:00Z",
  "request_id": "req_123456789"
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field_name": ["This field is required"]
    }
  },
  "timestamp": "2025-01-13T10:30:00Z",
  "request_id": "req_123456789"
}
```

### Pagination

Large result sets are paginated:

```json
{
  "success": true,
  "data": {
    "results": [...],
    "count": 150,
    "next": "http://api.example.com/endpoint/?page=2",
    "previous": null,
    "page_size": 20,
    "current_page": 1,
    "total_pages": 8
  }
}
```

## 🚨 Error Handling

### HTTP Status Codes

| Code | Meaning               | Description                   |
| ---- | --------------------- | ----------------------------- |
| 200  | OK                    | Request successful            |
| 201  | Created               | Resource created successfully |
| 400  | Bad Request           | Invalid request data          |
| 401  | Unauthorized          | Authentication required       |
| 403  | Forbidden             | Insufficient permissions      |
| 404  | Not Found             | Resource not found            |
| 429  | Too Many Requests     | Rate limit exceeded           |
| 500  | Internal Server Error | Server error                  |

### Error Codes

| Code                      | Description                    |
| ------------------------- | ------------------------------ |
| `VALIDATION_ERROR`        | Request data validation failed |
| `AUTHENTICATION_REQUIRED` | Valid authentication required  |
| `PERMISSION_DENIED`       | Insufficient permissions       |
| `RESOURCE_NOT_FOUND`      | Requested resource not found   |
| `RATE_LIMIT_EXCEEDED`     | Too many requests              |
| `SERVER_ERROR`            | Internal server error          |

## ⏱️ Rate Limiting

### Default Limits

- **Authenticated Users**: 1000 requests/hour
- **Anonymous Users**: 100 requests/hour
- **API Endpoints**: 100 requests/hour per endpoint

### Headers

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642089600
```

## 📚 Endpoints

### Authentication Endpoints

#### Obtain JWT Token

```bash
POST /accounts/token/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

#### Refresh JWT Token

```bash
POST /accounts/token/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Google OAuth Login

```bash
GET /accounts/google/login/
```

### User Management Endpoints

#### User Registration

```bash
POST /users/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Email Verification

```bash
GET /users/verify-email/{uidb64}/{token}/
```

#### Password Reset Request

```bash
POST /users/reset-password/
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Check Email Availability

```bash
POST /users/check-email/
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Get User Profile

```bash
GET /users/profile/
Authorization: Bearer {token}
```

#### Update User Profile

```bash
PATCH /users/profile/{user_id}/
Authorization: Bearer {token}
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith",
  "phone_number": "+1234567890",
  "bio": "Updated bio"
}
```

#### Contact Form

```bash
POST /users/contact/me/
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I have a question..."
}
```

#### Admin User Management

```bash
GET /users/admin/users/
Authorization: Bearer {admin_token}
```

```bash
GET /users/admin/users/{user_id}/
Authorization: Bearer {admin_token}
```

```bash
PATCH /users/admin/users/{user_id}/
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "is_active": true,
  "is_staff": false
}
```

### AI Assistant Endpoints

#### List User Chats

```bash
GET /aiassistant/chats/
Authorization: Bearer {token}
```

#### Create New Chat

```bash
POST /aiassistant/chats/
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "General Questions about HCV"
}
```

#### Get Chat Details

```bash
GET /aiassistant/chats/{chat_id}/
Authorization: Bearer {token}
```

#### Update Chat

```bash
PATCH /aiassistant/chats/{chat_id}/
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Chat Title"
}
```

#### Delete Chat

```bash
DELETE /aiassistant/chats/{chat_id}/
Authorization: Bearer {token}
```

#### Send Message to Chat

```bash
POST /aiassistant/chats/{chat_id}/messages/
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "What are the symptoms of Hepatitis C?"
}
```

#### Get/Update User Profile

```bash
GET /aiassistant/profile/
Authorization: Bearer {token}
```

```bash
PATCH /aiassistant/profile/
Authorization: Bearer {token}
Content-Type: application/json

{
  "preferences": {
    "language": "en",
    "notifications": true
  }
}
```

### Diagnosis Endpoints

#### Create HCV Analysis

```bash
POST /diagnosis/analyze-hcv/
Authorization: Bearer {token}
Content-Type: application/json

{
  "patient_name": "John Doe",
  "age": 45,
  "sex": "Male",
  "alt": 55.0,
  "ast": 48.0,
  "bilirubin": 1.8,
  "albumin": 3.5,
  "alkaline_phosphatase": 120.0,
  "gamma_glutamyl_transferase": 85.0
}
```

#### Get User Diagnoses

```bash
GET /diagnosis/analyze-hcv/
Authorization: Bearer {token}
```

#### Get Specific Diagnosis

```bash
GET /diagnosis/analyze-hcv/{diagnosis_id}/
Authorization: Bearer {token}
```

#### Update Diagnosis

```bash
PUT /diagnosis/analyze-hcv/{diagnosis_id}/
Authorization: Bearer {token}
Content-Type: application/json

{
  "patient_name": "John Smith",
  "notes": "Updated patient information"
}
```

#### Delete Diagnosis

```bash
DELETE /diagnosis/analyze-hcv/{diagnosis_id}/
Authorization: Bearer {token}
```

#### Search Patient Records

```bash
GET /diagnosis/search/?q={search_term}
Authorization: Bearer {token}
```

#### Get User Analytics

```bash
GET /diagnosis/analytics/user/
Authorization: Bearer {token}
```

#### Export User Data (CSV)

```bash
GET /diagnosis/export/csv/
Authorization: Bearer {token}
```

#### Export User Data (Excel)

```bash
GET /diagnosis/export/excel/
Authorization: Bearer {token}
```

### Admin Diagnosis Endpoints

#### Get All Patient Records

```bash
GET /diagnosis/records/
Authorization: Bearer {admin_token}
```

#### Admin Search

```bash
GET /diagnosis/admin/search/?q={search_term}
Authorization: Bearer {admin_token}
```

#### Admin Analytics

```bash
GET /diagnosis/analytics/admin/
Authorization: Bearer {admin_token}
```

### API Documentation Endpoints

#### OpenAPI Schema

```bash
GET /api/schema/
```

#### Swagger UI

```bash
GET /api/docs/swagger/
```

#### ReDoc Documentation

```bash
GET /api/docs/redoc/
```

### Admin Interface

#### Django Admin

```bash
GET /admin/
```

#### DRF Browsable API

```bash
GET /api-auth/
```

DELETE /diagnosis/analyze-hcv/{diagnosis_id}/
Authorization: Bearer {token}

````

#### Search Patient Records

```bash
GET /diagnosis/search/?hcv_status=positive&min_confidence=0.8&page=1&page_size=10
Authorization: Bearer {token}
````

#### Export Patient Data

```bash
GET /diagnosis/export/csv/
Authorization: Bearer {token}
```

```bash
GET /diagnosis/export/excel/
Authorization: Bearer {token}
```

### Analytics Endpoints

#### User Analytics

```bash
GET /diagnosis/analytics/user/
Authorization: Bearer {token}
```

#### Admin Analytics

```bash
GET /diagnosis/analytics/admin/
Authorization: Bearer {admin_token}
```

### Admin Endpoints

#### Admin Patient Search

```bash
GET /diagnosis/admin/search/?created_by=user@example.com&date_from=2025-01-01
Authorization: Bearer {admin_token}
```

#### Patient Records Management

```bash
GET /diagnosis/records/
Authorization: Bearer {admin_token}
```

### Contact Endpoints

#### Contact Form

```bash
POST /users/contact/me/
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Feature Request",
  "message": "I would like to suggest a new feature..."
}
```

## 💻 Examples

### JavaScript/Fetch

```javascript
// Authentication
const response = await fetch("http://localhost:8000/accounts/token/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});

const { access, refresh } = await response.json();

// API Request with token
const apiResponse = await fetch("http://localhost:8000/users/profile/me/", {
  headers: {
    Authorization: `Bearer ${access}`,
    "Content-Type": "application/json",
  },
});

const profile = await apiResponse.json();
```

### Python/Requests

```python
import requests

# Authentication
auth_response = requests.post('http://localhost:8000/accounts/token/', json={
    'email': 'user@example.com',
    'password': 'password123'
})

tokens = auth_response.json()
access_token = tokens['access']

# API Request with token
headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

response = requests.get('http://localhost:8000/users/profile/me/', headers=headers)
profile = response.json()
```

### cURL

```bash
# Authentication
curl -X POST http://localhost:8000/accounts/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# API Request
curl -X GET http://localhost:8000/users/profile/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

### HCV Diagnosis Example

```javascript
// Complete HCV diagnosis workflow
async function performDiagnosis(patientData) {
  try {
    // Send diagnosis request
    const response = await fetch("/diagnosis/analyze-hcv/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patient_name: patientData.name,
        age: patientData.age,
        sex: patientData.sex,
        alt: patientData.biomarkers.alt,
        ast: patientData.biomarkers.ast,
        bilirubin: patientData.biomarkers.bilirubin,
        albumin: patientData.biomarkers.albumin,
        alkaline_phosphatase: patientData.biomarkers.alp,
        gamma_glutamyl_transferase: patientData.biomarkers.ggt,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log("Diagnosis Result:", result.data);
      return {
        diagnosis: result.data.hcv_result,
        confidence: result.data.hcv_result.confidence,
        stage: result.data.hcv_result.predicted_stage,
        recommendations: result.data.recommendations || [],
      };
    } else {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error("Diagnosis failed:", error);
    throw error;
  }
}

// Usage
const patientData = {
  name: "John Doe",
  age: 45,
  sex: "Male",
  biomarkers: {
    alt: 55.0,
    ast: 48.0,
    bilirubin: 1.8,
    albumin: 3.5,
    alp: 120.0,
    ggt: 85.0,
  },
};

performDiagnosis(patientData)
  .then((result) => {
    console.log("Diagnosis completed:", result);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

## 🛠️ SDKs and Tools

### Official SDKs

- **JavaScript SDK**: Coming soon
- **Python SDK**: Coming soon

### Postman Collection

Import our Postman collection for easy API testing:

```json
{
  "info": {
    "name": "HepatoCAI API",
    "description": "Complete API collection for HepatoCAI platform"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{access_token}}",
        "type": "string"
      }
    ]
  }
}
```

### Interactive Documentation

- **Swagger UI**: `http://localhost:8000/api/docs/swagger/`
- **ReDoc**: `http://localhost:8000/api/docs/redoc/`
- **OpenAPI Schema**: `http://localhost:8000/api/schema/`

### Testing Tools

```bash
# API Testing with HTTPie
http POST localhost:8000/accounts/token/ email=user@example.com password=password123

# API Testing with curl
curl -X POST http://localhost:8000/accounts/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## 🔧 Webhooks

### Future Implementation

Webhooks will be available in future versions for:

- User registration events
- Diagnosis completion notifications
- System health alerts
- Data export completion

## 📊 Monitoring and Analytics

### Request Tracking

All API requests are logged with:

- Request ID for tracking
- User information
- Endpoint accessed
- Response time
- Status code

### Performance Metrics

- Average response time: < 200ms
- 99th percentile: < 500ms
- Uptime: 99.9%
- Error rate: < 0.1%

## 🆘 Support

### API Support

- **Documentation**: Check this guide first
- **Interactive Testing**: Use Swagger UI
- **GitHub Issues**: Report bugs and request features
- **Email Support**: api-support@hepatocai.com

### Common Issues

#### Authentication Problems

- Ensure token is not expired
- Check Authorization header format
- Verify token has required permissions

#### Rate Limiting

- Implement exponential backoff
- Cache responses when possible
- Contact support for higher limits

#### CORS Issues

- Verify frontend URL is in CORS_ALLOWED_ORIGINS
- Check request headers and methods
- Use proper preflight requests

---

**Last Updated**: January 13, 2025

**API Version**: v1.0.0

For more information, visit our [GitHub repository](https://github.com/username/HepatoCAI) or contact our support team.
