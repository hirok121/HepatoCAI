"""
Integration tests for all API views and endpoints
"""

import json
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.cache import cache
from unittest.mock import patch, Mock

from diagnosis.models import HCVPatient
from diagnosis.serializers import HCVPatientSerializer

User = get_user_model()


class AuthenticationViewTests(TestCase):
    """Test authentication views (users app)"""

    def setUp(self):
        self.client = APIClient()
        cache.clear()

        self.valid_user_data = {
            "email": "testuser@example.com",
            "password": "TestPassword123!",
            "first_name": "Test",
            "last_name": "User",
        }

        # Create a test user
        self.user = User.objects.create_user(
            email="existing@example.com",
            password="ExistingPass123!",
            first_name="Existing",
            last_name="User",
        )
        self.user.is_active = True
        self.user.save()

    def test_user_registration_success(self):
        """Test successful user registration"""
        url = reverse("register-list")  # DRF router generates this
        response = self.client.post(url, self.valid_user_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "success")

        # Verify user was created
        self.assertTrue(
            User.objects.filter(email=self.valid_user_data["email"]).exists()
        )

    def test_user_registration_duplicate_email(self):
        """Test registration with existing email"""
        duplicate_data = self.valid_user_data.copy()
        duplicate_data["email"] = self.user.email

        url = reverse("register-list")
        response = self.client.post(url, duplicate_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["status"], "error")

    def test_user_registration_invalid_data(self):
        """Test registration with invalid data"""
        invalid_data = {
            "email": "invalid-email",  # Invalid email format
            "password": "123",  # Too short password
            "first_name": "",  # Empty name
        }

        url = reverse("register-list")
        response = self.client.post(url, invalid_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("errors", response.data)

    def test_user_login_success(self):
        """Test successful login"""
        url = reverse("login-list")
        login_data = {"email": self.user.email, "password": "ExistingPass123!"}

        response = self.client.post(url, login_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertIn("access_token", response.data["data"])
        self.assertIn("refresh_token", response.data["data"])

    def test_user_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        url = reverse("login-list")
        login_data = {"email": "wrong@example.com", "password": "wrongpassword"}

        response = self.client.post(url, login_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["status"], "error")

    def test_user_login_inactive_user(self):
        """Test login with inactive user"""
        inactive_user = User.objects.create_user(
            email="inactive@example.com", password="InactivePass123!"
        )
        inactive_user.is_active = False
        inactive_user.save()

        url = reverse("login-list")
        login_data = {"email": inactive_user.email, "password": "InactivePass123!"}

        response = self.client.post(url, login_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_check_email_exists(self):
        """Test email check endpoint"""
        url = reverse("check-email")
        data = {"email": self.user.email}

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertTrue(response.data["data"]["exists"])

    def test_check_email_not_exists(self):
        """Test email check for non-existing email"""
        url = reverse("check-email")
        data = {"email": "nonexistent@example.com"}

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["data"]["exists"])

    def test_registration_rate_limiting(self):
        """Test rate limiting on registration endpoint"""
        url = reverse("register-list")

        # Make multiple requests to trigger rate limiting
        for i in range(102):  # Exceeds api limit of 100/hour
            user_data = self.valid_user_data.copy()
            user_data["email"] = f"test{i}@example.com"
            response = self.client.post(url, user_data, format="json")

        # Last request should be rate limited
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
        self.assertEqual(response.data["error_code"], "RATE_LIMIT_EXCEEDED")

    def test_login_rate_limiting(self):
        """Test rate limiting on login endpoint"""
        url = reverse("login-list")
        login_data = {"email": self.user.email, "password": "wrongpassword"}

        # Make multiple failed login attempts
        for i in range(6):  # Exceeds login limit of 5/15min
            response = self.client.post(url, login_data, format="json")

        # Last attempt should be rate limited
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)


class DiagnosisViewTests(TestCase):
    """Test diagnosis views (diagnosis app)"""

    def setUp(self):
        self.client = APIClient()
        cache.clear()

        # Create test users
        self.regular_user = User.objects.create_user(
            email="user@example.com",
            password="UserPass123!",
            first_name="Regular",
            last_name="User",
        )

        self.staff_user = User.objects.create_user(
            email="staff@example.com",
            password="StaffPass123!",
            first_name="Staff",
            last_name="User",
            is_staff=True,
        )

        self.valid_patient_data = {
            "patient_name": "John Doe",
            "age": 45,
            "sex": "Male",
            "alt": 25.5,
            "ast": 30.0,
            "alp": 120.0,
            "bil": 1.2,
            "che": 5.5,
            "crea": 1.0,
            "ggt": 45.0,
            "alb": 4.0,
            "chol": 180.0,
            "prot": 7.2,
        }

        # Create a test diagnosis
        self.test_diagnosis = HCVPatient.objects.create(
            patient_name="Test Patient",
            age=35,
            sex="Female",
            alt=20.0,
            ast=25.0,
            created_by=self.regular_user,
        )

    @patch("diagnosis.views.AiDiagnosisTool")
    def test_diagnosis_creation_success_authenticated(self, mock_ai_tool):
        """Test successful diagnosis creation by authenticated user"""
        mock_ai_tool.return_value = {
            "hcv_probability": 0.15,
            "stage": "Low Risk",
            "recommendations": ["Regular monitoring"],
        }

        self.client.force_authenticate(user=self.regular_user)
        url = reverse("diagnose")

        response = self.client.post(url, self.valid_patient_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "success")
        self.assertIn("diagnosis_result", response.data["data"])
        self.assertIn("patient_id", response.data["data"])

        # Verify diagnosis was saved to database
        self.assertTrue(
            HCVPatient.objects.filter(
                patient_name=self.valid_patient_data["patient_name"]
            ).exists()
        )

    @patch("diagnosis.views.AiDiagnosisTool")
    def test_diagnosis_creation_success_anonymous(self, mock_ai_tool):
        """Test diagnosis creation by anonymous user (uses system user)"""
        mock_ai_tool.return_value = {"hcv_probability": 0.25, "stage": "Medium Risk"}

        url = reverse("diagnose")
        response = self.client.post(url, self.valid_patient_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "success")

    def test_diagnosis_creation_invalid_data(self):
        """Test diagnosis with invalid patient data"""
        invalid_data = self.valid_patient_data.copy()
        invalid_data["age"] = 200  # Invalid age
        invalid_data["sex"] = "Invalid"  # Invalid sex

        url = reverse("diagnose")
        response = self.client.post(url, invalid_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["status"], "error")
        self.assertIn("errors", response.data)

    def test_diagnosis_creation_missing_required_fields(self):
        """Test diagnosis with missing required fields"""
        incomplete_data = {
            "patient_name": "John Doe",
            # Missing age, sex, and other required fields
        }

        url = reverse("diagnose")
        response = self.client.post(url, incomplete_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("diagnosis.views.AiDiagnosisTool")
    def test_diagnosis_ai_tool_failure(self, mock_ai_tool):
        """Test diagnosis when AI tool fails"""
        mock_ai_tool.side_effect = Exception("AI tool failed")

        url = reverse("diagnose")
        response = self.client.post(url, self.valid_patient_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data["status"], "error")
        self.assertIn("AI diagnosis tool failed", response.data["message"])

    def test_diagnosis_detail_success(self):
        """Test retrieving specific diagnosis"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse("diagnosis-detail", kwargs={"pk": self.test_diagnosis.id})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertEqual(
            response.data["data"]["patient_name"], self.test_diagnosis.patient_name
        )

    def test_diagnosis_detail_not_found(self):
        """Test retrieving non-existent diagnosis"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse("diagnosis-detail", kwargs={"pk": 99999})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["status"], "error")

    def test_diagnosis_detail_unauthorized(self):
        """Test diagnosis detail access without authentication"""
        url = reverse("diagnosis-detail", kwargs={"pk": self.test_diagnosis.id})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_diagnoses_list_authenticated(self):
        """Test retrieving user's own diagnoses"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse("user-diagnoses")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)  # Should include test_diagnosis

    def test_user_diagnoses_list_unauthorized(self):
        """Test user diagnoses list without authentication"""
        url = reverse("user-diagnoses")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_diagnosis_analytics_staff_access(self):
        """Test analytics endpoint for staff users"""
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("diagnosis-analytics")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertIn("total_diagnoses", response.data["data"])
        self.assertIn("monthly_trends", response.data["data"])

    def test_diagnosis_analytics_regular_user_forbidden(self):
        """Test analytics endpoint forbidden for regular users"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse("diagnosis-analytics")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_export_csv_authenticated_user(self):
        """Test CSV export for authenticated user"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse("export_hcv_patients_csv")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Type"], "text/csv")
        self.assertIn("attachment", response["Content-Disposition"])

    def test_export_excel_staff_user(self):
        """Test Excel export for staff user"""
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("export_hcv_patients_excel")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response["Content-Type"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )

    def test_hcv_patients_list_staff_access(self):
        """Test patient list endpoint for staff"""
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("hcv-patients-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertIn("data", response.data)
        self.assertIn("count", response.data)

    def test_hcv_patients_list_regular_user_forbidden(self):
        """Test patient list forbidden for regular users"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse("hcv-patients-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class SecurityIntegrationTests(TestCase):
    """Test security features in actual views"""

    def setUp(self):
        self.client = APIClient()
        cache.clear()

    def test_xss_protection_in_registration(self):
        """Test XSS protection in registration endpoint"""
        malicious_data = {
            "email": "test@example.com",
            "password": "TestPass123!",
            "first_name": "<script>alert('xss')</script>",
            "last_name": "User",
        }

        url = reverse("register-list")
        response = self.client.post(url, malicious_data, format="json")

        # Should either reject or sanitize the input
        if response.status_code == status.HTTP_201_CREATED:
            # If accepted, should be sanitized
            user = User.objects.get(email=malicious_data["email"])
            self.assertNotIn("<script>", user.first_name)
        else:
            # Should be rejected with validation error
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_sql_injection_protection(self):
        """Test SQL injection protection in login"""
        sql_injection_data = {
            "email": "test@example.com' OR '1'='1",
            "password": "TestPass123!",
        }

        url = reverse("login-list")
        response = self.client.post(url, sql_injection_data, format="json")

        # Should not succeed with SQL injection
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_diagnosis_input_sanitization(self):
        """Test input sanitization in diagnosis endpoint"""
        malicious_patient_data = {
            "patient_name": "<script>alert('hack')</script>",
            "age": 45,
            "sex": "Male",
            "alt": 25.5,
            "ast": 30.0,
        }

        url = reverse("diagnose")
        response = self.client.post(url, malicious_patient_data, format="json")

        # Should either reject or sanitize
        if response.status_code == status.HTTP_201_CREATED:
            # Check that script tags were sanitized
            patient_id = response.data["data"]["patient_id"]
            patient = HCVPatient.objects.get(id=patient_id)
            self.assertNotIn("<script>", patient.patient_name)

    def test_unauthorized_access_patterns(self):
        """Test various unauthorized access attempts"""
        # Test accessing protected endpoints without authentication
        protected_urls = [
            reverse("users-list"),
            reverse("diagnosis-analytics"),
            reverse("hcv-patients-list"),
        ]

        for url in protected_urls:
            response = self.client.get(url)
            self.assertIn(
                response.status_code,
                [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN],
            )


class PerformanceIntegrationTests(TestCase):
    """Test performance features in actual views"""

    def setUp(self):
        self.client = APIClient()
        cache.clear()

        self.user = User.objects.create_user(
            email="perf@example.com", password="PerfPass123!"
        )

    def test_diagnosis_caching(self):
        """Test caching functionality in diagnosis views"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnose")

        # First request - should hit database
        response1 = self.client.get(url)

        # Second request - should use cache
        response2 = self.client.get(url)

        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        # Both should return same data
        self.assertEqual(response1.data, response2.data)

    def test_database_query_optimization(self):
        """Test database query optimization in user diagnoses"""
        self.client.force_authenticate(user=self.user)

        # Create multiple diagnoses for the user
        for i in range(5):
            HCVPatient.objects.create(
                patient_name=f"Patient {i}",
                age=30 + i,
                sex="Male",
                created_by=self.user,
            )

        url = reverse("user-diagnoses")

        # Monitor database queries (in real implementation)
        with self.assertNumQueries(2):  # Should be optimized to minimal queries
            response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 5)


if __name__ == "__main__":
    from django.test import main

    main()
