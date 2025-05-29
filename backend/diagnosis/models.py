from django.db import models
from django.conf import settings
from django.utils import timezone

# Create your models here.


class HCVPatient(models.Model):

    # Patient basic information
    patient_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    sex = models.CharField(max_length=10)

    # Laboratory values
    alp = models.FloatField(help_text="Alkaline Phosphatase")
    ast = models.FloatField(help_text="Aspartate Aminotransferase")
    che = models.FloatField(help_text="Cholinesterase")
    crea = models.FloatField(help_text="Creatinine")
    ggt = models.FloatField(help_text="Gamma-Glutamyl Transferase")

    alb = models.FloatField(help_text="Albumin", null=True, blank=True)
    bil = models.FloatField(help_text="Bilirubin", null=True, blank=True)
    chol = models.FloatField(help_text="Cholesterol", null=True, blank=True)
    prot = models.FloatField(help_text="Protein", null=True, blank=True)
    alt = models.FloatField(help_text="Alanine Aminotransferase", null=True, blank=True)

    # Symptoms - stored as JSON field for flexibility
    symptoms = models.JSONField(default=list, blank=True, help_text="List of symptoms")

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="hcv_patients"
    )

    class Meta:
        db_table = "hcv_patients"
        ordering = ["-created_at"]

    def __str__(self):
        return self.patient_name

    def get_gender_display_text(self):
        return "Male" if self.sex == "male" else "Female"
