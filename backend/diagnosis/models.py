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


class HCVResult(models.Model):
    """Model to store HCV diagnosis results from AI analysis"""

    # Reference to the patient (same ID)
    patient = models.OneToOneField(
        HCVPatient,
        on_delete=models.CASCADE,
        related_name="hcv_result",
        primary_key=True,
    )

    # Main diagnosis results
    hcv_status = models.CharField(max_length=20, help_text="Positive/Negative")
    hcv_status_probability = models.FloatField(help_text="Probability of HCV status")
    hcv_risk = models.CharField(max_length=20, help_text="High/Medium/Low")
    hcv_stage = models.CharField(max_length=50, help_text="Liver disease stage")
    confidence = models.FloatField(help_text="Model confidence score")

    # Stage predictions as JSON field
    stage_predictions = models.JSONField(help_text="Probability for each stage")

    # Clinical recommendation
    recommendation = models.TextField(help_text="AI-generated clinical recommendation")

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "hcv_results"
        ordering = ["-created_at"]

    def __str__(self):
        return f"HCV Result for {self.patient.patient_name} - {self.hcv_status}"


class DiagnosisRecord(models.Model):
    """Combined model that joins HCVPatient and HCVResult for export and analytics"""

    # References to both models
    patient = models.OneToOneField(
        HCVPatient, on_delete=models.CASCADE, related_name="diagnosis_record"
    )
    result = models.OneToOneField(
        HCVResult, on_delete=models.CASCADE, related_name="diagnosis_record"
    )

    # Additional metadata for the complete diagnosis
    diagnosis_completed = models.BooleanField(default=True)
    analysis_duration = models.DurationField(
        null=True, blank=True, help_text="Time taken for analysis"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "diagnosis_records"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Diagnosis Record for {self.patient.patient_name}"

    @property
    def patient_name(self):
        return self.patient.patient_name

    @property
    def age(self):
        return self.patient.age

    @property
    def sex(self):
        return self.patient.sex

    @property
    def created_by(self):
        return self.patient.created_by

    @property
    def hcv_probability(self):
        return self.result.hcv_status_probability

    @property
    def hcv_stage(self):
        return self.result.hcv_stage

    @property
    def risk_level(self):
        return self.result.hcv_risk
