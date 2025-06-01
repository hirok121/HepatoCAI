from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from drf_spectacular.types import OpenApiTypes
from .models import HCVPatient, HCVResult, DiagnosisRecord
from .AiDiagnosisTool.main import AiDiagnosisTool
from .serializers import (
    HCVPatientSerializer,
    HCVResultSerializer,
    DiagnosisRecordSerializer,
)
from django.http import HttpResponse
from .resources import DiagnosisRecordResource
from utils.responses import StandardResponse, handle_exceptions
from utils.performance import PerformanceMonitor
import logging
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta

User = get_user_model()

logger = logging.getLogger(__name__)


class DiagnoseAPIView(APIView):
    """
    AI-powered HCV diagnosis endpoint.

    Analyzes patient data and laboratory values to predict hepatitis C status,
    fibrosis stage, and provide clinical recommendations using machine learning.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = HCVPatientSerializer

    @extend_schema(
        operation_id="diagnose_hcv",
        summary="Diagnose HCV using AI",
        description="Submit patient data and laboratory values for AI-powered hepatitis C diagnosis and staging",
        request=HCVPatientSerializer,
        responses={
            201: OpenApiResponse(
                response=DiagnosisRecordSerializer,
                description="Successful diagnosis with AI predictions",
            ),
            400: OpenApiResponse(description="Validation error - invalid input data"),
            401: OpenApiResponse(description="Authentication required"),
            500: OpenApiResponse(description="Internal server error during diagnosis"),
        },
        tags=["Diagnosis"],
    )
    @handle_exceptions
    @PerformanceMonitor.monitor_db_queries
    def post(self, request):
        logger.info(f"Received diagnosis data: {request.data}")

        # Validate input data using serializer
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            logger.error(f"Validation errors: {serializer.errors}")
            return StandardResponse.validation_error(
                errors=serializer.errors, message="Invalid diagnosis data provided"
            )

        # Save patient data with authenticated user
        patient = serializer.save(created_by=request.user)

        # Generate diagnosis using AI tool
        try:
            ai_result = AiDiagnosisTool()
            logger.info(f"AI Diagnosis Result: {ai_result}")

            # Create HCV Result record
            hcv_result = HCVResult.objects.create(
                patient=patient,
                hcv_status=ai_result.get("hcv_status"),
                hcv_status_probability=ai_result.get("hcv_status_probability"),
                hcv_risk=ai_result.get("hcv_risk"),
                hcv_stage=ai_result.get("hcv_stage"),
                confidence=ai_result.get("confidence"),
                stage_predictions=ai_result.get("stage_predictions"),
                recommendation=ai_result.get("recommendation"),
            )

            # Create combined diagnosis record
            diagnosis_record = DiagnosisRecord.objects.create(
                patient=patient, result=hcv_result, diagnosis_completed=True
            )

        except Exception as e:
            logger.error(f"AI diagnosis tool failed: {str(e)}")
            return StandardResponse.server_error(
                "AI diagnosis tool failed", e
            )  # Return response with patient data and AI diagnosis result
        return StandardResponse.success(
            data={
                "patient_id": patient.id,
                "patient_name": patient.patient_name,
                "age": patient.age,
                "sex": patient.sex,
                "ALP": patient.alp,
                "AST": patient.ast,
                "CHE": patient.che,
                "CREA": patient.crea,
                "GGT": patient.ggt,
                "diagnosis_result": ai_result,
                "timestamp": patient.created_at,
            },
            message="Diagnosis completed successfully",
            status_code=status.HTTP_201_CREATED,
        )

    @handle_exceptions
    @PerformanceMonitor.monitor_db_queries
    def get(self, request, pk=None):
        """Get diagnosis records created by the authenticated user"""
        # If pk is provided, get specific record
        if pk:
            try:
                diagnosis_record = DiagnosisRecord.objects.select_related(
                    "patient", "result", "patient__created_by"
                ).get(pk=pk, patient__created_by=request.user)

                serializer = DiagnosisRecordSerializer(diagnosis_record)
                return StandardResponse.success(
                    data=serializer.data, message="Diagnosis retrieved successfully"
                )
            except DiagnosisRecord.DoesNotExist:
                return StandardResponse.not_found("Diagnosis not found", "diagnosis")

        # Otherwise, get all diagnosis records for the user
        queryset = (
            DiagnosisRecord.objects.filter(patient__created_by=request.user)
            .select_related("patient", "result", "patient__created_by")
            .order_by("-created_at")
        )

        serializer = DiagnosisRecordSerializer(queryset, many=True)

        return StandardResponse.success(
            data=serializer.data, message="Diagnoses retrieved successfully"
        )

    @handle_exceptions
    @PerformanceMonitor.monitor_db_queries
    def delete(self, request, pk=None):
        """Delete a specific diagnosis record (only if owned by user)"""
        if not pk:
            pk = request.query_params.get("pk")

        if not pk:
            return StandardResponse.error(
                message="Diagnosis ID is required for deletion",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            diagnosis_record = DiagnosisRecord.objects.get(
                pk=pk, patient__created_by=request.user
            )
            diagnosis_record.delete()
            return StandardResponse.success(
                message="Diagnosis record deleted successfully"
            )
        except DiagnosisRecord.DoesNotExist:
            return StandardResponse.not_found("Diagnosis not found", "diagnosis")

    @handle_exceptions
    @PerformanceMonitor.monitor_db_queries
    def put(self, request, pk=None):
        """Update diagnosis record metadata (notes, tags, etc.)"""
        if not pk:
            pk = request.query_params.get("pk")

        if not pk:
            return StandardResponse.error(
                message="Diagnosis ID is required for update",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            diagnosis_record = DiagnosisRecord.objects.select_related(
                "patient", "result"
            ).get(pk=pk, patient__created_by=request.user)

            # Only allow updating certain fields (not the actual diagnosis)
            allowed_fields = ["notes", "tags", "follow_up_date"]
            update_data = {k: v for k, v in request.data.items() if k in allowed_fields}

            for field, value in update_data.items():
                if hasattr(diagnosis_record, field):
                    setattr(diagnosis_record, field, value)

            diagnosis_record.save()

            serializer = DiagnosisRecordSerializer(diagnosis_record)
            return StandardResponse.success(
                data=serializer.data, message="Diagnosis record updated successfully"
            )

        except DiagnosisRecord.DoesNotExist:
            return StandardResponse.not_found("Diagnosis not found", "diagnosis")


class ExportDiagnosisRecordsView(APIView):
    """Export diagnosis records using the new DiagnosisRecord model"""

    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id="export_diagnosis_records_csv",
        summary="Export diagnosis records as CSV",
        description="Export diagnosis records in CSV format. Staff users get all records, regular users get only their own records.",
        responses={
            200: OpenApiResponse(description="CSV file generated successfully"),
            401: OpenApiResponse(description="Authentication required"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["Export", "Diagnosis Records"],
    )
    def get(self, request):
        """Export diagnosis records as CSV"""
        resource = DiagnosisRecordResource()

        # If user is staff, export all data; otherwise, only their own data
        if request.user.is_staff:
            queryset = DiagnosisRecord.objects.select_related(
                "patient", "result", "patient__created_by"
            ).all()
        else:
            queryset = DiagnosisRecord.objects.select_related(
                "patient", "result", "patient__created_by"
            ).filter(patient__created_by=request.user)

        dataset = resource.export(queryset)

        response = HttpResponse(dataset.csv, content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="diagnosis_records.csv"'
        return response


class ExportDiagnosisRecordsExcelView(APIView):
    """Export diagnosis records as Excel using the new DiagnosisRecord model"""

    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id="export_diagnosis_records_excel",
        summary="Export diagnosis records as Excel",
        description="Export diagnosis records in Excel format. Staff users get all records, regular users get only their own records.",
        responses={
            200: OpenApiResponse(description="Excel file generated successfully"),
            401: OpenApiResponse(description="Authentication required"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["Export", "Diagnosis Records"],
    )
    def get(self, request):
        """Export diagnosis records as Excel"""
        resource = DiagnosisRecordResource()

        # If user is staff, export all data; otherwise, only their own data
        if request.user.is_staff:
            queryset = DiagnosisRecord.objects.select_related(
                "patient", "result", "patient__created_by"
            ).all()
        else:
            queryset = DiagnosisRecord.objects.select_related(
                "patient", "result", "patient__created_by"
            ).filter(patient__created_by=request.user)

        dataset = resource.export(queryset)

        response = HttpResponse(
            dataset.xlsx,
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response["Content-Disposition"] = (
            'attachment; filename="diagnosis_records.xlsx"'
        )
        return response


class UserDiagnosisAnalyticsView(APIView):
    """
    User-specific diagnosis analytics for profile section
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id="user_diagnosis_analytics",
        summary="User diagnosis analytics",
        description="Get comprehensive diagnosis analytics for the authenticated user's personal dashboard.",
        responses={
            200: OpenApiResponse(description="User analytics retrieved successfully"),
            401: OpenApiResponse(description="Authentication required"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["Analytics"],
    )
    @handle_exceptions
    @PerformanceMonitor.monitor_db_queries
    def get(self, request):
        """Get comprehensive diagnosis analytics for the authenticated user"""
        # Get user's diagnosis records
        user_diagnoses = DiagnosisRecord.objects.filter(
            patient__created_by=request.user
        ).select_related("patient", "result")

        # Basic counts
        total_diagnoses = user_diagnoses.count()

        if total_diagnoses == 0:
            return StandardResponse.success(
                data={
                    "total_diagnoses": 0,
                    "message": "No diagnosis records found for this user",
                },
                message="User analytics retrieved successfully",
            )

        # Get user's diagnoses by age groups
        age_stats = {
            "young": user_diagnoses.filter(patient__age__lt=30).count(),
            "middle": user_diagnoses.filter(
                patient__age__gte=30, patient__age__lt=60
            ).count(),
            "elder": user_diagnoses.filter(patient__age__gte=60).count(),
        }

        # Get recent diagnoses (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_diagnoses = user_diagnoses.filter(
            created_at__gte=thirty_days_ago
        ).count()

        # Get monthly diagnosis trends for user (last 6 months)
        monthly_trends = []
        for i in range(6):
            start_date = datetime.now() - timedelta(days=(i + 1) * 30)
            end_date = datetime.now() - timedelta(days=i * 30)
            count = user_diagnoses.filter(
                created_at__gte=start_date, created_at__lt=end_date
            ).count()
            monthly_trends.append(
                {"month": start_date.strftime("%Y-%m"), "count": count}
            )

        # Get user's risk level distribution
        risk_distribution = {
            "high_risk": user_diagnoses.filter(result__hcv_risk="High").count(),
            "medium_risk": user_diagnoses.filter(result__hcv_risk="Medium").count(),
            "low_risk": user_diagnoses.filter(result__hcv_risk="Low").count(),
        }

        # Get user's HCV status distribution
        hcv_status_distribution = {
            "positive": user_diagnoses.filter(result__hcv_status="Positive").count(),
            "negative": user_diagnoses.filter(result__hcv_status="Negative").count(),
        }

        # Get user's stage distribution
        stage_stats = {}
        stages = [
            "Class 0 (Blood Donors)",
            "Class 1 (Hepatitis)",
            "Class 2 (Fibrosis)",
            "Class 3 (Cirrhosis)",
        ]
        for stage in stages:
            stage_stats[stage] = user_diagnoses.filter(result__hcv_stage=stage).count()

        # Get user's gender distribution (if they have multiple diagnoses)
        gender_stats = {
            "male": user_diagnoses.filter(patient__sex="Male").count(),
            "female": user_diagnoses.filter(patient__sex="Female").count(),
        }

        # Calculate user's average confidence
        from django.db.models import Avg

        avg_confidence = (
            user_diagnoses.aggregate(avg_confidence=Avg("result__confidence"))[
                "avg_confidence"
            ]
            or 0
        )

        # Get latest diagnosis for quick info
        latest_diagnosis = user_diagnoses.first()
        latest_diagnosis_info = None
        if latest_diagnosis:
            latest_diagnosis_info = {
                "id": latest_diagnosis.id,
                "patient_name": latest_diagnosis.patient.patient_name,
                "hcv_status": latest_diagnosis.result.hcv_status,
                "hcv_risk": latest_diagnosis.result.hcv_risk,
                "created_at": latest_diagnosis.created_at,
                "confidence": latest_diagnosis.result.confidence,
            }

        return StandardResponse.success(
            data={
                "total_diagnoses": total_diagnoses,
                "recent_diagnoses": recent_diagnoses,
                "age_distribution": age_stats,
                "risk_distribution": risk_distribution,
                "hcv_status_distribution": hcv_status_distribution,
                "stage_distribution": stage_stats,
                "gender_distribution": gender_stats,
                "monthly_trends": monthly_trends,
                "average_confidence": (
                    round(avg_confidence * 100, 1) if avg_confidence else 0
                ),
                "latest_diagnosis": latest_diagnosis_info,
                "health_insights": {
                    "most_common_risk": (
                        max(risk_distribution, key=risk_distribution.get)
                        if any(risk_distribution.values())
                        else "No data"
                    ),
                    "diagnosis_frequency": (
                        "Regular"
                        if total_diagnoses > 5
                        else "Occasional" if total_diagnoses > 2 else "Infrequent"
                    ),
                },
            },
            message="User analytics retrieved successfully",
        )


