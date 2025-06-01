from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import HCVPatient, HCVResult
from .resources import PatientWithResultResource


@admin.register(HCVPatient)
class HCVPatientAdmin(ImportExportModelAdmin):
    resource_class = PatientWithResultResource

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
