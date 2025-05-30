from django.contrib.auth.models import User
from rest_framework import serializers
from .models import HCVPatient, HCVResult, DiagnosisRecord


class HCVPatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = HCVPatient
        fields = [
            "id",
            "patient_name",
            "age",
            "sex",
            "alp",
            "ast",
            "che",
            "crea",
            "ggt",
            "alb",
            "bil",
            "chol",
            "prot",
            "alt",
            "symptoms",
            "created_at",
            "updated_at",
            "created_by",
        ]
        extra_kwargs = {
            "created_by": {"read_only": True},
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            # Optional fields - can be null (removed allow_blank for FloatField)
            "alb": {"required": False, "allow_null": True},
            "bil": {"required": False, "allow_null": True},
            "chol": {"required": False, "allow_null": True},
            "prot": {"required": False, "allow_null": True},
            "alt": {"required": False, "allow_null": True},
            "symptoms": {"required": False},
        }

    def validate_alb(self, value):
        if value == "" or value is None:
            return None
        return value

    def validate_bil(self, value):
        if value == "" or value is None:
            return None
        return value

    def validate_chol(self, value):
        if value == "" or value is None:
            return None
        return value

    def validate_prot(self, value):
        if value == "" or value is None:
            return None
        return value

    def validate_alt(self, value):
        if value == "" or value is None:
            return None
        return value


class HCVResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = HCVResult
        fields = [
            "patient",
            "hcv_status",
            "hcv_status_probability",
            "hcv_risk",
            "hcv_stage",
            "confidence",
            "stage_predictions",
            "recommendation",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class DiagnosisRecordSerializer(serializers.ModelSerializer):
    """Serializer for the combined diagnosis record"""

    # Patient information
    patient_name = serializers.CharField(source="patient.patient_name", read_only=True)
    age = serializers.IntegerField(source="patient.age", read_only=True)
    sex = serializers.CharField(source="patient.sex", read_only=True)
    created_by_username = serializers.CharField(
        source="patient.created_by.username", read_only=True
    )

    # Lab values
    alp = serializers.FloatField(source="patient.alp", read_only=True)
    ast = serializers.FloatField(source="patient.ast", read_only=True)
    che = serializers.FloatField(source="patient.che", read_only=True)
    crea = serializers.FloatField(source="patient.crea", read_only=True)
    ggt = serializers.FloatField(source="patient.ggt", read_only=True)

    # Results
    hcv_status = serializers.CharField(source="result.hcv_status", read_only=True)
    hcv_status_probability = serializers.FloatField(
        source="result.hcv_status_probability", read_only=True
    )
    hcv_risk = serializers.CharField(source="result.hcv_risk", read_only=True)
    hcv_stage = serializers.CharField(source="result.hcv_stage", read_only=True)
    confidence = serializers.FloatField(source="result.confidence", read_only=True)
    stage_predictions = serializers.JSONField(
        source="result.stage_predictions", read_only=True
    )
    recommendation = serializers.CharField(
        source="result.recommendation", read_only=True
    )

    class Meta:
        model = DiagnosisRecord
        fields = [
            "id",
            "patient_name",
            "age",
            "sex",
            "created_by_username",
            "alp",
            "ast",
            "che",
            "crea",
            "ggt",
            "hcv_status",
            "hcv_status_probability",
            "hcv_risk",
            "hcv_stage",
            "confidence",
            "stage_predictions",
            "recommendation",
            "diagnosis_completed",
            "analysis_duration",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            "id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
