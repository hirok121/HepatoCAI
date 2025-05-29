"""
Comprehensive test suite for security and performance utilities.
"""

import unittest
from unittest.mock import patch, Mock, MagicMock
from django.test import TestCase, RequestFactory
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

from utils.security import (
    SecurityValidator,
    RateLimitManager,
    SecurityHeaders,
    AuditLogger,
    TokenManager,
)
from utils.performance import PerformanceMonitor, DatabaseOptimizer
from utils.responses import StandardResponse, handle_exceptions

User = get_user_model()


class SecurityValidatorTests(TestCase):
    """Test security validation utilities"""

    def setUp(self):
        self.factory = RequestFactory()

    def test_validate_input_clean(self):
        """Test input validation with clean data"""
        clean_input = "This is clean text"
        result = SecurityValidator.validate_input(clean_input)
        self.assertEqual(result, clean_input)

    def test_validate_input_html_escape(self):
        """Test HTML escaping"""
        html_input = "<div>Test</div>"
        result = SecurityValidator.validate_input(html_input)
        self.assertEqual(result, "&lt;div&gt;Test&lt;/div&gt;")

    def test_validate_input_xss_detection(self):
        """Test XSS pattern detection"""
        malicious_input = "<script>alert('xss')</script>"
        with self.assertRaises(ValidationError):
            SecurityValidator.validate_input(malicious_input)

    def test_validate_input_sql_injection(self):
        """Test SQL injection detection"""
        sql_input = "' OR '1'='1"
        with self.assertRaises(ValidationError):
            SecurityValidator.validate_input(sql_input)

    def test_validate_patient_data_valid(self):
        """Test patient data validation with valid data"""
        valid_data = {
            "patient_name": "John Doe",
            "age": 45,
            "sex": "Male",
            "alt": 25.5,
            "ast": 30.0,
        }
        result = SecurityValidator.validate_patient_data(valid_data)
        self.assertEqual(result["patient_name"], "John Doe")
        self.assertEqual(result["age"], 45.0)
        self.assertEqual(result["sex"], "Male")

    def test_validate_patient_data_invalid_age(self):
        """Test patient data validation with invalid age"""
        invalid_data = {"age": 200}
        with self.assertRaises(ValidationError):
            SecurityValidator.validate_patient_data(invalid_data)

    def test_validate_patient_data_invalid_sex(self):
        """Test patient data validation with invalid sex"""
        invalid_data = {"sex": "Invalid"}
        with self.assertRaises(ValidationError):
            SecurityValidator.validate_patient_data(invalid_data)


class RateLimitManagerTests(TestCase):
    """Test rate limiting functionality"""

    def setUp(self):
        cache.clear()

    def test_check_rate_limit_allowed(self):
        """Test rate limiting allows requests under limit"""
        identifier = "test_user"
        custom_limit = {"requests": 5, "window": 300}

        # First request should be allowed
        result = RateLimitManager.check_rate_limit(identifier, "test", custom_limit)
        self.assertTrue(result)

    def test_check_rate_limit_exceeded(self):
        """Test rate limiting blocks requests over limit"""
        identifier = "test_user"
        custom_limit = {"requests": 1, "window": 300}

        # First request allowed
        RateLimitManager.check_rate_limit(identifier, "test", custom_limit)

        # Second request should be blocked
        result = RateLimitManager.check_rate_limit(identifier, "test", custom_limit)
        self.assertFalse(result)

    def test_rate_limit_different_types(self):
        """Test different rate limit types"""
        identifier = "test_user"

        # Test login rate limit
        result1 = RateLimitManager.check_rate_limit(identifier, "login")
        self.assertTrue(result1)

        # Test diagnosis rate limit
        result2 = RateLimitManager.check_rate_limit(identifier, "diagnosis")
        self.assertTrue(result2)


class PerformanceMonitorTests(TestCase):
    """Test performance monitoring utilities"""

    def setUp(self):
        cache.clear()

    @patch("utils.performance.cache")
    def test_cache_result_decorator(self, mock_cache):
        """Test result caching decorator"""
        mock_cache.get.return_value = None
        mock_cache.set.return_value = None

        # Create a mock request
        request = Mock()

        @PerformanceMonitor.cache_result("test", timeout=300)
        def expensive_function(request):
            return "expensive_result"

        result = expensive_function(request)
        self.assertEqual(result, "expensive_result")
        mock_cache.set.assert_called()

    def test_monitor_db_queries_decorator(self):
        """Test database query monitoring decorator"""

        @PerformanceMonitor.monitor_db_queries
        def test_view(request):
            return "test_result"

        request = Mock()
        result = test_view(request)
        self.assertEqual(result, "test_result")


class SecurityHeadersTests(TestCase):
    """Test security headers functionality"""

    def test_add_security_headers(self):
        """Test security headers addition"""
        response = Mock()
        response.__setitem__ = Mock()

        SecurityHeaders.add_security_headers(response)

        # Verify security headers were added
        self.assertTrue(response.__setitem__.called)

        # Check specific headers
        calls = response.__setitem__.call_args_list
        header_names = [call[0][0] for call in calls]

        self.assertIn("X-Frame-Options", header_names)
        self.assertIn("X-Content-Type-Options", header_names)
        self.assertIn("X-XSS-Protection", header_names)


