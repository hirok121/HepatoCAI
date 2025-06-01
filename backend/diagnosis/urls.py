from django.urls import path
from .views import (
    DiagnoseAPIView,
    ExportPatientsCSVView,
    ExportPatientsExcelView,
    UserDiagnosisAnalyticsView,
    AdminDiagnosisAnalyticsView,
    PatientListView,
    PatientSearchView,
    AdminPatientSearchView,
)

app_name = "diagnosis"

urlpatterns = [
    # Main diagnosis endpoint (POST: create, GET: list/get user's diagnoses, PUT: update, DELETE: delete)
    path("analyze-hcv/", DiagnoseAPIView.as_view(), name="diagnose"),
    # Get specific diagnosis by ID (now handled by DiagnoseAPIView)
    path("analyze-hcv/<int:pk>/", DiagnoseAPIView.as_view(), name="diagnose_detail"),
    # Analytics endpoints - separated for user and admin
    path(
        "analytics/user/", UserDiagnosisAnalyticsView.as_view(), name="user_analytics"
    ),
    path(
        "analytics/admin/",
        AdminDiagnosisAnalyticsView.as_view(),
        name="admin_analytics",
    ),  # Advanced features
    path("search/", PatientSearchView.as_view(), name="diagnosis_search"),
    path(
        "admin/search/", AdminPatientSearchView.as_view(), name="admin_diagnosis_search"
    ),
    # Admin management
    path("records/", PatientListView.as_view(), name="diagnosis_records_list"),
    # Export endpoints
    path("export/csv/", ExportPatientsCSVView.as_view(), name="export_csv"),
    path("export/excel/", ExportPatientsExcelView.as_view(), name="export_excel"),
]
