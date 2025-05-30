#!/usr/bin/env python
"""
Test script for Google OAuth login tracking
"""
import os
import sys
import django
from unittest.mock import Mock, patch
import json

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model
from django.test import RequestFactory
from allauth.socialaccount.models import SocialLogin, SocialAccount
from users.adapters import MySocialAccountAdapter
from utils.ip_utils import update_user_login_tracking

User = get_user_model()


def create_mock_request(ip_address="192.168.1.100"):
    """Create a mock request with IP address"""
    factory = RequestFactory()
    request = factory.get("/")
    request.META = {"HTTP_X_FORWARDED_FOR": ip_address, "REMOTE_ADDR": "127.0.0.1"}
    return request


def create_mock_sociallogin(email, google_id="123456789", is_existing=False, user=None):
    """Create a mock social login object"""
    # Create mock social account
    social_account = Mock()
    social_account.provider = "google"
    social_account.extra_data = {
        "id": google_id,
        "email": email,
        "given_name": "Test",
        "family_name": "User",
        "name": "Test User",
        "picture": "https://example.com/avatar.jpg",
        "locale": "en",
        "verified_email": True,
    }

    # Create mock social login
    sociallogin = Mock()
    sociallogin.account = social_account
    sociallogin.is_existing = is_existing

    if user:
        sociallogin.user = user
    else:
        # Create a new user object
        sociallogin.user = User(
            email=email,
            username=email.split("@")[0],
            first_name="Test",
            last_name="User",
        )

    # Mock the connect method
    sociallogin.connect = Mock()

    return sociallogin


def test_google_oauth_new_user():
    """Test Google OAuth login tracking for new users"""
    print("=== Testing Google OAuth New User ===")

    adapter = MySocialAccountAdapter()
    request = create_mock_request("203.0.113.100")

    # Create mock social login for new user
    email = "newuser@google.com"
    sociallogin = create_mock_sociallogin(email, google_id="987654321")

    # Delete user if exists (cleanup)
    try:
        User.objects.get(email=email).delete()
    except User.DoesNotExist:
        pass

    print(f"  Testing with email: {email}")
    print(f"  IP address: 203.0.113.100")

    # Test pre_social_login for new user (should do nothing)
    adapter.pre_social_login(request, sociallogin)
    print("  ✅ pre_social_login completed for new user")

    # Test save_user (this should create user and track login)
    user = adapter.save_user(request, sociallogin)
    print(f"  ✅ User created: {user.email}")
    print(f"  Login count: {user.login_count}")
    print(f"  Last login IP: {user.last_login_ip}")
    print(f"  Google ID: {user.google_id}")
    print(f"  Is social user: {user.is_social_user}")

    # Verify tracking was applied
    assert user.login_count == 1, f"Expected login_count=1, got {user.login_count}"
    assert (
        user.last_login_ip == "203.0.113.100"
    ), f"Expected IP=203.0.113.100, got {user.last_login_ip}"
    assert (
        user.google_id == "987654321"
    ), f"Expected Google ID=987654321, got {user.google_id}"
    assert (
        user.is_social_user == True
    ), f"Expected is_social_user=True, got {user.is_social_user}"

    return user


def test_google_oauth_existing_user():
    """Test Google OAuth login tracking for existing users"""
    print("\n=== Testing Google OAuth Existing User ===")

    adapter = MySocialAccountAdapter()
    request = create_mock_request("203.0.113.200")

    # Create existing user
    email = "existinguser@google.com"
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        user = User.objects.create_user(
            email=email, password="testpass123", first_name="Existing", last_name="User"
        )

    # Reset tracking fields
    user.login_count = 2  # Simulate previous logins
    user.last_login_ip = "192.168.1.1"
    user.google_id = None
    user.is_social_user = False
    user.save()

    print(f"  Testing with existing user: {user.email}")
    print(f"  Initial login count: {user.login_count}")
    print(f"  Initial IP: {user.last_login_ip}")
    print(f"  New IP: 203.0.113.200")

    # Create social login for existing user
    sociallogin = create_mock_sociallogin(
        email, google_id="555666777", is_existing=True, user=user
    )

    # Test pre_social_login for existing user
    adapter.pre_social_login(request, sociallogin)

    # Refresh user from database
    user.refresh_from_db()

    print(f"  ✅ Updated login count: {user.login_count}")
    print(f"  ✅ Updated last login IP: {user.last_login_ip}")

    # Verify tracking was updated
    assert user.login_count == 3, f"Expected login_count=3, got {user.login_count}"
    assert (
        user.last_login_ip == "203.0.113.200"
    ), f"Expected IP=203.0.113.200, got {user.last_login_ip}"

    return user


def test_google_oauth_account_connection():
    """Test Google OAuth login tracking when connecting to existing account"""
    print("\n=== Testing Google OAuth Account Connection ===")

    adapter = MySocialAccountAdapter()
    request = create_mock_request("203.0.113.300")

    # Create existing user without Google connection
    email = "connect@example.com"
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        user = User.objects.create_user(
            email=email, password="testpass123", first_name="Connect", last_name="Test"
        )

    # Reset tracking fields
    user.login_count = 5
    user.last_login_ip = "10.0.0.1"
    user.google_id = None
    user.is_social_user = False
    user.save()

    print(f"  Testing account connection for: {user.email}")
    print(f"  Initial login count: {user.login_count}")
    print(f"  Initial IP: {user.last_login_ip}")

    # Create social login for account connection (new social login, existing email)
    sociallogin = create_mock_sociallogin(
        email, google_id="111222333", is_existing=False
    )

    # Test pre_social_login (should find existing user and connect)
    adapter.pre_social_login(request, sociallogin)

    # Refresh user from database
    user.refresh_from_db()

    print(f"  ✅ Updated login count: {user.login_count}")
    print(f"  ✅ Updated last login IP: {user.last_login_ip}")
    print(f"  ✅ Account connected")

    # Verify tracking was updated
    assert user.login_count == 6, f"Expected login_count=6, got {user.login_count}"
    assert (
        user.last_login_ip == "203.0.113.300"
    ), f"Expected IP=203.0.113.300, got {user.last_login_ip}"

    return user


def test_login_tracking_utility():
    """Test the login tracking utility function directly"""
    print("\n=== Testing Login Tracking Utility ===")

    # Create test user
    email = "utility@test.com"
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        user = User.objects.create_user(email=email, password="testpass123")

    # Reset tracking
    user.login_count = 0
    user.last_login_ip = None
    user.save()

    print(f"  Testing utility function with user: {user.email}")
    print(f"  Initial login count: {user.login_count}")

    # Test multiple calls with different IPs
    test_ips = ["192.168.1.50", "10.0.0.50", "172.16.0.50"]

    for i, ip in enumerate(test_ips, 1):
        request = create_mock_request(ip)
        update_user_login_tracking(user, request)
        user.refresh_from_db()

        print(f"  Login {i}: Count = {user.login_count}, IP = {user.last_login_ip}")

        assert user.login_count == i, f"Expected count={i}, got {user.login_count}"
        assert user.last_login_ip == ip, f"Expected IP={ip}, got {user.last_login_ip}"

    print("  ✅ Login tracking utility working correctly")
    return True


if __name__ == "__main__":
    print("Testing Google OAuth Login Tracking")
    print("=" * 50)

    try:
        # Test all scenarios
        test_login_tracking_utility()
        test_google_oauth_new_user()
        test_google_oauth_existing_user()
        test_google_oauth_account_connection()

        print("\n" + "=" * 50)
        print("🎉 All Google OAuth login tracking tests passed!")

    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
        import traceback

        traceback.print_exc()
