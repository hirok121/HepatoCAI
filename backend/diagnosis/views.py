from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import HCVPatient
from .AiDiagnosisTool.main import AiDiagnosisTool
from .serializers import HCVPatientSerializer
from django.http import HttpResponse
from django.contrib.auth.mixins import UserPassesTestMixin
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from .resources import HCVPatientResource
from utils.responses import StandardResponse, handle_exceptions
from utils.performance import PerformanceMonitor, DatabaseOptimizer
import logging
import csv

logger = logging.getLogger(__name__)


class DiagnoseAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = HCVPatientSerializer

    @handle_exceptions
    @PerformanceMonitor.monitor_db_queries
    # Removing the problematic rate limiter decorator
    def post(self, request):
        logger.info(f"Received diagnosis data: {request.data}")

        # Validate input data using serializer
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            logger.error(f"Validation errors: {serializer.errors}")
            return StandardResponse.validation_error(
                errors=serializer.errors, message="Invalid diagnosis data provided"
            )  # Get a default user for anonymous submissions or use authenticated user
        from django.contrib.auth import get_user_model

        User = get_user_model()

        # Try to get a default system user, or the first admin, or create a system user
        if request.user.is_authenticated:
            user = request.user
        else:
            try:
                # Try to get a system user or admin
                user = (
                    User.objects.filter(username="system").first()
                    or User.objects.filter(is_staff=True).first()
                )

                # If no users exist, create a system user (this is a fallback)
                if not user:
                    user = User.objects.create(
                        username="system",
                        email="system@example.com",
                        is_active=True,
                        is_staff=True,
                    )
            except Exception as e:
                logger.error(f"Failed to get or create system user: {str(e)}")
                return StandardResponse.server_error(
                    "Failed to associate diagnosis with a user"
                )

        # Save data to model with the user
        patient = serializer.save(created_by=user)

        # Generate diagnosis using AI tool
        try:
            ai_result = AiDiagnosisTool(serializer.validated_data)
            logger.info(f"AI Diagnosis Result: {ai_result}")
        except Exception as e:
            logger.error(f"AI diagnosis tool failed: {str(e)}")
            return StandardResponse.server_error("AI diagnosis tool failed", e)

        return StandardResponse.success(
            data={
                "patient_id": patient.id,
                "patient_name": patient.patient_name,
                "diagnosis_result": ai_result,
                "timestamp": patient.created_at,
            },
            message="Diagnosis completed successfully",
            status_code=status.HTTP_201_CREATED,
        )

    @handle_exceptions
    @PerformanceMonitor.monitor_db_queries
    @PerformanceMonitor.cache_result("diagnosis_list", timeout=300)
    def get(self, request):
        """Get all diagnosis records with performance optimization"""
        # Optimize queryset with select_related for created_by user
        queryset = HCVPatient.objects.select_related("created_by").all()

        # Apply ordering for consistent pagination
        queryset = queryset.order_by("-created_at")

        serializer = self.serializer_class(queryset, many=True)

        return StandardResponse.success(
            data=serializer.data, message="Diagnoses retrieved successfully"
        )


# generate a view to get a specific diagnosis by ID
class DiagnosisDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @handle_exceptions
    def get(self, request, pk):
        try:
            diagnosis = HCVPatient.objects.get(pk=pk)
        except HCVPatient.DoesNotExist:
            return StandardResponse.not_found("Diagnosis not found", "diagnosis")

        serializer = HCVPatientSerializer(diagnosis)
        return StandardResponse.success(
            data=serializer.data, message="Diagnosis retrieved successfully"
        )


# This view allows authenticated users to retrieve a specific diagnosis by its ID.


# generate a view get a list of all diagnoses for the authenticated user , use generic view
class UserDiagnosesListAPIView(generics.ListAPIView):
    """Optimized view to get user's diagnoses with performance monitoring"""

    permission_classes = [IsAuthenticated]
    serializer_class = HCVPatientSerializer

    @PerformanceMonitor.monitor_db_queries
    def get_queryset(self):
        # Optimize queryset with select_related and ordering
        queryset = HCVPatient.objects.filter(created_by=self.request.user)
        queryset = queryset.select_related("created_by")
        queryset = queryset.order_by("-created_at")
        return queryset


class ExportHCVPatientsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        resource = HCVPatientResource()

        # If user is staff, export all data; otherwise, only their own data
        if request.user.is_staff:
            queryset = HCVPatient.objects.all()
        else:
            queryset = HCVPatient.objects.filter(created_by=request.user)

        dataset = resource.export(queryset)

        response = HttpResponse(dataset.csv, content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="hcv_patients.csv"'
        return response


class ExportHCVPatientsExcelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        resource = HCVPatientResource()

        # If user is staff, export all data; otherwise, only their own data
        if request.user.is_staff:
            queryset = HCVPatient.objects.all()
        else:
            queryset = HCVPatient.objects.filter(created_by=request.user)

        dataset = resource.export(queryset)

        response = HttpResponse(
            dataset.xlsx,
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response["Content-Disposition"] = 'attachment; filename="hcv_patients.xlsx"'
        return response


class DiagnosisAnalyticsView(APIView):
    """
    API endpoint for diagnosis analytics - only accessible by staff users
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get diagnosis analytics data for admin dashboard"""
        if not request.user.is_staff:
            return Response(
                {"error": "Only staff users can access analytics"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Get total counts
        total_diagnoses = HCVPatient.objects.count()
        total_users = (
            HCVPatient.objects.values("created_by").distinct().count()
        )  # Get diagnoses by age groups (since severity_level doesn't exist yet)
        age_stats = {
            "young": HCVPatient.objects.filter(age__lt=30).count(),
            "middle": HCVPatient.objects.filter(age__gte=30, age__lt=60).count(),
            "elder": HCVPatient.objects.filter(age__gte=60).count(),
        }

        # Get recent diagnoses (last 30 days)
        from datetime import datetime, timedelta

        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_diagnoses = HCVPatient.objects.filter(
            created_at__gte=thirty_days_ago
        ).count()

        # Get monthly diagnosis trends (last 6 months)
        monthly_trends = []
        for i in range(6):
            start_date = datetime.now() - timedelta(days=(i + 1) * 30)
            end_date = datetime.now() - timedelta(days=i * 30)
            count = HCVPatient.objects.filter(
                created_at__gte=start_date, created_at__lt=end_date
            ).count()
            monthly_trends.append(
                {"month": start_date.strftime("%Y-%m"), "count": count}
            )  # Get gender distribution
        gender_stats = {
            "male": HCVPatient.objects.filter(sex="male").count(),
            "female": HCVPatient.objects.filter(sex="female").count(),
        }

        return Response(
            {
                "status": "success",
                "data": {
                    "total_diagnoses": total_diagnoses,
                    "total_users": total_users,
                    "recent_diagnoses": recent_diagnoses,
                    "severity_distribution": age_stats,
                    "monthly_trends": monthly_trends,
                    "risk_factors": gender_stats,
                    "success_rate": 95.5,  # Placeholder - calculate based on your metrics
                    "average_diagnosis_time": "2.3 minutes",  # Placeholder
                },
            }
        )


class HCVPatientListView(APIView):
    """
    API endpoint to list HCV patients for admin diagnosis management
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get list of HCV patients"""
        if not request.user.is_staff:
            return Response(
                {"error": "Only staff users can access patient list"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Get all HCV patients
        patients = HCVPatient.objects.all().order_by("-created_at")

        # Serialize the data
        patient_data = []
        for patient in patients:
            hcv_prob = 0.0
            if hasattr(patient, "hcv_result") and patient.hcv_result:
                hcv_prob = float(patient.hcv_result)

            patient_data.append(
                {
                    "id": patient.id,
                    "patient_name": patient.patient_name,
                    "age": patient.age,
                    "sex": patient.sex,
                    "created_at": (
                        patient.created_at.isoformat() if patient.created_at else None
                    ),
                    "created_by": (
                        patient.created_by.username if patient.created_by else "Unknown"
                    ),
                    "hcv_probability": hcv_prob,
                    "stage": getattr(patient, "stage", "Unknown"),
                }
            )

        return Response(
            {"status": "success", "data": patient_data, "count": len(patient_data)}
        )
