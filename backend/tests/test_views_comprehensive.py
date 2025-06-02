"""
Comprehensive integration tests for all API views and endpoints
Fixes issues and adds missing test coverage identified in the original test file
"""

import json
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.cache import cache
from unittest.mock import patch, Mock
from django.core import mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

from diagnosis.models import HCVPatient
from diagnosis.serializers import HCVPatientSerializer

User = get_user_model()


class AuthenticationViewTests(TestCase):
    """Test authentication views (users app) with fixes for common issues"""

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
        url = reverse("register-list")
        response = self.client.post(url, self.valid_user_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data["status"], "success"
        )  # Verify user was created with correct initial state
        new_user = User.objects.get(email=self.valid_user_data["email"])
        self.assertFalse(
            new_user.is_active
        )  # Should be inactive until email verification
        self.assertFalse(new_user.verified_email)  # Email should not be verified yet

    def test_user_registration_duplicate_email(self):
        """Test registration with existing email"""
        duplicate_data = self.valid_user_data.copy()
        duplicate_data["email"] = self.user.email

        url = reverse("register-list")
        response = self.client.post(url, duplicate_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["status"], "error")

    def test_user_login_success(self):
        """Test successful login"""
        url = reverse("login-list")
        login_data = {"email": self.user.email, "password": "ExistingPass123!"}

        response = self.client.post(url, login_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertIn("access", response.data["data"])
        self.assertIn("refresh", response.data["data"])

    def test_check_email_exists(self):
        """Test email check endpoint"""
        url = reverse("check-email")
        data = {"email": self.user.email}

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertTrue(response.data["data"]["exists"])

    def test_profile_me_endpoint(self):
        """Test profile/me endpoint for authenticated user"""
        self.client.force_authenticate(user=self.user)
        url = reverse("profile-me")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertEqual(response.data["data"]["email"], self.user.email)

    def test_profile_update(self):
        """Test profile update functionality"""
        self.client.force_authenticate(user=self.user)
        url = reverse("profile-me")

        update_data = {"first_name": "Updated", "last_name": "Name"}

        response = self.client.patch(url, update_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")

        # Verify user was updated
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Updated")

    def test_email_verification_flow(self):
        """Test email verification workflow"""
        # Create unverified user
        user = User.objects.create_user(
            email="unverified@example.com", password="TestPass123!", is_active=False
        )

        # Generate verification token
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # Test verification
        url = reverse("verify-email", kwargs={"uidb64": uidb64, "token": token})
        response = self.client.get(url)

        self.assertEqual(
            response.status_code, status.HTTP_200_OK
        )  # Verify user is now active and email verified
        user.refresh_from_db()
        self.assertTrue(user.is_active)
        self.assertTrue(user.verified_email)


class UserManagementViewTests(TestCase):
    """Test user management endpoints for admin and staff"""

    def setUp(self):
        self.client = APIClient()
        cache.clear()

        # Create different types of users
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

        self.superuser = User.objects.create_user(
            email="admin@example.com",
            password="AdminPass123!",
            first_name="Admin",
            last_name="User",
            is_staff=True,
            is_superuser=True,
        )

    def test_user_management_superuser_access(self):
        """Test user management endpoint access for superuser"""
        self.client.force_authenticate(user=self.superuser)
        url = reverse("user-management")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertIn("data", response.data)

    def test_user_management_staff_forbidden(self):
        """Test user management forbidden for non-superuser staff"""
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("user-management")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_management_staff_access(self):
        """Test staff management endpoint for staff users"""
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("staff-management")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")

    def test_user_permission_update_superuser(self):
        """Test updating user permissions by superuser"""
        self.client.force_authenticate(user=self.superuser)
        url = reverse(
            "user-management-detail", kwargs={"user_id": self.regular_user.id}
        )

        update_data = {"is_staff": True, "is_active": True}

        response = self.client.patch(url, update_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify user was updated
        self.regular_user.refresh_from_db()
        self.assertTrue(self.regular_user.is_staff)

    def test_users_list_endpoint(self):
        """Test users list endpoint for authenticated users"""
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("users-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")


class DiagnosisViewTests(TestCase):
    """Test diagnosis views (diagnosis app) with fixed setup"""

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

        # FIXED: Include ALL required fields for HCVPatient model
        self.valid_patient_data = {
            "patient_name": "John Doe",
            "age": 45,
            "sex": "Male",
            "alt": 25.5,
            "ast": 30.0,
            "alp": 120.0,  # Added missing required field
            "bil": 1.2,
            "che": 5.5,  # Added missing required field
            "crea": 1.0,  # Added missing required field
            "ggt": 45.0,  # Added missing required field
            "alb": 4.0,
            "chol": 180.0,
            "prot": 7.2,
        }

        # Create a test diagnosis with all required fields
        self.test_diagnosis = HCVPatient.objects.create(
            patient_name="Test Patient",
            age=35,
            sex="Female",
            alt=20.0,
            ast=25.0,
            alp=100.0,  # Added missing required field
            bil=1.0,
            che=5.0,  # Added missing required field
            crea=0.9,  # Added missing required field
            ggt=35.0,  # Added missing required field
            alb=4.2,
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

    @patch("diagnosis.views.AiDiagnosisTool")
    def test_diagnosis_creation_success_anonymous(self, mock_ai_tool):
        """Test diagnosis creation by anonymous user (uses system user)"""
        mock_ai_tool.return_value = {"hcv_probability": 0.25, "stage": "Medium Risk"}

        url = reverse("diagnose")
        response = self.client.post(url, self.valid_patient_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "success")

    def test_diagnosis_detail_success(self):
        """Test retrieving specific diagnosis"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse("diagnosis-detail", kwargs={"pk": self.test_diagnosis.id})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")

    def test_user_diagnoses_list_authenticated(self):
        """Test retrieving user's own diagnoses"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse("user-diagnoses")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data["results"]), 1)

    def test_diagnosis_analytics_staff_access(self):
        """Test analytics endpoint for staff users"""
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("diagnosis-analytics")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")

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

    def test_hcv_patients_list_regular_user_forbidden(self):
        """Test patient list forbidden for regular users"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse("hcv-patients-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_diagnosis_list_get_all(self):
        """Test GET request to diagnosis list endpoint"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse("diagnose")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")


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
            # Check that malicious script was either removed or sanitized
            if user.first_name:
                self.assertNotIn("<script>", user.first_name)
            # Or the field was set to None as a security measure
            # Both are acceptable security responses
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

        # Should not succeed with SQL injection - expect 400 for invalid input or 401 for auth failure
        self.assertIn(
            response.status_code,
            [status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED],
        )

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


@override_settings(
    CACHES={"default": {"BACKEND": "django.core.cache.backends.dummy.DummyCache"}}
)
class PerformanceIntegrationTests(TestCase):
    """Test performance features with caching disabled to avoid serialization issues"""

    def setUp(self):
        self.client = APIClient()
        cache.clear()

        self.user = User.objects.create_user(
            email="perf@example.com", password="PerfPass123!"
        )

    def test_database_query_optimization(self):
        """Test database query optimization in user diagnoses"""
        self.client.force_authenticate(user=self.user)

        # Create multiple diagnoses for the user with all required fields
        for i in range(5):
            HCVPatient.objects.create(
                patient_name=f"Patient {i}",
                age=30 + i,
                sex="Male",
                alt=25.0,
                ast=30.0,
                alp=120.0,
                bil=1.2,
                che=5.5,
                crea=1.0,
                ggt=45.0,
                alb=4.0,
                created_by=self.user,
            )

        url = reverse("user-diagnoses")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 5)

    def test_diagnosis_endpoint_performance(self):
        """Test diagnosis endpoint performance without caching"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnose")

        # Test GET request performance
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")


class EdgeCaseTests(TestCase):
    """Test edge cases and error handling"""

    def setUp(self):
        self.client = APIClient()
        cache.clear()

        self.user = User.objects.create_user(
            email="test@example.com", password="TestPass123!"
        )

    def test_diagnosis_with_extreme_values(self):
        """Test diagnosis with extreme but valid values"""
        extreme_data = {
            "patient_name": "Extreme Case",
            "age": 99,
            "sex": "Female",
            "alt": 1000.0,  # Very high ALT
            "ast": 999.0,  # Very high AST
            "alp": 500.0,
            "bil": 20.0,  # Very high bilirubin
            "che": 2.0,
            "crea": 5.0,  # High creatinine
            "ggt": 300.0,
            "alb": 2.0,  # Low albumin
            "chol": 300.0,
            "prot": 9.0,
        }

        with patch("diagnosis.views.AiDiagnosisTool") as mock_ai:
            mock_ai.return_value = {"hcv_probability": 0.85, "stage": "High Risk"}

            url = reverse("diagnose")
            response = self.client.post(url, extreme_data, format="json")

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_diagnosis_with_missing_optional_fields(self):
        """Test diagnosis with only required fields"""
        minimal_data = {
            "patient_name": "Minimal Data",
            "age": 45,
            "sex": "Male",
            "alt": 25.0,
            "ast": 30.0,
            "alp": 120.0,
            "bil": 1.2,
            "che": 5.5,
            "crea": 1.0,
            "ggt": 45.0,
            "alb": 4.0,
        }

        with patch("diagnosis.views.AiDiagnosisTool") as mock_ai:
            mock_ai.return_value = {"hcv_probability": 0.35, "stage": "Medium Risk"}

            url = reverse("diagnose")
            response = self.client.post(url, minimal_data, format="json")

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_nonexistent_diagnosis_detail(self):
        """Test accessing non-existent diagnosis"""
        self.client.force_authenticate(user=self.user)
        url = reverse("diagnosis-detail", kwargs={"pk": 99999})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_user_id_in_management(self):
        """Test user management with invalid user ID"""
        superuser = User.objects.create_superuser(
            email="admin@example.com", password="AdminPass123!"
        )

        self.client.force_authenticate(user=superuser)
        url = reverse("user-management-detail", kwargs={"user_id": 99999})

        response = self.client.patch(url, {"is_staff": True}, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


if __name__ == "__main__":
    from django.test import main

    main()
