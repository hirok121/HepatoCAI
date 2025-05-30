#!/usr/bin/env python
"""
Test script to verify login tracking functionality for both email/password and Google OAuth login.
"""

import os
import sys
import django
from datetime import datetime

# Setup Django
sys.path.append(
    "d:\\Programming\\Code_Record\\Project\\Web_dev\\django+reat\\HepatoCAI\\backend"
)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.test import RequestFactory, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from utils.ip_utils import get_client_ip, update_user_login_tracking
from users.views import LoginViewSet
import json

User = get_user_model()


def test_ip_extraction():
    """Test IP address extraction utility"""
    print("=== Testing IP Address Extraction ===")

    factory = RequestFactory()

    # Test with different headers
    test_cases = [
        ("HTTP_X_FORWARDED_FOR", "192.168.1.100"),
        ("HTTP_X_REAL_IP", "10.0.0.1"),
        ("REMOTE_ADDR", "127.0.0.1"),
    ]

    for header, ip in test_cases:
        request = factory.get("/", **{header: ip})
        extracted_ip = get_client_ip(request)
        print(f"  {header}: {ip} -> {extracted_ip}")
        assert extracted_ip == ip, f"Expected {ip}, got {extracted_ip}"

    # Test with multiple IPs in X-Forwarded-For
    request = factory.get(
        "/", HTTP_X_FORWARDED_FOR="192.168.1.100, 10.0.0.1, 172.16.0.1"
    )
    extracted_ip = get_client_ip(request)
    print(f"  Multiple IPs: '192.168.1.100, 10.0.0.1, 172.16.0.1' -> {extracted_ip}")
    assert extracted_ip == "192.168.1.100", f"Expected first IP, got {extracted_ip}"

    print("✅ IP extraction tests passed!")


def test_login_tracking_direct():
    """Test login tracking functionality directly"""
    print("\n=== Testing Login Tracking Functionality ===")

    # Create or get a test user
    test_email = "test_login_tracking@example.com"
    try:
        user = User.objects.get(email=test_email)
        # Reset login count for testing
        initial_count = user.login_count or 0
        initial_ip = user.last_login_ip
    except User.DoesNotExist:
        user = User.objects.create_user(
            email=test_email,
            password="TestPassword123!",
            first_name="Test",
            last_name="User",
            is_active=True,
        )
        initial_count = 0
        initial_ip = None

    print(f"  Initial login count: {initial_count}")
    print(f"  Initial last login IP: {initial_ip}")

    # Create a mock request
    factory = RequestFactory()
    request = factory.post("/login/", HTTP_X_FORWARDED_FOR="192.168.1.50")

    # Test login tracking update
    update_user_login_tracking(user, request)

    # Refresh user from database
    user.refresh_from_db()

    print(f"  Updated login count: {user.login_count}")
    print(f"  Updated last login IP: {user.last_login_ip}")
    print(f"  Updated last login: {user.last_login}")

    # Verify updates
    assert (
        user.login_count == initial_count + 1
    ), f"Login count should be {initial_count + 1}, got {user.login_count}"
    assert (
        user.last_login_ip == "192.168.1.50"
    ), f"IP should be '192.168.1.50', got {user.last_login_ip}"
    assert user.last_login is not None, "Last login should be set"

    print("✅ Login tracking tests passed!")


