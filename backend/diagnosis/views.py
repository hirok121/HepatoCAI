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
import logging
import csv  # Add this import

logger = logging.getLogger(__name__)  # Uncomment this line


class DiagnoseAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = HCVPatientSerializer

    def post(self, request):
        # Debug: Print incoming data
        # print(f"Received data: {request.data}")
        logger.info(f"Received data: {request.data}")  # Uncomment

        try:
            # Validate input data using serializer
            serializer = self.serializer_class(data=request.data)

            if not serializer.is_valid():
                # Debug: Print validation errors
                # print(f"Validation errors: {serializer.errors}")
                logger.error(f"Validation errors: {serializer.errors}")  # Uncomment

                return Response(
                    {
                        "status": "error",
                        "message": "Invalid data provided",
                        "errors": serializer.errors,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Save data to model
            patient = serializer.save(
                created_by=request.user if request.user.is_authenticated else None
            )

            # Generate diagnosis using AI tool
            ai_result = AiDiagnosisTool(serializer.validated_data)
            logger.info(f"AI Diagnosis Result: {ai_result}")  # Uncomment

            return Response(
                {
                    "status": "success",
                    "patient_id": patient.id,
                    "patient_name": patient.patient_name,
                    "diagnosis_result": ai_result,
                    "timestamp": patient.created_at,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            # print(f"Exception occurred: {str(e)}")
            logger.error(f"Exception occurred: {str(e)}")  # Uncomment
            return Response(
                {"status": "error", "message": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get(self, request):
        """Optional: Get all diagnosis records"""
        try:
            diagnoses = HCVPatient.objects.all()
            serializer = self.serializer_class(diagnoses, many=True)
            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# generate a view to get a specific diagnosis by ID
class DiagnosisDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can access

    def get(self, request, pk):
        try:
            diagnosis = HCVPatient.objects.get(pk=pk)
            serializer = HCVPatientSerializer(diagnosis)
            return Response(
                {"status": "success", "data": serializer.data},
                status=status.HTTP_200_OK,
            )
        except HCVPatient.DoesNotExist:
            return Response(
                {"status": "error", "message": "Diagnosis not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# This view allows authenticated users to retrieve a specific diagnosis by its ID.


# generate a view get a list of all diagnoses for the authenticated user , use generic view
class UserDiagnosesListAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = HCVPatientSerializer

    def get_queryset(self):
        # Return only the diagnoses created by the authenticated user
        return HCVPatient.objects.filter(created_by=self.request.user)


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