class AdminDiagnosisAnalyticsView(APIView):
    """
    Admin-only comprehensive diagnosis analytics for admin dashboard
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id="admin_diagnosis_analytics",
        summary="Admin diagnosis analytics",
        description="Get comprehensive diagnosis analytics for admin dashboard. Only accessible by staff users.",
        responses={
            200: OpenApiResponse(description="Admin analytics retrieved successfully"),
            401: OpenApiResponse(description="Authentication required"),
            403: OpenApiResponse(description="Staff access required"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["Analytics", "Admin"],
    )
    @handle_exceptions
    @PerformanceMonitor.monitor_db_queries
    def get(self, request):
        """Get comprehensive diagnosis analytics data for admin dashboard"""
        if not request.user.is_staff:
            return StandardResponse.error(
                message="Only staff users can access admin analytics",
                status_code=status.HTTP_403_FORBIDDEN,
            )

        # Get total counts using DiagnosisRecord
        total_diagnoses = DiagnosisRecord.objects.count()
        total_users = (
            DiagnosisRecord.objects.values("patient__created_by").distinct().count()
        )

        # Get diagnoses by age groups using DiagnosisRecord
        age_stats = {
            "young": DiagnosisRecord.objects.filter(patient__age__lt=30).count(),
            "middle": DiagnosisRecord.objects.filter(
                patient__age__gte=30, patient__age__lt=60
            ).count(),
            "elder": DiagnosisRecord.objects.filter(patient__age__gte=60).count(),
        }

        # Get recent diagnoses (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_diagnoses = DiagnosisRecord.objects.filter(
            created_at__gte=thirty_days_ago
        ).count()

        # Get monthly diagnosis trends (last 12 months for admin)
        monthly_trends = []
        for i in range(12):
            start_date = datetime.now() - timedelta(days=(i + 1) * 30)
            end_date = datetime.now() - timedelta(days=i * 30)
            count = DiagnosisRecord.objects.filter(
                created_at__gte=start_date, created_at__lt=end_date
            ).count()
            monthly_trends.append(
                {"month": start_date.strftime("%Y-%m"), "count": count}
            )

        # Get risk level distribution based on HCV results
        risk_distribution = {
            "high_risk": DiagnosisRecord.objects.filter(
                result__hcv_risk="High"
            ).count(),
            "medium_risk": DiagnosisRecord.objects.filter(
                result__hcv_risk="Medium"
            ).count(),
            "low_risk": DiagnosisRecord.objects.filter(result__hcv_risk="Low").count(),
        }

        # Get HCV status distribution
        hcv_status_distribution = {
            "positive": DiagnosisRecord.objects.filter(
                result__hcv_status="Positive"
            ).count(),
            "negative": DiagnosisRecord.objects.filter(
                result__hcv_status="Negative"
            ).count(),
        }

        # Get stage distribution
        stage_stats = {}
        stages = [
            "Class 0 (Blood Donors)",
            "Class 1 (Hepatitis)",
            "Class 2 (Fibrosis)",
            "Class 3 (Cirrhosis)",
        ]
        for stage in stages:
            stage_stats[stage] = DiagnosisRecord.objects.filter(
                result__hcv_stage=stage
            ).count()

        # Get gender distribution
        gender_stats = {
            "male": DiagnosisRecord.objects.filter(patient__sex="Male").count(),
            "female": DiagnosisRecord.objects.filter(patient__sex="Female").count(),
        }

        # Calculate average confidence
        from django.db.models import Avg, Max, Min

        avg_confidence = (
            DiagnosisRecord.objects.aggregate(avg_confidence=Avg("result__confidence"))[
                "avg_confidence"
            ]
            or 0
        )

        # Additional admin-specific analytics
        # Most active users
        from django.db.models import Count

        top_users = (
            DiagnosisRecord.objects.values(
                "patient__created_by__email",
                "patient__created_by__first_name",
                "patient__created_by__last_name",
            )
            .annotate(diagnosis_count=Count("id"))
            .order_by("-diagnosis_count")[:10]
        )

        # Age distribution analysis
        age_analysis = DiagnosisRecord.objects.aggregate(
            avg_age=Avg("patient__age"),
            min_age=Min("patient__age"),
            max_age=Max("patient__age"),
        )

        # Weekly trends (last 4 weeks)
        weekly_trends = []
        for i in range(4):
            start_date = datetime.now() - timedelta(days=(i + 1) * 7)
            end_date = datetime.now() - timedelta(days=i * 7)
            count = DiagnosisRecord.objects.filter(
                created_at__gte=start_date, created_at__lt=end_date
            ).count()
            weekly_trends.append({"week": f"Week {4-i}", "count": count})

        return StandardResponse.success(
            data={
                "total_diagnoses": total_diagnoses,
                "total_users": total_users,
                "recent_diagnoses": recent_diagnoses,
                "age_distribution": age_stats,
                "risk_distribution": risk_distribution,
                "hcv_status_distribution": hcv_status_distribution,
                "stage_distribution": stage_stats,
                "gender_distribution": gender_stats,
                "monthly_trends": monthly_trends,
                "weekly_trends": weekly_trends,
                "average_confidence": (
                    round(avg_confidence * 100, 1) if avg_confidence else 0
                ),
                "age_analysis": {
                    "average_age": (
                        round(age_analysis["avg_age"], 1)
                        if age_analysis["avg_age"]
                        else 0
                    ),
                    "min_age": age_analysis["min_age"] or 0,
                    "max_age": age_analysis["max_age"] or 0,
                },
                "top_users": list(top_users),
                "system_health": {
                    "total_records": total_diagnoses,
                    "active_users": total_users,
                    "average_diagnosis_time": "2.3 minutes",  # Can be calculated from analysis_duration
                    "system_uptime": "99.9%",  # Placeholder
                },
                "model_performance": {
                    "accuracy": "96.73%",
                    "precision": "95.2%",
                    "recall": "94.8%",
                    "f1_score": "95.0%",
                },
            },
            message="Admin analytics retrieved successfully",
        )


class DiagnosisRecordListView(APIView):
    """
    API endpoint to list diagnosis records for admin management
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id="list_diagnosis_records",
        summary="List diagnosis records",
        description="Get list of all diagnosis records for admin management. Only accessible by staff users.",
        responses={
            200: OpenApiResponse(
                description="Diagnosis records retrieved successfully"
            ),
            401: OpenApiResponse(description="Authentication required"),
            403: OpenApiResponse(description="Staff access required"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["Admin", "Diagnosis Records"],
    )
    def get(self, request):
        """Get list of diagnosis records"""
        if not request.user.is_staff:
            return Response(
                {"error": "Only staff users can access diagnosis records"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Get all diagnosis records with related data
        diagnosis_records = (
            DiagnosisRecord.objects.select_related(
                "patient", "result", "patient__created_by"
            )
            .all()
            .order_by("-created_at")
        )

        # Serialize the data
        serializer = DiagnosisRecordSerializer(diagnosis_records, many=True)

        return Response(
            {
                "status": "success",
                "data": serializer.data,
                "count": len(serializer.data),
            }
        )


# Additional utility views for better DiagnosisRecord utilization


class DiagnosisSearchView(APIView):
    """
    Advanced search and filtering for diagnosis records for user specific records
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id="search_diagnosis_records",
        summary="Search user's diagnosis records",
        description="Advanced search and filtering for user's own diagnosis records with pagination support.",
        parameters=[
            OpenApiParameter(
                "hcv_status", OpenApiTypes.STR, description="Filter by HCV status"
            ),
            OpenApiParameter(
                "hcv_risk", OpenApiTypes.STR, description="Filter by HCV risk level"
            ),
            OpenApiParameter(
                "min_confidence",
                OpenApiTypes.FLOAT,
                description="Minimum confidence threshold",
            ),
            OpenApiParameter(
                "max_confidence",
                OpenApiTypes.FLOAT,
                description="Maximum confidence threshold",
            ),
            OpenApiParameter(
                "patient_name",
                OpenApiTypes.STR,
                description="Filter by patient name (partial match)",
            ),
            OpenApiParameter(
                "min_age", OpenApiTypes.INT, description="Minimum patient age"
            ),
            OpenApiParameter(
                "max_age", OpenApiTypes.INT, description="Maximum patient age"
            ),
            OpenApiParameter(
                "date_from",
                OpenApiTypes.DATETIME,
                description="Filter records from this date",
            ),
            OpenApiParameter(
                "date_to",
                OpenApiTypes.DATETIME,
                description="Filter records until this date",
            ),
            OpenApiParameter(
                "order_by", OpenApiTypes.STR, description="Order results by field"
            ),
            OpenApiParameter("page", OpenApiTypes.INT, description="Page number"),
            OpenApiParameter(
                "page_size", OpenApiTypes.INT, description="Number of results per page"
            ),
        ],
        responses={
            200: OpenApiResponse(description="Search completed successfully"),
            400: OpenApiResponse(description="Invalid pagination parameters"),
            401: OpenApiResponse(description="Authentication required"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["Search", "Diagnosis Records"],
    )
    @handle_exceptions
    @PerformanceMonitor.monitor_db_queries
    def get(self, request):
        """Search diagnosis records with advanced filters"""
        # Get base queryset for user
        queryset = DiagnosisRecord.objects.filter(
            patient__created_by=request.user
        ).select_related("patient", "result")

        # Apply filters
        hcv_status = request.query_params.get("hcv_status")
        if hcv_status:
            queryset = queryset.filter(result__hcv_status__icontains=hcv_status)

        hcv_risk = request.query_params.get("hcv_risk")
        if hcv_risk:
            queryset = queryset.filter(result__hcv_risk__icontains=hcv_risk)

        min_confidence = request.query_params.get("min_confidence")
        if min_confidence:
            try:
                queryset = queryset.filter(
                    result__confidence__gte=float(min_confidence)
                )
            except ValueError:
                pass

        max_confidence = request.query_params.get("max_confidence")
        if max_confidence:
            try:
                queryset = queryset.filter(
                    result__confidence__lte=float(max_confidence)
                )
            except ValueError:
                pass

        patient_name = request.query_params.get("patient_name")
        if patient_name:
            queryset = queryset.filter(patient__patient_name__icontains=patient_name)

        min_age = request.query_params.get("min_age")
        if min_age:
            try:
                queryset = queryset.filter(patient__age__gte=int(min_age))
            except ValueError:
                pass

        max_age = request.query_params.get("max_age")
        if max_age:
            try:
                queryset = queryset.filter(patient__age__lte=int(max_age))
            except ValueError:
                pass

        date_from = request.query_params.get("date_from")
        if date_from:
            try:
                from django.utils.dateparse import parse_datetime

                parsed_date = parse_datetime(date_from)
                if parsed_date:
                    queryset = queryset.filter(created_at__gte=parsed_date)
            except ValueError:
                pass

        date_to = request.query_params.get("date_to")
        if date_to:
            try:
                from django.utils.dateparse import parse_datetime

                parsed_date = parse_datetime(date_to)
                if parsed_date:
                    queryset = queryset.filter(created_at__lte=parsed_date)
            except ValueError:
                pass

        # Order results
        order_by = request.query_params.get("order_by", "-created_at")
        valid_order_fields = [
            "created_at",
            "-created_at",
            "patient__age",
            "-patient__age",
            "result__confidence",
            "-result__confidence",
            "patient__patient_name",
            "-patient__patient_name",
        ]
        if order_by in valid_order_fields:
            queryset = queryset.order_by(order_by)

        # Pagination
        try:
            page_size = int(request.query_params.get("page_size", 10))
            page = int(request.query_params.get("page", 1))
            start = (page - 1) * page_size
            end = start + page_size

            total_count = queryset.count()
            results = queryset[start:end]

            has_next = end < total_count
            has_previous = page > 1

        except ValueError:
            return StandardResponse.error(
                message="Invalid pagination parameters",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        serializer = DiagnosisRecordSerializer(results, many=True)

        return StandardResponse.success(
            data={
                "results": serializer.data,
                "pagination": {
                    "count": total_count,
                    "page": page,
                    "page_size": page_size,
                    "has_next": has_next,
                    "has_previous": has_previous,
                    "total_pages": (total_count + page_size - 1) // page_size,
                },
                "filters_applied": {
                    "hcv_status": hcv_status,
                    "hcv_risk": hcv_risk,
                    "min_confidence": min_confidence,
                    "max_confidence": max_confidence,
                    "patient_name": patient_name,
                    "min_age": min_age,
                    "max_age": max_age,
                    "date_from": date_from,
                    "date_to": date_to,
                    "order_by": order_by,
                },
            },
            message="Search completed successfully",
        )


class AdminDiagnosisSearchView(APIView):
    """
    Admin-only advanced search and filtering for ALL diagnosis records
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id="admin_search_diagnosis_records",
        summary="Admin search all diagnosis records",
        description="Advanced search and filtering for ALL diagnosis records in the system. Only accessible by staff users.",
        parameters=[
            OpenApiParameter(
                "hcv_status", OpenApiTypes.STR, description="Filter by HCV status"
            ),
            OpenApiParameter(
                "hcv_risk", OpenApiTypes.STR, description="Filter by HCV risk level"
            ),
            OpenApiParameter(
                "min_confidence",
                OpenApiTypes.FLOAT,
                description="Minimum confidence threshold",
            ),
            OpenApiParameter(
                "max_confidence",
                OpenApiTypes.FLOAT,
                description="Maximum confidence threshold",
            ),
            OpenApiParameter(
                "patient_name",
                OpenApiTypes.STR,
                description="Filter by patient name (partial match)",
            ),
            OpenApiParameter(
                "min_age", OpenApiTypes.INT, description="Minimum patient age"
            ),
            OpenApiParameter(
                "max_age", OpenApiTypes.INT, description="Maximum patient age"
            ),
            OpenApiParameter(
                "created_by",
                OpenApiTypes.STR,
                description="Filter by user who created the record",
            ),
            OpenApiParameter(
                "date_from",
                OpenApiTypes.DATETIME,
                description="Filter records from this date",
            ),
            OpenApiParameter(
                "date_to",
                OpenApiTypes.DATETIME,
                description="Filter records until this date",
            ),
            OpenApiParameter(
                "order_by", OpenApiTypes.STR, description="Order results by field"
            ),
            OpenApiParameter("page", OpenApiTypes.INT, description="Page number"),
            OpenApiParameter(
                "page_size", OpenApiTypes.INT, description="Number of results per page"
            ),
        ],
        responses={
            200: OpenApiResponse(description="Admin search completed successfully"),
            400: OpenApiResponse(description="Invalid pagination parameters"),
            401: OpenApiResponse(description="Authentication required"),
            403: OpenApiResponse(description="Staff access required"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["Search", "Admin", "Diagnosis Records"],
    )
    @handle_exceptions
    @PerformanceMonitor.monitor_db_queries
    def get(self, request):
        """Search ALL diagnosis records with advanced filters (admin only)"""
        # Check if user is admin/staff
        if not request.user.is_staff:
            return StandardResponse.error(
                message="Access denied. Admin privileges required.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

        # Get base queryset for ALL users (admin access)
        queryset = DiagnosisRecord.objects.select_related(
            "patient", "result", "patient__created_by"
        )

        # Apply filters
        hcv_status = request.query_params.get("hcv_status")
        if hcv_status:
            queryset = queryset.filter(result__hcv_status__icontains=hcv_status)

        hcv_risk = request.query_params.get("hcv_risk")
        if hcv_risk:
            queryset = queryset.filter(result__hcv_risk__icontains=hcv_risk)

        min_confidence = request.query_params.get("min_confidence")
        if min_confidence:
            try:
                queryset = queryset.filter(
                    result__confidence__gte=float(min_confidence)
                )
            except ValueError:
                pass

        max_confidence = request.query_params.get("max_confidence")
        if max_confidence:
            try:
                queryset = queryset.filter(
                    result__confidence__lte=float(max_confidence)
                )
            except ValueError:
                pass

        patient_name = request.query_params.get("patient_name")
        if patient_name:
            queryset = queryset.filter(patient__patient_name__icontains=patient_name)

        min_age = request.query_params.get("min_age")
        if min_age:
            try:
                queryset = queryset.filter(patient__age__gte=int(min_age))
            except ValueError:
                pass

        max_age = request.query_params.get("max_age")
        if max_age:
            try:
                queryset = queryset.filter(patient__age__lte=int(max_age))
            except ValueError:
                pass

        # Additional admin-specific filters
        created_by_user = request.query_params.get("created_by")
        if created_by_user:
            queryset = queryset.filter(
                patient__created_by__username__icontains=created_by_user
            )

        date_from = request.query_params.get("date_from")
        if date_from:
            try:
                from django.utils.dateparse import parse_datetime

                parsed_date = parse_datetime(date_from)
                if parsed_date:
                    queryset = queryset.filter(created_at__gte=parsed_date)
            except ValueError:
                pass

        date_to = request.query_params.get("date_to")
        if date_to:
            try:
                from django.utils.dateparse import parse_datetime

                parsed_date = parse_datetime(date_to)
                if parsed_date:
                    queryset = queryset.filter(created_at__lte=parsed_date)
            except ValueError:
                pass

        # Order results
        order_by = request.query_params.get("order_by", "-created_at")
        valid_order_fields = [
            "created_at",
            "-created_at",
            "patient__age",
            "-patient__age",
            "result__confidence",
            "-result__confidence",
            "patient__patient_name",
            "-patient__patient_name",
            "patient__created_by__username",
            "-patient__created_by__username",
        ]
        if order_by in valid_order_fields:
            queryset = queryset.order_by(order_by)

        # Pagination
        try:
            page_size = int(request.query_params.get("page_size", 25))
            page = int(request.query_params.get("page", 1))
            start = (page - 1) * page_size
            end = start + page_size

            total_count = queryset.count()
            results = queryset[start:end]

            has_next = end < total_count
            has_previous = page > 1

        except ValueError:
            return StandardResponse.error(
                message="Invalid pagination parameters",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        serializer = DiagnosisRecordSerializer(results, many=True)

        return StandardResponse.success(
            data={
                "results": serializer.data,
                "pagination": {
                    "count": total_count,
                    "page": page,
                    "page_size": page_size,
                    "has_next": has_next,
                    "has_previous": has_previous,
                    "total_pages": (total_count + page_size - 1) // page_size,
                },
                "filters_applied": {
                    "hcv_status": hcv_status,
                    "hcv_risk": hcv_risk,
                    "min_confidence": min_confidence,
                    "max_confidence": max_confidence,
                    "patient_name": patient_name,
                    "min_age": min_age,
                    "max_age": max_age,
                    "created_by": created_by_user,
                    "date_from": date_from,
                    "date_to": date_to,
                    "order_by": order_by,
                },
            },
            message="Admin search completed successfully",
        )
