from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget, JSONWidget
from django.contrib.auth import get_user_model
from .models import HCVPatient, HCVResult

User = get_user_model()


class PatientWithResultResource(resources.ModelResource):
    """Resource for exporting complete diagnosis records with patient and result data"""

    # Patient information - direct attributes since model is HCVPatient
    patient_name = fields.Field(column_name="patient_name", attribute="patient_name")
    age = fields.Field(column_name="age", attribute="age")
    sex = fields.Field(column_name="sex", attribute="sex")
    created_by = fields.Field(column_name="created_by", attribute="created_by")

    # Lab values - direct attributes
    alp = fields.Field(column_name="alp", attribute="alp")
    ast = fields.Field(column_name="ast", attribute="ast")
    che = fields.Field(column_name="che", attribute="che")
    crea = fields.Field(column_name="crea", attribute="crea")
    ggt = fields.Field(column_name="ggt", attribute="ggt")
    alb = fields.Field(column_name="alb", attribute="alb")
    bil = fields.Field(column_name="bil", attribute="bil")
    chol = fields.Field(column_name="chol", attribute="chol")
    prot = fields.Field(column_name="prot", attribute="prot")
    alt = fields.Field(column_name="alt", attribute="alt")

    # Results - accessing through hcv_result relationship
    hcv_status = fields.Field(
        column_name="hcv_status", attribute="hcv_result__hcv_status"
    )
    hcv_status_probability = fields.Field(
        column_name="hcv_probability", attribute="hcv_result__hcv_status_probability"
    )
    hcv_risk = fields.Field(column_name="hcv_risk", attribute="hcv_result__hcv_risk")
    hcv_stage = fields.Field(column_name="hcv_stage", attribute="hcv_result__hcv_stage")
    confidence = fields.Field(
        column_name="confidence", attribute="hcv_result__confidence"
    )
    recommendation = fields.Field(
        column_name="recommendation", attribute="hcv_result__recommendation"
    )
    # Stage predictions as JSON
    stage_predictions = fields.Field(
        column_name="stage_predictions",
        attribute="hcv_result__stage_predictions",
        widget=JSONWidget(),
    )

    # Symptoms from patient - direct attribute
    symptoms = fields.Field(
        column_name="symptoms", attribute="symptoms", widget=JSONWidget()
    )

    class Meta:
        model = HCVPatient
        fields = (
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
            "hcv_status",
            "hcv_status_probability",
            "hcv_risk",
            "hcv_stage",
            "confidence",
            "stage_predictions",
            "recommendation",
        )
        export_order = fields

    def before_import_row(self, row, **kwargs):
        # You can add custom logic here before importing each row
        pass

    def after_import_row(self, row, row_result, **kwargs):
        # You can add custom logic here after importing each row
        pass

    def dehydrate_hcv_status(self, patient):
        """Handle cases where hcv_result might not exist"""
        return (
            getattr(patient.hcv_result, "hcv_status", None)
            if hasattr(patient, "hcv_result") and patient.hcv_result
            else None
        )

    def dehydrate_hcv_status_probability(self, patient):
        """Handle cases where hcv_result might not exist"""
        return (
            getattr(patient.hcv_result, "hcv_status_probability", None)
            if hasattr(patient, "hcv_result") and patient.hcv_result
            else None
        )

    def dehydrate_hcv_risk(self, patient):
        """Handle cases where hcv_result might not exist"""
        return (
            getattr(patient.hcv_result, "hcv_risk", None)
            if hasattr(patient, "hcv_result") and patient.hcv_result
            else None
        )

    def dehydrate_hcv_stage(self, patient):
        """Handle cases where hcv_result might not exist"""
        return (
            getattr(patient.hcv_result, "hcv_stage", None)
            if hasattr(patient, "hcv_result") and patient.hcv_result
            else None
        )

    def dehydrate_confidence(self, patient):
        """Handle cases where hcv_result might not exist"""
        return (
            getattr(patient.hcv_result, "confidence", None)
            if hasattr(patient, "hcv_result") and patient.hcv_result
            else None
        )

    def dehydrate_recommendation(self, patient):
        """Handle cases where hcv_result might not exist"""
        return (
            getattr(patient.hcv_result, "recommendation", None)
            if hasattr(patient, "hcv_result") and patient.hcv_result
            else None
        )

    def dehydrate_stage_predictions(self, patient):
        """Handle cases where hcv_result might not exist"""
        return (
            getattr(patient.hcv_result, "stage_predictions", None)
            if hasattr(patient, "hcv_result") and patient.hcv_result
            else None
        )

    def dehydrate_created_by(self, patient):
        """Ensure created_by exports the username or email"""
        if patient.created_by:
            # Return username if available, otherwise return email
            return patient.created_by.email or patient.created_by.full_name
        return None
