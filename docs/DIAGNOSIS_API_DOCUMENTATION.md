# HepatoCAI Diagnosis API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Core Diagnosis Endpoints](#core-diagnosis-endpoints)
4. [Analytics Endpoints](#analytics-endpoints)
5. [Utility Endpoints](#utility-endpoints)
6. [Export Endpoints](#export-endpoints)
7. [Error Handling](#error-handling)
8. [Request/Response Examples](#request-response-examples)

## Overview

The HepatoCAI Diagnosis API provides comprehensive functionality for Hepatitis C virus (HCV) diagnosis, patient management, analytics, and data export. The API follows RESTful principles and returns JSON responses with standardized structure.

**Base URL:** `/api/diagnosis/`

**Standard Response Format:**

```json
{
  "status": "success|error",
  "message": "Descriptive message",
  "data": {}, // Response data
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Authentication

All endpoints require authentication unless specified otherwise. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

**Permission Levels:**

- **User**: Can access their own diagnosis records
- **Admin/Staff**: Can access all diagnosis records and admin-specific endpoints

## Core Diagnosis Endpoints

### 1. Create New Diagnosis

**Endpoint:** `POST /api/diagnosis/analyze-hcv/`
**Permission:** Authenticated users
**Description:** Creates a new diagnosis record with AI analysis

**Request Body:**

```json
{
  "patient_name": "John Doe",
  "age": 45,
  "sex": "male", // "male" or "female"
  "alp": 85.0, // Alkaline Phosphatase
  "ast": 40.0, // Aspartate Aminotransferase
  "che": 8.5, // Cholinesterase
  "crea": 1.2, // Creatinine
  "ggt": 35.0 // Gamma-Glutamyl Transferase
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Diagnosis completed successfully",
  "data": {
    "patient_id": 123,
    "patient_name": "John Doe",
    "age": 45,
    "sex": "male",
    "ALP": 85.0,
    "AST": 40.0,
    "CHE": 8.5,
    "CREA": 1.2,
    "GGT": 35.0,
    "diagnosis_result": {
      "hcv_status": "Positive",
      "hcv_status_probability": 0.8934,
      "hcv_risk": "High",
      "hcv_stage": "Class 2 (Fibrosis)",
      "confidence": 0.9234,
      "stage_predictions": {
        "Class 0 (Blood Donors)": 0.0234,
        "Class 1 (Hepatitis)": 0.1234,
        "Class 2 (Fibrosis)": 0.6234,
        "Class 3 (Cirrhosis)": 0.2298
      },
      "recommendation": "Immediate medical consultation recommended..."
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Get User's Diagnosis Records

**Endpoint:** `GET /api/diagnosis/analyze-hcv/`
**Permission:** Authenticated users
**Description:** Retrieves all diagnosis records created by the authenticated user

**Response:**

```json
{
  "status": "success",
  "message": "Diagnoses retrieved successfully",
  "data": [
    {
      "id": 123,
      "patient": {
        "id": 456,
        "patient_name": "John Doe",
        "age": 45,
        "sex": "male",
        "alp": 85.0,
        "ast": 40.0,
        "che": 8.5,
        "crea": 1.2,
        "ggt": 35.0,
        "created_at": "2024-01-15T10:30:00Z"
      },
      "result": {
        "hcv_status": "Positive",
        "hcv_status_probability": 0.8934,
        "hcv_risk": "High",
        "hcv_stage": "Class 2 (Fibrosis)",
        "confidence": 0.9234,
        "recommendation": "Immediate medical consultation recommended..."
      },
      "diagnosis_completed": true,
      "notes": null,
      "tags": null,
      "follow_up_date": null,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 3. Get Specific Diagnosis Record

**Endpoint:** `GET /api/diagnosis/analyze-hcv/{id}/`
**Permission:** Authenticated users (own records only)
**Description:** Retrieves a specific diagnosis record by ID

**Response:** Same as individual record in the list above

### 4. Update Diagnosis Record

**Endpoint:** `PUT /api/diagnosis/analyze-hcv/{id}/`
**Permission:** Authenticated users (own records only)
**Description:** Updates diagnosis record metadata (not the actual diagnosis)

**Request Body:**

```json
{
  "notes": "Patient reported improvement",
  "tags": "follow-up,improvement",
  "follow_up_date": "2024-02-15T10:00:00Z"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Diagnosis record updated successfully",
  "data": {
    // Updated diagnosis record
  }
}
```

### 5. Delete Diagnosis Record

**Endpoint:** `DELETE /api/diagnosis/analyze-hcv/{id}/`
**Permission:** Authenticated users (own records only)
**Description:** Deletes a specific diagnosis record

**Response:**

```json
{
  "status": "success",
  "message": "Diagnosis record deleted successfully"
}
```

## Analytics Endpoints

### 1. User Analytics

**Endpoint:** `GET /api/diagnosis/analytics/user/`
**Permission:** Authenticated users
**Description:** Comprehensive analytics for the authenticated user's diagnosis records

**Response:**

```json
{
  "status": "success",
  "message": "User analytics retrieved successfully",
  "data": {
    "total_diagnoses": 15,
    "recent_diagnoses": 3,
    "age_distribution": {
      "young": 5,
      "middle": 8,
      "elder": 2
    },
    "risk_distribution": {
      "high_risk": 4,
      "medium_risk": 7,
      "low_risk": 4
    },
    "hcv_status_distribution": {
      "positive": 6,
      "negative": 9
    },
    "stage_distribution": {
      "Class 0 (Blood Donors)": 9,
      "Class 1 (Hepatitis)": 3,
      "Class 2 (Fibrosis)": 2,
      "Class 3 (Cirrhosis)": 1
    },
    "gender_distribution": {
      "male": 8,
      "female": 7
    },
    "monthly_trends": [
      {
        "month": "2024-01",
        "count": 5
      },
      {
        "month": "2023-12",
        "count": 3
      }
    ],
    "average_confidence": 89.4,
    "latest_diagnosis": {
      "id": 123,
      "patient_name": "John Doe",
      "hcv_status": "Positive",
      "hcv_risk": "High",
      "created_at": "2024-01-15T10:30:00Z",
      "confidence": 0.9234
    },
    "health_insights": {
      "most_common_risk": "medium_risk",
      "diagnosis_frequency": "Regular"
    }
  }
}
```

### 2. Admin Analytics

**Endpoint:** `GET /api/diagnosis/analytics/admin/`
**Permission:** Admin/Staff users only
**Description:** Comprehensive system-wide analytics for administrators

**Response:**

```json
{
  "status": "success",
  "message": "Admin analytics retrieved successfully",
  "data": {
    "total_diagnoses": 1500,
    "total_users": 245,
    "recent_diagnoses": 125,
    "age_distribution": {
      "young": 450,
      "middle": 800,
      "elder": 250
    },
    "risk_distribution": {
      "high_risk": 300,
      "medium_risk": 750,
      "low_risk": 450
    },
    "hcv_status_distribution": {
      "positive": 600,
      "negative": 900
    },
    "stage_distribution": {
      "Class 0 (Blood Donors)": 900,
      "Class 1 (Hepatitis)": 300,
      "Class 2 (Fibrosis)": 200,
      "Class 3 (Cirrhosis)": 100
    },
    "gender_distribution": {
      "male": 800,
      "female": 700
    },
    "monthly_trends": [
      // 12 months of data
    ],
    "weekly_trends": [
      // 4 weeks of data
    ],
    "average_confidence": 91.2,
    "age_analysis": {
      "average_age": 45.3,
      "min_age": 18,
      "max_age": 89
    },
    "top_users": [
      {
        "patient__created_by__email": "doctor1@hospital.com",
        "patient__created_by__first_name": "Dr. Jane",
        "patient__created_by__last_name": "Smith",
        "diagnosis_count": 45
      }
    ],
    "system_health": {
      "total_records": 1500,
      "active_users": 245,
      "average_diagnosis_time": "2.3 minutes",
      "system_uptime": "99.9%"
    },
    "model_performance": {
      "accuracy": "96.73%",
      "precision": "95.2%",
      "recall": "94.8%",
      "f1_score": "95.0%"
    }
  }
}
```

## Utility Endpoints

### 1. Advanced Search

**Endpoint:** `GET /api/diagnosis/search/`
**Permission:** Authenticated users
**Description:** Advanced search and filtering for diagnosis records

**Query Parameters:**

- `hcv_status`: Filter by HCV status (Positive/Negative)
- `hcv_risk`: Filter by risk level (High/Medium/Low)
- `min_confidence`: Minimum confidence score (0.0-1.0)
- `max_confidence`: Maximum confidence score (0.0-1.0)
- `patient_name`: Search by patient name (partial match)
- `min_age`: Minimum patient age
- `max_age`: Maximum patient age
- `date_from`: Start date filter (ISO 8601 format)
- `date_to`: End date filter (ISO 8601 format)
- `order_by`: Sort field (-created_at, patient**age, result**confidence, etc.)
- `page`: Page number for pagination
- `page_size`: Number of results per page

**Example Request:**

```
GET /api/diagnosis/search/?hcv_status=Positive&min_confidence=0.8&page=1&page_size=10
```

**Response:**

```json
{
  "status": "success",
  "message": "Search completed successfully",
  "data": {
    "results": [
      // Array of diagnosis records matching criteria
    ],
    "pagination": {
      "count": 25,
      "page": 1,
      "page_size": 10,
      "has_next": true,
      "has_previous": false,
      "total_pages": 3
    },
    "filters_applied": {
      "hcv_status": "Positive",
      "min_confidence": "0.8"
      // Other applied filters
    }
  }
}
```

### 2. Quick Statistics

**Endpoint:** `GET /api/diagnosis/stats/`
**Permission:** Authenticated users
**Description:** Quick statistics for dashboard widgets

**Response:**

```json
{
  "status": "success",
  "message": "Quick stats retrieved successfully",
  "data": {
    "total_diagnoses": 15,
    "positive_diagnoses": 6,
    "high_risk_diagnoses": 4,
    "recent_activity": 3,
    "latest_diagnosis": {
      "id": 123,
      "patient_name": "John Doe",
      "hcv_status": "Positive",
      "date": "2024-01-15T10:30:00Z"
    },
    "quick_insights": {
      "positive_rate": 40.0,
      "high_risk_rate": 26.7,
      "activity_trend": "Active"
    }
  }
}
```

### 3. Admin Record List

**Endpoint:** `GET /api/diagnosis/records/`
**Permission:** Admin/Staff users only
**Description:** Get list of all diagnosis records for admin management

**Response:**

```json
{
  "status": "success",
  "data": [
    // Array of all diagnosis records with full details
  ],
  "count": 1500
}
```

## Export Endpoints

### 1. Export as CSV

**Endpoint:** `GET /api/diagnosis/export/csv/`
**Permission:** Authenticated users
**Description:** Export diagnosis records as CSV file

**Response:**

- Content-Type: `text/csv`
- File download with name: `diagnosis_records.csv`
- Users get their own data, staff gets all data

### 2. Export as Excel

**Endpoint:** `GET /api/diagnosis/export/excel/`
**Permission:** Authenticated users
**Description:** Export diagnosis records as Excel file

**Response:**

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- File download with name: `diagnosis_records.xlsx`
- Users get their own data, staff gets all data

## Error Handling

### Standard Error Response Format:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": {}, // Validation errors if applicable
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common HTTP Status Codes:

- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Examples:

**Validation Error (400):**

```json
{
  "status": "error",
  "message": "Invalid diagnosis data provided",
  "errors": {
    "age": ["This field is required."],
    "alp": ["Ensure this value is greater than 0."]
  }
}
```

**Permission Error (403):**

```json
{
  "status": "error",
  "message": "Only staff users can access admin analytics"
}
```

**Not Found Error (404):**

```json
{
  "status": "error",
  "message": "Diagnosis not found"
}
```

## Request/Response Examples

### Complete Diagnosis Creation Flow:

1. **Create Diagnosis:**

```bash
curl -X POST http://localhost:8000/api/diagnosis/analyze-hcv/ \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_name": "John Doe",
    "age": 45,
    "sex": "male",
    "alp": 85.0,
    "ast": 40.0,
    "che": 8.5,
    "crea": 1.2,
    "ggt": 35.0
  }'
```

2. **Get User Analytics:**

```bash
curl -X GET http://localhost:8000/api/diagnosis/analytics/user/ \
  -H "Authorization: Bearer your-jwt-token"
```

3. **Search Diagnoses:**

```bash
curl -X GET "http://localhost:8000/api/diagnosis/search/?hcv_status=Positive&min_confidence=0.8" \
  -H "Authorization: Bearer your-jwt-token"
```

4. **Export Data:**

```bash
curl -X GET http://localhost:8000/api/diagnosis/export/csv/ \
  -H "Authorization: Bearer your-jwt-token" \
  -O diagnosis_records.csv
```

## Rate Limiting

Currently, no rate limiting is implemented, but it's recommended to implement rate limiting for production use:

- General endpoints: 100 requests per minute per user
- Analytics endpoints: 20 requests per minute per user
- Export endpoints: 5 requests per minute per user

## Best Practices

1. **Always validate input data** before sending requests
2. **Handle errors gracefully** with appropriate user feedback
3. **Use pagination** for large datasets
4. **Cache analytics data** when possible
5. **Implement proper loading states** in UI
6. **Use optimistic updates** for better UX
7. **Validate permissions** on the frontend before making requests

---

**Last Updated:** January 2024
**API Version:** 1.0
**Documentation Version:** 1.0
