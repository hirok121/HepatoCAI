from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.


class HCVPatient(models.Model):

    # Patient basic information
    patient_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(120)]
    )

    SEX_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    ]
    sex = models.CharField(max_length=10, choices=SEX_CHOICES)

    # Laboratory values
    alp = models.FloatField(
        help_text="Alkaline Phosphatase", validators=[MinValueValidator(0)]
    )
    ast = models.FloatField(
        help_text="Aspartate Aminotransferase", validators=[MinValueValidator(0)]
    )
    che = models.FloatField(
        help_text="Cholinesterase", validators=[MinValueValidator(0)]
    )
    crea = models.FloatField(help_text="Creatinine", validators=[MinValueValidator(0)])
    ggt = models.FloatField(
        help_text="Gamma-Glutamyl Transferase", validators=[MinValueValidator(0)]
    )

    alb = models.FloatField(
        help_text="Albumin", null=True, blank=True, validators=[MinValueValidator(0)]
    )
    bil = models.FloatField(
        help_text="Bilirubin", null=True, blank=True, validators=[MinValueValidator(0)]
    )
    chol = models.FloatField(
        help_text="Cholesterol",
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
    )
    prot = models.FloatField(
        help_text="Protein", null=True, blank=True, validators=[MinValueValidator(0)]
    )
    alt = models.FloatField(
        help_text="Alanine Aminotransferase",
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
    )

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
        return dict(self.SEX_CHOICES).get(self.sex, self.sex)

    def get_required_lab_values(self):
        """Return dict of required lab values"""
        return {
            "alp": self.alp,
            "ast": self.ast,
            "che": self.che,
            "crea": self.crea,
            "ggt": self.ggt,
        }

    def get_optional_lab_values(self):
        """Return dict of optional lab values that are not None"""
        optional = {}
        for field in ["alb", "bil", "chol", "prot", "alt"]:
            value = getattr(self, field)
            if value is not None:
                optional[field] = value
        return optional

    def is_complete_profile(self):
        """Check if all required fields are present"""
        required_fields = ["alp", "ast", "che", "crea", "ggt"]
        return all(getattr(self, field) is not None for field in required_fields)


class HCVResult(models.Model):
    """Model to store HCV diagnosis results from AI analysis"""

    # Reference to the patient (same ID)
    patient = models.OneToOneField(
        HCVPatient,
        on_delete=models.CASCADE,
        related_name="hcv_result",
        primary_key=True,
    )

    # Main diagnosis results with choices
    HCV_STATUS_CHOICES = [
        ("Positive", "Positive"),
        ("Negative", "Negative"),
        ("Inconclusive", "Inconclusive"),
    ]
    hcv_status = models.CharField(
        max_length=20, choices=HCV_STATUS_CHOICES, help_text="HCV diagnosis status"
    )

    hcv_status_probability = models.FloatField(
        help_text="Probability of HCV status",
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)],
    )

    RISK_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
    ]
    hcv_risk = models.CharField(
        max_length=20, choices=RISK_CHOICES, help_text="Risk level"
    )

    STAGE_CHOICES = [
        ("Blood donors", "Blood donors"),
        ("Hepatitis", "Hepatitis"),
        ("Fibrosis", "Fibrosis"),
        ("Cirrhosis", "Cirrhosis"),
    ]
    hcv_stage = models.CharField(
        max_length=50, choices=STAGE_CHOICES, help_text="Liver disease stage"
    )

    confidence = models.FloatField(
        help_text="Model confidence score",
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)],
    )

    # Stage predictions as JSON field
    stage_predictions = models.JSONField(help_text="Probability for each stage")

    # Clinical recommendation
    recommendation = models.TextField(help_text="AI-generated clinical recommendation")

    # Additional metadata for the complete diagnosis
    diagnosis_completed = models.BooleanField(default=True)
    analysis_duration = models.DurationField(
        null=True, blank=True, help_text="Time taken for analysis"
    )  # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "hcv_results"
        ordering = ["-created_at"]

    def __str__(self):
        return f"HCV Result for {self.patient.patient_name} - {self.hcv_status}"