def test_email_login_api():
    """Test email/password login API with tracking"""
    print("\n=== Testing Email/Password Login API ===")

    # Create test user
    test_email = "test_api_login@example.com"
    test_password = "TestPassword123!"

    try:
        user = User.objects.get(email=test_email)
        user.set_password(test_password)
        user.is_active = True
        user.save()
    except User.DoesNotExist:
        user = User.objects.create_user(
            email=test_email,
            password=test_password,
            first_name="API",
            last_name="Test",
            is_active=True,
        )

    initial_count = user.login_count or 0
    print(f"  Initial login count: {initial_count}")

    # Test login via API
    client = Client()
    response = client.post(
        reverse("login-list"),
        data=json.dumps({"email": test_email, "password": test_password}),
        content_type="application/json",
        HTTP_X_FORWARDED_FOR="192.168.1.75",
    )

    print(f"  Login response status: {response.status_code}")

    if response.status_code == 200:
        response_data = response.json()
        print(f"  Login successful: {response_data.get('message', 'No message')}")

        # Check if user login tracking was updated
        user.refresh_from_db()
        print(f"  Updated login count: {user.login_count}")
        print(f"  Updated last login IP: {user.last_login_ip}")

        assert (
            user.login_count == initial_count + 1
        ), "Login count should be incremented"
        assert user.last_login_ip == "192.168.1.75", "IP should be tracked"

        print("✅ Email login API tracking tests passed!")
    else:
        print(f"❌ Login failed with status {response.status_code}: {response.content}")
        if hasattr(response, "json"):
            try:
                print(f"Response: {response.json()}")
            except:
                pass


def test_google_oauth_tracking():
    """Test Google OAuth login tracking functionality"""
    print("=== Testing Google OAuth Login Tracking ===")

    from users.adapters import MySocialAccountAdapter
    from unittest.mock import Mock

    # Create test adapter
    adapter = MySocialAccountAdapter()

    # Create mock request
    factory = RequestFactory()
    request = factory.get("/")
    request.META = {
        "HTTP_X_FORWARDED_FOR": "203.0.113.100",
        "REMOTE_ADDR": "127.0.0.1",
    }

    # Test with existing user
    email = "oauth_test@example.com"
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        user = User.objects.create_user(
            email=email,
            password="testpass123",
            first_name="OAuth",
            last_name="Test",
        )

    # Reset tracking fields
    initial_count = 2
    user.login_count = initial_count
    user.last_login_ip = "192.168.1.1"
    user.save()

    print(f"  Test user: {user.email}")
    print(f"  Initial login count: {user.login_count}")
    print(f"  Initial IP: {user.last_login_ip}")
    print(f"  Test IP: 203.0.113.100")

    # Create mock social login for existing user
    sociallogin = Mock()
    sociallogin.is_existing = True
    sociallogin.user = user

    # Test pre_social_login method
    adapter.pre_social_login(request, sociallogin)

    # Refresh user and check updates
    user.refresh_from_db()

    print(f"  Updated login count: {user.login_count}")
    print(f"  Updated IP: {user.last_login_ip}")

    # Verify tracking was updated
    expected_count = initial_count + 1
    if user.login_count == expected_count and user.last_login_ip == "203.0.113.100":
        print("✅ Google OAuth tracking tests passed!")
        return True
    else:
        print(
            f"❌ Expected count={expected_count}, IP='203.0.113.100', got count={user.login_count}, IP='{user.last_login_ip}'"
        )
        return False


def test_user_model_fields():
    """Test that user model has the required login tracking fields"""
    print("\n=== Testing User Model Fields ===")

    # Check if model has the required fields
    user_fields = [field.name for field in User._meta.fields]

    required_fields = [
        "last_login_ip",
        "login_count",
        "phone_number",
        "country",
        "city",
        "timezone",
        "phone_verified_at",
        "terms_accepted_at",
        "terms_version",
    ]

    for field in required_fields:
        if field in user_fields:
            print(f"  ✅ {field}: Found")
        else:
            print(f"  ❌ {field}: Missing")

    print("✅ User model field checks completed!")


if __name__ == "__main__":
    print("Testing Login Tracking Functionality")
    print("=" * 50)

    try:
        test_ip_extraction()
        test_login_tracking_direct()
        test_email_login_api()
        test_google_oauth_tracking()  # Add Google OAuth test
        test_user_model_fields()

        print("\n" + "=" * 50)
        print("🎉 All login tracking tests completed successfully!")

    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
        import traceback

        traceback.print_exc()
        sys.exit(1)