class TokenManagerTests(TestCase):
    """Test secure token management"""

    def test_generate_secure_token(self):
        """Test secure token generation"""
        token1 = TokenManager.generate_secure_token(32)
        token2 = TokenManager.generate_secure_token(32)

        # Tokens should be different
        self.assertNotEqual(token1, token2)

        # Should be URL-safe base64
        self.assertIsInstance(token1, str)
        self.assertGreater(len(token1), 40)  # URL-safe base64 is longer

    def test_hash_token(self):
        """Test token hashing"""
        token = "test_token"
        hashed1, salt1 = TokenManager.hash_token(token)
        hashed2, salt2 = TokenManager.hash_token(token)

        # Same token should produce different hashes with different salts
        self.assertNotEqual(hashed1, hashed2)
        self.assertNotEqual(salt1, salt2)

    def test_verify_token(self):
        """Test token verification"""
        token = "test_token"
        hashed, salt = TokenManager.hash_token(token)

        # Correct token should verify
        self.assertTrue(TokenManager.verify_token(token, hashed, salt))

        # Wrong token should not verify
        self.assertFalse(TokenManager.verify_token("wrong_token", hashed, salt))


class StandardResponseTests(TestCase):
    """Test standardized response formats"""

    def test_success_response(self):
        """Test success response creation"""
        response = StandardResponse.success(
            data={"id": 1, "name": "test"}, message="Test successful"
        )

        response_data = response.data
        self.assertEqual(response_data["status"], "success")
        self.assertEqual(response_data["message"], "Test successful")
        self.assertEqual(response_data["data"]["id"], 1)
        self.assertEqual(response.status_code, 200)

    def test_error_response(self):
        """Test error response creation"""
        response = StandardResponse.error(message="Test error", status_code=400)

        response_data = response.data
        self.assertEqual(response_data["status"], "error")
        self.assertEqual(response_data["message"], "Test error")
        self.assertEqual(response.status_code, 400)

    def test_validation_error_response(self):
        """Test validation error response"""
        errors = {"email": ["This field is required."]}
        response = StandardResponse.validation_error(errors)

        response_data = response.data
        self.assertEqual(response_data["status"], "error")
        self.assertEqual(response_data["message"], "Validation failed")
        self.assertEqual(response_data["errors"], errors)
        self.assertEqual(response.status_code, 400)

    def test_not_found_response(self):
        """Test not found response"""
        response = StandardResponse.not_found("User not found", "user")

        response_data = response.data
        self.assertEqual(response_data["status"], "error")
        self.assertEqual(response_data["message"], "User not found")
        self.assertEqual(response_data["resource_type"], "user")
        self.assertEqual(response.status_code, 404)


class HandleExceptionsDecoratorTests(TestCase):
    """Test exception handling decorator"""

    def test_normal_execution(self):
        """Test decorator with normal function execution"""

        @handle_exceptions
        def normal_function():
            return StandardResponse.success(data={"result": "ok"})

        response = normal_function()
        self.assertEqual(response.data["status"], "success")

    def test_exception_handling(self):
        """Test decorator with exception"""

        @handle_exceptions
        def failing_function():
            raise ValueError("Test error")

        response = failing_function()
        self.assertEqual(response.data["status"], "error")
        self.assertEqual(response.status_code, 500)

    def test_validation_error_handling(self):
        """Test decorator with validation error"""

        @handle_exceptions
        def validation_error_function():
            raise ValidationError("Validation failed")

        response = validation_error_function()
        self.assertEqual(response.data["status"], "error")
        self.assertEqual(response.status_code, 400)


class DatabaseOptimizerTests(TestCase):
    """Test database optimization utilities"""

    def test_optimize_queryset(self):
        """Test queryset optimization"""
        # Create a mock queryset
        mock_queryset = Mock()
        mock_queryset.select_related.return_value = mock_queryset
        mock_queryset.prefetch_related.return_value = mock_queryset

        result = DatabaseOptimizer.optimize_queryset(
            mock_queryset, select_related=["profile"], prefetch_related=["groups"]
        )  # Verify optimization methods were called
        mock_queryset.select_related.assert_called_with("profile")
        mock_queryset.prefetch_related.assert_called_with("groups")


class AuditLoggerTests(TestCase):
    """Test audit logging functionality"""

    def setUp(self):
        cache.clear()

    @patch("utils.security.logger")
    def test_log_security_event(self, mock_logger):
        """Test security event logging"""
        AuditLogger.log_security_event(
            "test_event",
            user="test_user",
            ip_address="127.0.0.1",
            details={"action": "test"},
        )

        # Verify logger was called
        mock_logger.warning.assert_called()

    @patch("utils.security.logger")
    def test_log_failed_login(self, mock_logger):
        """Test failed login logging"""
        AuditLogger.log_failed_login("test_user", "127.0.0.1", "Mozilla/5.0")

        # Verify logger was called
        mock_logger.warning.assert_called()

    @patch("utils.security.logger")
    def test_log_suspicious_activity(self, mock_logger):
        """Test suspicious activity logging"""
        AuditLogger.log_suspicious_activity(
            "xss_attempt",
            user="test_user",
            ip_address="127.0.0.1",
            details={"input": "<script>"},
        )

        # Verify logger was called
        mock_logger.warning.assert_called()


if __name__ == "__main__":
    unittest.main()
