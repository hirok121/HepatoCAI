from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from diagnosis.models import HCVPatient, HCVResult, DiagnosisRecord

User = get_user_model()


class DiagnosisModelTests(TestCase):
    """Test cases for the new diagnosis models"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

    def test_hcv_patient_creation(self):
        """Test creating an HCV patient"""
        patient = HCVPatient.objects.create(
            patient_name="John Doe",
            age=45,
            sex="male",
            alp=120.5,
            ast=35.2,
            che=8.1,
            crea=1.2,
            ggt=25.3,
            created_by=self.user,
        )
        self.assertEqual(patient.patient_name, "John Doe")
        self.assertEqual(patient.age, 45)
        self.assertEqual(patient.created_by, self.user)

    def test_hcv_result_creation(self):
        """Test creating an HCV result linked to a patient"""
        patient = HCVPatient.objects.create(
            patient_name="Jane Doe",
            age=38,
            sex="female",
            alp=110.0,
            ast=28.5,
            che=7.8,
            crea=0.9,
            ggt=22.1,
            created_by=self.user,
        )

        result = HCVResult.objects.create(
            patient=patient,
            hcv_status="Positive",
            hcv_status_probability=0.85,
            hcv_risk="High",
            hcv_stage="Class 2 (Fibrosis)",
            confidence=0.92,
            stage_predictions={
                "Class 0 (Blood Donors)": 0.05,
                "Class 1 (Hepatitis)": 0.15,
                "Class 2 (Fibrosis)": 0.65,
                "Class 3 (Cirrhosis)": 0.15,
            },
            recommendation="Immediate consultation with hepatologist recommended.",
        )

        self.assertEqual(result.patient, patient)
        self.assertEqual(result.hcv_status, "Positive")
        self.assertEqual(result.hcv_risk, "High")

    def test_diagnosis_record_creation(self):
        """Test creating a complete diagnosis record"""
        patient = HCVPatient.objects.create(
            patient_name="Bob Smith",
            age=52,
            sex="male",
            alp=135.7,
            ast=42.1,
            che=6.9,
            crea=1.4,
            ggt=31.8,
            created_by=self.user,
        )

        result = HCVResult.objects.create(
            patient=patient,
            hcv_status="Negative",
            hcv_status_probability=0.15,
            hcv_risk="Low",
            hcv_stage="Class 0 (Blood Donors)",
            confidence=0.95,
            stage_predictions={
                "Class 0 (Blood Donors)": 0.85,
                "Class 1 (Hepatitis)": 0.10,
                "Class 2 (Fibrosis)": 0.03,
                "Class 3 (Cirrhosis)": 0.02,
            },
            recommendation="No immediate intervention required. Regular monitoring recommended.",
        )

        diagnosis_record = DiagnosisRecord.objects.create(
            patient=patient, result=result, diagnosis_completed=True
        )

        self.assertEqual(diagnosis_record.patient, patient)
        self.assertEqual(diagnosis_record.result, result)
        self.assertTrue(diagnosis_record.diagnosis_completed)

        # Test properties
        self.assertEqual(diagnosis_record.patient_name, "Bob Smith")
        self.assertEqual(diagnosis_record.age, 52)
        self.assertEqual(diagnosis_record.sex, "male")
        self.assertEqual(diagnosis_record.hcv_probability, 0.15)
        self.assertEqual(diagnosis_record.hcv_stage, "Class 0 (Blood Donors)")
        self.assertEqual(diagnosis_record.risk_level, "Low")


class DiagnosisAPITests(APITestCase):
    """Test cases for the diagnosis API endpoints"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.diagnosis_url = reverse("diagnose")

    def test_diagnose_requires_authentication(self):
        """Test that diagnosis endpoint requires authentication"""
        response = self.client.post(self.diagnosis_url, {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_diagnoses_requires_authentication(self):
        """Test that getting user diagnoses requires authentication"""
        url = reverse("user-diagnoses")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_diagnosis_analytics_requires_staff(self):
        """Test that analytics endpoint requires staff permissions"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis-analytics")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Test with staff user
        self.user.is_staff = True
        self.user.save()
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
