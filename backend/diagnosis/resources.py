from import_export import resources, fields
from import_export.widgets import ForeignKeyWidget, JSONWidget
from django.contrib.auth import get_user_model
from .models import HCVPatient

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

    def before_import_row(self, row, **kwargs):
        # You can add custom logic here before importing each row
        pass

    def after_import_row(self, row, row_result, **kwargs):
        # You can add custom logic here after importing each row
        pass
