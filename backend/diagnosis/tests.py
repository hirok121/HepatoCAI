from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock
import json
from .models import HCVPatient, HCVResult, DiagnosisRecord
from .serializers import HCVPatientSerializer, DiagnosisRecordSerializer

User = get_user_model()


class DiagnosisModelTests(TestCase):
    """Test cases for diagnosis models"""

    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpass123",
            first_name="Test",
            last_name="User",
        )

        self.patient_data = {
            "patient_name": "John Doe",
            "age": 45,
            "sex": "Male",
            "alp": 120,
            "ast": 35,
            "che": 7000,
            "crea": 1.0,
            "ggt": 45,
            "alb": 4.2,
            "bil": 0.8,
            "chol": 200,
            "prot": 7.0,
            "alt": 40,
            "symptoms": ["Fatigue", "Nausea"],
        }

    def test_hcv_patient_creation(self):
        """Test HCVPatient model creation"""
        patient = HCVPatient.objects.create(created_by=self.user, **self.patient_data)

        self.assertEqual(patient.patient_name, "John Doe")
        self.assertEqual(patient.age, 45)
        self.assertEqual(patient.created_by, self.user)
        self.assertIsNotNone(patient.created_at)

    def test_hcv_result_creation(self):
        """Test HCVResult model creation"""
        patient = HCVPatient.objects.create(created_by=self.user, **self.patient_data)

        result = HCVResult.objects.create(
            patient=patient,
            hcv_status="Positive",
            hcv_status_probability=0.85,
            hcv_risk="High",
            hcv_stage="Class 2 (Fibrosis)",
            confidence=0.92,
            stage_predictions={
                "class_0": 0.1,
                "class_1": 0.2,
                "class_2": 0.6,
                "class_3": 0.1,
            },
            recommendation="Further evaluation recommended",
        )

        self.assertEqual(result.patient, patient)
        self.assertEqual(result.hcv_status, "Positive")
        self.assertEqual(result.confidence, 0.92)

    def test_diagnosis_record_creation(self):
        """Test DiagnosisRecord model creation"""
        patient = HCVPatient.objects.create(created_by=self.user, **self.patient_data)

        result = HCVResult.objects.create(
            patient=patient,
            hcv_status="Positive",
            hcv_status_probability=0.85,
            hcv_risk="High",
            hcv_stage="Class 2 (Fibrosis)",
            confidence=0.92,
            stage_predictions={},
            recommendation="Further evaluation recommended",
        )

        diagnosis = DiagnosisRecord.objects.create(
            patient=patient, result=result, diagnosis_completed=True
        )

        self.assertEqual(diagnosis.patient, patient)
        self.assertEqual(diagnosis.result, result)
        self.assertTrue(diagnosis.diagnosis_completed)
        self.assertIsNotNone(diagnosis.created_at)


class DiagnosisSerializerTests(TestCase):
    """Test cases for diagnosis serializers"""

    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com", password="testpass123"
        )

        self.valid_patient_data = {
            "patient_name": "Jane Smith",
            "age": 35,
            "sex": "Female",
            "alp": 100,
            "ast": 25,
            "che": 6500,
            "crea": 0.8,
            "ggt": 30,
            "symptoms": ["Fatigue"],
        }

    def test_hcv_patient_serializer_valid(self):
        """Test HCVPatientSerializer with valid data"""
        serializer = HCVPatientSerializer(data=self.valid_patient_data)
        self.assertTrue(serializer.is_valid())

    def test_hcv_patient_serializer_invalid_age(self):
        """Test HCVPatientSerializer with invalid age"""
        invalid_data = self.valid_patient_data.copy()
        invalid_data["age"] = -5

        serializer = HCVPatientSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("age", serializer.errors)

    def test_hcv_patient_serializer_missing_required(self):
        """Test HCVPatientSerializer with missing required fields"""
        incomplete_data = {
            "patient_name": "Test Patient",
            "age": 30,
            # Missing required fields
        }

        serializer = HCVPatientSerializer(data=incomplete_data)
        self.assertFalse(serializer.is_valid())


