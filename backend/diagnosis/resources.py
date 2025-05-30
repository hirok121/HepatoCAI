from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget, JSONWidget
from django.contrib.auth import get_user_model
from .models import HCVPatient, DiagnosisRecord

User = get_user_model()


class HCVPatientResource(resources.ModelResource):
    # Custom field for user display
    created_by = fields.Field(
        column_name="created_by",
        attribute="created_by",
        widget=ForeignKeyWidget(User, "username"),
    )

    # Custom field for symptoms JSON
    symptoms = fields.Field(
        column_name="symptoms", attribute="symptoms", widget=JSONWidget()
    )

    # Custom field for gender display
    gender_display = fields.Field(column_name="gender_display", readonly=True)

    class Meta:
        model = HCVPatient
        fields = (
            "id",
            "patient_name",
            "age",
            "sex",
            "gender_display",
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
        )
        export_order = fields

    def dehydrate_gender_display(self, patient):
        return patient.get_gender_display_text()


class DiagnosisRecordResource(resources.ModelResource):
    """Resource for exporting complete diagnosis records with patient and result data"""

    # Patient information
    patient_name = fields.Field(
        column_name="patient_name", attribute="patient__patient_name"
    )
    age = fields.Field(column_name="age", attribute="patient__age")
    sex = fields.Field(column_name="sex", attribute="patient__sex")
    created_by = fields.Field(
        column_name="created_by",
        attribute="patient__created_by",
        widget=ForeignKeyWidget(User, "username"),
    )

    # Lab values
    alp = fields.Field(column_name="alp", attribute="patient__alp")
    ast = fields.Field(column_name="ast", attribute="patient__ast")
    che = fields.Field(column_name="che", attribute="patient__che")
    crea = fields.Field(column_name="crea", attribute="patient__crea")
    ggt = fields.Field(column_name="ggt", attribute="patient__ggt")
    alb = fields.Field(column_name="alb", attribute="patient__alb")
    bil = fields.Field(column_name="bil", attribute="patient__bil")
    chol = fields.Field(column_name="chol", attribute="patient__chol")
    prot = fields.Field(column_name="prot", attribute="patient__prot")
    alt = fields.Field(column_name="alt", attribute="patient__alt")

    # Results
    hcv_status = fields.Field(column_name="hcv_status", attribute="result__hcv_status")
    hcv_status_probability = fields.Field(
        column_name="hcv_probability", attribute="result__hcv_status_probability"
    )
    hcv_risk = fields.Field(column_name="hcv_risk", attribute="result__hcv_risk")
    hcv_stage = fields.Field(column_name="hcv_stage", attribute="result__hcv_stage")
    confidence = fields.Field(column_name="confidence", attribute="result__confidence")
    recommendation = fields.Field(
        column_name="recommendation", attribute="result__recommendation"
    )

    # Stage predictions as JSON
    stage_predictions = fields.Field(
        column_name="stage_predictions",
        attribute="result__stage_predictions",
        widget=JSONWidget(),
    )

    # Symptoms from patient
    symptoms = fields.Field(
        column_name="symptoms", attribute="patient__symptoms", widget=JSONWidget()
    )

    # Gender display
    gender_display = fields.Field(column_name="gender_display", readonly=True)

    class Meta:
        model = DiagnosisRecord
        fields = (
            "id",
            "patient_name",
            "age",
            "sex",
            "gender_display",
            "created_by",
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
        )
        export_order = fields

    def dehydrate_gender_display(self, diagnosis_record):
        return diagnosis_record.patient.get_gender_display_text()

    def before_import_row(self, row, **kwargs):
        # You can add custom logic here before importing each row
        pass

    def after_import_row(self, row, row_result, **kwargs):
        # You can add custom logic here after importing each row
        pass
