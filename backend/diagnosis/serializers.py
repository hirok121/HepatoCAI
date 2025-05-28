from django.contrib.auth.models import User
from rest_framework import serializers
from .models import HCVPatient


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