class DiagnosisAPITests(APITestCase):
    """Test cases for diagnosis API endpoints"""

    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpass123",
            first_name="Test",
            last_name="User",
        )

        self.other_user = User.objects.create_user(
            email="other@example.com", password="testpass123"
        )

        self.valid_diagnosis_data = {
            "patient_name": "Test Patient",
            "age": 45,
            "sex": "Male",
            "alp": 120,
            "ast": 35,
            "che": 7000,
            "crea": 1.0,
            "ggt": 45,
            "alb": 4.2,
            "bil": 0.8,
            "chol": 200,
            "prot": 7.0,
            "alt": 40,
            "symptoms": ["Fatigue", "Nausea"],
        }

        # Create test diagnosis records
        self.patient = HCVPatient.objects.create(
            created_by=self.user, **self.valid_diagnosis_data
        )

        self.result = HCVResult.objects.create(
            patient=self.patient,
            hcv_status="Positive",
            hcv_status_probability=0.85,
            hcv_risk="High",
            hcv_stage="Class 2 (Fibrosis)",
            confidence=0.92,
            stage_predictions={},
            recommendation="Further evaluation recommended",
        )

        self.diagnosis_record = DiagnosisRecord.objects.create(
            patient=self.patient, result=self.result, diagnosis_completed=True
        )

    def test_diagnosis_create_unauthorized(self):
        """Test creating diagnosis without authentication"""
        url = reverse("diagnosis:diagnose")
        response = self.client.post(url, self.valid_diagnosis_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("diagnosis.views.AiDiagnosisTool")
    def test_diagnosis_create_success(self, mock_ai_tool):
        """Test successful diagnosis creation"""
        # Mock AI tool response
        mock_ai_result = {
            "patient_name": "Test Patient",
            "age": 45,
            "sex": "Male",
            "ALP": 120,
            "AST": 35,
            "CHE": 7000,
            "CREA": 1.0,
            "GGT": 45,
            "hcv_status": "Positive",
            "hcv_status_probability": 0.85,
            "hcv_risk": "High",
            "hcv_stage": "Class 2 (Fibrosis)",
            "confidence": 0.92,
            "stage_predictions": {},
            "recommendation": "Further evaluation recommended",
        }
        mock_ai_tool.return_value = mock_ai_result

        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis:diagnose")
        response = self.client.post(url, self.valid_diagnosis_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("data", response.data)
        self.assertIn("patient_id", response.data["data"])
        self.assertEqual(response.data["data"]["patient_name"], "Test Patient")

    def test_diagnosis_create_invalid_data(self):
        """Test diagnosis creation with invalid data"""
        self.client.force_authenticate(user=self.user)
        invalid_data = self.valid_diagnosis_data.copy()
        invalid_data["age"] = -5  # Invalid age

        url = reverse("diagnosis:diagnose")
        response = self.client.post(url, invalid_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_diagnosis_list_success(self):
        """Test retrieving user's diagnosis records"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis:diagnose")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("data", response.data)
        self.assertEqual(len(response.data["data"]), 1)

    def test_diagnosis_list_user_isolation(self):
        """Test that users only see their own diagnosis records"""
        # Create diagnosis for other user
        other_patient = HCVPatient.objects.create(
            created_by=self.other_user, **self.valid_diagnosis_data
        )
        other_result = HCVResult.objects.create(
            patient=other_patient,
            hcv_status="Negative",
            hcv_status_probability=0.15,
            hcv_risk="Low",
            hcv_stage="Class 0 (Blood Donors)",
            confidence=0.88,
            stage_predictions={},
            recommendation="No further action needed",
        )
        DiagnosisRecord.objects.create(
            patient=other_patient, result=other_result, diagnosis_completed=True
        )

        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis:diagnose")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see own diagnosis, not other user's
        self.assertEqual(len(response.data["data"]), 1)

    def test_diagnosis_detail_success(self):
        """Test retrieving specific diagnosis record"""
        self.client.force_authenticate(user=self.user)
        url = reverse(
            "diagnosis:diagnose_detail", kwargs={"pk": self.diagnosis_record.pk}
        )
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("data", response.data)
        self.assertEqual(response.data["data"]["id"], self.diagnosis_record.pk)

    def test_diagnosis_detail_not_found(self):
        """Test retrieving non-existent diagnosis record"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis:diagnose_detail", kwargs={"pk": 99999})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_diagnosis_detail_unauthorized_access(self):
        """Test accessing another user's diagnosis record"""
        self.client.force_authenticate(user=self.other_user)
        url = reverse(
            "diagnosis:diagnose_detail", kwargs={"pk": self.diagnosis_record.pk}
        )
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_diagnosis_delete_success(self):
        """Test deleting own diagnosis record"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis:diagnose")
        response = self.client.delete(f"{url}?pk={self.diagnosis_record.pk}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(
            DiagnosisRecord.objects.filter(pk=self.diagnosis_record.pk).exists()
        )

    def test_diagnosis_delete_unauthorized(self):
        """Test deleting another user's diagnosis record"""
        self.client.force_authenticate(user=self.other_user)
        url = reverse("diagnosis:diagnose")
        response = self.client.delete(f"{url}?pk={self.diagnosis_record.pk}")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(
            DiagnosisRecord.objects.filter(pk=self.diagnosis_record.pk).exists()
        )

    def test_diagnosis_update_success(self):
        """Test updating diagnosis record metadata"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis:diagnose")
        update_data = {"notes": "Updated notes", "tags": "urgent,follow-up"}

        response = self.client.put(
            f"{url}?pk={self.diagnosis_record.pk}", update_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)


class DiagnosisAnalyticsTests(APITestCase):
    """Test cases for diagnosis analytics"""

    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            email="admin@example.com", password="testpass123", is_staff=True
        )

        self.regular_user = User.objects.create_user(
            email="user@example.com", password="testpass123"
        )

    def test_user_analytics_access(self):
        """Test user analytics access for regular users"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse("diagnosis:user_analytics")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("data", response.data)

    def test_admin_analytics_staff_access(self):
        """Test admin analytics access for staff users"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse("diagnosis:admin_analytics")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("data", response.data)

    def test_admin_analytics_regular_user_denied(self):
        """Test admin analytics access denied for regular users"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse("diagnosis:admin_analytics")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class DiagnosisExportTests(APITestCase):
    """Test cases for diagnosis export functionality"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com", password="testpass123"
        )

    def test_export_csv_success(self):
        """Test CSV export functionality"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis:export_csv")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Type"], "text/csv")

    def test_export_excel_success(self):
        """Test Excel export functionality"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis:export_excel")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response["Content-Type"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )


class DiagnosisUtilityTests(APITestCase):
    """Test cases for new diagnosis utility views"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="test@example.com", password="testpass123"
        )

        # Create test data
        self.patient_data = {
            "patient_name": "Test Patient",
            "age": 45,
            "sex": "Male",
            "alp": 120,
            "ast": 35,
            "che": 7000,
            "crea": 1.0,
            "ggt": 45,
            "alb": 4.2,
            "bil": 0.8,
            "chol": 200,
            "prot": 7.0,
            "alt": 40,
            "symptoms": ["Fatigue"],
        }  # Create test diagnosis records
        self.patient1 = HCVPatient.objects.create(
            created_by=self.user, **self.patient_data
        )
        self.result1 = HCVResult.objects.create(
            patient=self.patient1,
            hcv_status="Positive",
            hcv_status_probability=0.92,
            hcv_risk="High",
            hcv_stage="Class 2 (Fibrosis)",
            confidence=0.92,
            stage_predictions={
                "Class 0 (Blood Donors)": 0.05,
                "Class 1 (Hepatitis)": 0.15,
                "Class 2 (Fibrosis)": 0.70,
                "Class 3 (Cirrhosis)": 0.10,
            },
            recommendation="High probability of HCV infection detected.",
        )
        self.diagnosis1 = DiagnosisRecord.objects.create(
            patient=self.patient1, result=self.result1
        )

        self.patient2 = HCVPatient.objects.create(
            created_by=self.user,
            patient_name="Test Patient 2",
            age=30,
            sex="Female",
            alp=80,
            ast=25,
            che=6000,
            crea=0.8,
            ggt=30,
        )
        self.result2 = HCVResult.objects.create(
            patient=self.patient2,
            hcv_status="Negative",
            hcv_status_probability=0.15,
            hcv_risk="Low",
            hcv_stage="Class 0 (Blood Donors)",
            confidence=0.88,
            stage_predictions={
                "Class 0 (Blood Donors)": 0.80,
                "Class 1 (Hepatitis)": 0.10,
                "Class 2 (Fibrosis)": 0.05,
                "Class 3 (Cirrhosis)": 0.05,
            },
            recommendation="Low probability of HCV infection. Continue regular monitoring.",
        )
        self.diagnosis2 = DiagnosisRecord.objects.create(
            patient=self.patient2, result=self.result2
        )

    def test_diagnosis_comparison_success(self):
        """Test successful diagnosis comparison"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis:diagnosis_comparison")
        data = {"diagnosis_ids": [self.diagnosis1.id, self.diagnosis2.id]}

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("data", response.data)
        self.assertEqual(len(response.data["data"]["diagnoses"]), 2)
        self.assertIn("trends", response.data["data"])

    def test_diagnosis_comparison_insufficient_data(self):
        """Test diagnosis comparison with insufficient data"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis:diagnosis_comparison")
        data = {"diagnosis_ids": [self.diagnosis1.id]}

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_diagnosis_search_success(self):
        """Test diagnosis search functionality"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis:diagnosis_search")

        response = self.client.get(url, {"hcv_status": "Positive", "page_size": 5})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("data", response.data)
        self.assertIn("results", response.data["data"])
        self.assertIn("pagination", response.data["data"])

    def test_diagnosis_stats_success(self):
        """Test diagnosis stats functionality"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis:diagnosis_stats")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("data", response.data)
        self.assertEqual(response.data["data"]["total_diagnoses"], 2)
        self.assertIn("quick_insights", response.data["data"])

    def test_diagnosis_bulk_actions_delete(self):
        """Test bulk delete functionality"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis:diagnosis_bulk_actions")
        data = {"action": "delete", "diagnosis_ids": [self.diagnosis2.id]}

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(DiagnosisRecord.objects.filter(id=self.diagnosis2.id).exists())

    def test_diagnosis_bulk_actions_invalid_action(self):
        """Test bulk actions with invalid action"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis:diagnosis_bulk_actions")
        data = {
            "action": "invalid_action",
            "diagnosis_ids": [self.diagnosis1.id],
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
