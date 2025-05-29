# API Improvements and Documentation Suggestions

## 1. OpenAPI/Swagger Documentation

### Implementation Steps:

```bash
pip install django-spectacular
```

**Add to settings.py:**

```python
INSTALLED_APPS = [
    # ... existing apps
    'drf_spectacular',
]

REST_FRAMEWORK = {
    # ... existing settings
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'HepatoCAI API',
    'DESCRIPTION': 'AI-powered Hepatitis C diagnosis and analysis platform',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}
```

## 2. API Versioning

### URL Structure:

```python
# backend/urls.py
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/accounts/", include("users.urls")),
    path("api/v1/diagnosis/", include("diagnosis.urls")),
    path("api/v1/", include("api.urls")),  # Main API routes
    path("docs/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/swagger/", SpectacularSwaggerView.as_view(), name="swagger-ui"),
]
```

## 3. Enhanced Serializer Documentation

### Example:

```python
class HCVPatientSerializer(serializers.ModelSerializer):
    """
    Serializer for HCV Patient diagnosis data.

    This serializer handles patient information for hepatitis C virus
    analysis including laboratory values and demographic data.
    """

    class Meta:
        model = HCVPatient
        fields = '__all__'
        extra_kwargs = {
            'patient_name': {
                'help_text': 'Full name of the patient',
                'max_length': 100
            },
            'age': {
                'help_text': 'Patient age in years (0-150)',
                'min_value': 0,
                'max_value': 150
            },
            'alp': {
                'help_text': 'Alkaline Phosphatase level (U/L)',
                'min_value': 0
            }
        }
```

## 4. Request/Response Examples

### View Documentation:

```python
from drf_spectacular.utils import extend_schema, OpenApiExample

class DiagnoseAPIView(APIView):
    @extend_schema(
        summary="Analyze HCV Patient Data",
        description="Submit patient laboratory and demographic data for AI-powered hepatitis C analysis",
        examples=[
            OpenApiExample(
                'Valid Request',
                value={
                    "patient_name": "John Doe",
                    "age": 45,
                    "sex": "Male",
                    "alp": 85.5,
                    "ast": 32.0,
                    "che": 7500,
                    "crea": 1.2,
                    "ggt": 28.5
                }
            )
        ],
        responses={
            201: OpenApiExample(
                'Successful Analysis',
                value={
                    "status": "success",
                    "data": {
                        "patient_id": 123,
                        "diagnosis_result": {
                            "hcv_probability": 0.85,
                            "risk_level": "high",
                            "recommendations": ["Further testing recommended"]
                        }
                    }
                }
            )
        }
    )
    def post(self, request):
        # existing implementation
        pass
```
