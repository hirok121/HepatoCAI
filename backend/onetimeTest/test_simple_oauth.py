#!/usr/bin/env python
"""
Simple test for Google OAuth login tracking
"""
import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

print("Setting up Django...")
django.setup()
print("Django setup complete")

from django.contrib.auth import get_user_model
from django.test import RequestFactory
from utils.ip_utils import update_user_login_tracking

User = get_user_model()
print("Imported modules successfully")


def test_simple_tracking():
    """Simple test of login tracking"""
    print("=== Simple Login Tracking Test ===")

    # Create or get test user
    email = "simple@test.com"
    try:
        user = User.objects.get(email=email)
        print(f"Found existing user: {user.email}")
    except User.DoesNotExist:
        user = User.objects.create_user(
            email=email, password="testpass123", first_name="Simple", last_name="Test"
        )
        print(f"Created new user: {user.email}")

    # Reset tracking
    user.login_count = 0
    user.last_login_ip = None
    user.save()
    print(f"Reset user - Count: {user.login_count}, IP: {user.last_login_ip}")

    # Create mock request
    factory = RequestFactory()
    request = factory.get("/")
    request.META = {"HTTP_X_FORWARDED_FOR": "203.0.113.50", "REMOTE_ADDR": "127.0.0.1"}

    # Test tracking function
    print("Calling update_user_login_tracking...")
    update_user_login_tracking(user, request)

    # Check results
    user.refresh_from_db()
    print(f"After tracking - Count: {user.login_count}, IP: {user.last_login_ip}")

    # Verify
    if user.login_count == 1 and user.last_login_ip == "203.0.113.50":
        print("✅ Simple tracking test passed!")
        return True
    else:
        print("❌ Simple tracking test failed!")
        return False


if __name__ == "__main__":
    print("Starting Simple Google OAuth Test")
    print("=" * 40)

    try:
        success = test_simple_tracking()
        if success:
            print("🎉 Test completed successfully!")
        else:
            print("❌ Test failed!")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback

        traceback.print_exc()
