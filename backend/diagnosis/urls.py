from django.urls import path
from .views import (
    DiagnoseAPIView,
    DiagnosisDetailAPIView,
    UserDiagnosesListAPIView,
    ExportHCVPatientsView,
    ExportHCVPatientsExcelView,
    DiagnosisAnalyticsView,
    HCVPatientListView,
)


urlpatterns = [
    # Main diagnosis endpoint
    path("analyze-hcv/", DiagnoseAPIView.as_view(), name="diagnose"),
    # Get specific diagnosis by ID
    path(
        "diagnosis/<int:pk>/", DiagnosisDetailAPIView.as_view(), name="diagnosis-detail"
    ),
    # Get all diagnoses for authenticated user
    path("my-diagnoses/", UserDiagnosesListAPIView.as_view(), name="user-diagnoses"),
    # List all patients for admin (debugging)
    path("patients/", HCVPatientListView.as_view(), name="hcv-patients-list"),
    # Analytics endpoint for admin dashboard
    path("analytics/", DiagnosisAnalyticsView.as_view(), name="diagnosis-analytics"),
    # Export endpoints
    path(
        "export/csv/", ExportHCVPatientsView.as_view(), name="export_hcv_patients_csv"
    ),
    path(
        "export/excel/",
        ExportHCVPatientsExcelView.as_view(),
        name="export_hcv_patients_excel",
    ),
]
