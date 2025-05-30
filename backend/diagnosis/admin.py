from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import HCVPatient, HCVResult, DiagnosisRecord
from .resources import HCVPatientResource, DiagnosisRecordResource


@admin.register(HCVPatient)
class HCVPatientAdmin(ImportExportModelAdmin):
    resource_class = HCVPatientResource

    list_display = ("patient_name", "age", "sex", "created_at", "created_by")
    list_filter = ("sex", "created_at", "created_by")
    search_fields = ("patient_name",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Basic Information", {"fields": ("patient_name", "age", "sex")}),
        (
            "Required Laboratory Values",
            {"fields": ("alp", "ast", "che", "crea", "ggt")},
        ),
        (
            "Optional Laboratory Values",
            {"fields": ("alb", "bil", "chol", "prot", "alt"), "classes": ("collapse",)},
        ),
        ("Clinical Data", {"fields": ("symptoms",)}),
        (
            "Metadata",
            {
                "fields": ("created_at", "updated_at", "created_by"),
                "classes": ("collapse",),
            },
        ),
    )

    def save_model(self, request, obj, form, change):
        if not change:  # If creating new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(HCVResult)
class HCVResultAdmin(admin.ModelAdmin):
    list_display = (
        "patient",
        "hcv_status",
        "hcv_risk",
        "hcv_stage",
        "confidence",
        "created_at",
    )
    list_filter = ("hcv_status", "hcv_risk", "hcv_stage", "created_at")
    search_fields = ("patient__patient_name",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Patient Reference", {"fields": ("patient",)}),
        (
            "Diagnosis Results",
            {
                "fields": (
                    "hcv_status",
                    "hcv_status_probability",
                    "hcv_risk",
                    "hcv_stage",
                    "confidence",
                )
            },
        ),
        (
            "AI Analysis",
            {
                "fields": ("stage_predictions", "recommendation"),
                "classes": ("collapse",),
            },
        ),
        (
            "Metadata",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )


@admin.register(DiagnosisRecord)
class DiagnosisRecordAdmin(ImportExportModelAdmin):
    resource_class = DiagnosisRecordResource

    list_display = (
        "patient_name",
        "age",
        "sex",
        "hcv_status",
        "hcv_risk",
        "diagnosis_completed",
        "created_at",
    )
    list_filter = (
        "diagnosis_completed",
        "result__hcv_status",
        "result__hcv_risk",
        "patient__sex",
        "created_at",
    )
    search_fields = ("patient__patient_name",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("References", {"fields": ("patient", "result")}),
        ("Diagnosis Status", {"fields": ("diagnosis_completed", "analysis_duration")}),
        (
            "Metadata",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def patient_name(self, obj):
        return obj.patient.patient_name

    patient_name.short_description = "Patient Name"

    def age(self, obj):
        return obj.patient.age

    age.short_description = "Age"

    def sex(self, obj):
        return obj.patient.sex

    sex.short_description = "Sex"

    def hcv_status(self, obj):
        return obj.result.hcv_status if obj.result else "N/A"

    hcv_status.short_description = "HCV Status"

    def hcv_risk(self, obj):
        return obj.result.hcv_risk if obj.result else "N/A"

    hcv_risk.short_description = "Risk Level"
