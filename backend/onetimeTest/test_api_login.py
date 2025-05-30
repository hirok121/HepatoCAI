#!/usr/bin/env python
"""
Test script specifically for API login tracking
"""
import os
import sys
import django
from django.test import Client
from django.contrib.auth import get_user_model
import json

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

User = get_user_model()


def test_api_login():
    """Test the API login endpoint with tracking"""
    print("=== Testing API Login Endpoint ===")

    # Create test client
    client = Client()

    # Create or get test user
    email = "testuser@example.com"
    password = "testpassword123"

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        user = User.objects.create_user(
            email=email, password=password, first_name="Test", last_name="User"
        )

    # Reset login tracking fields
    user.login_count = 0
    user.last_login_ip = None
    user.save()

    print(f"  Initial login count: {user.login_count}")
    print(f"  Initial last login IP: {user.last_login_ip}")

    # Prepare login data
    login_data = {"email": email, "password": password}

    # Set custom IP in headers
    test_ip = "192.168.1.200"

    # Make login request
    response = client.post(
        "/users/login/",
        data=json.dumps(login_data),
        content_type="application/json",
        HTTP_X_FORWARDED_FOR=test_ip,
        HTTP_HOST="testserver",
    )

    print(f"  Login response status: {response.status_code}")

    if response.status_code == 200:
        # Refresh user from database
        user.refresh_from_db()

        print(f"  ✅ Login successful!")
        print(f"  Updated login count: {user.login_count}")
        print(f"  Updated last login IP: {user.last_login_ip}")
        print(f"  Updated last login: {user.last_login}")

        # Verify response content
        response_data = response.json()
        if "access" in response_data and "refresh" in response_data:
            print("  ✅ JWT tokens received")
        else:
            print("  ❌ Missing JWT tokens in response")

        return True
    else:
        print(f"  ❌ Login failed with status {response.status_code}")
        print(f"  Response content: {response.content.decode()[:500]}...")
        return False


def test_multiple_logins():
    """Test multiple logins to verify login count increment"""
    print("\n=== Testing Multiple Logins ===")

    client = Client()
    email = "testuser@example.com"
    password = "testpassword123"

    user = User.objects.get(email=email)
    initial_count = user.login_count

    login_data = {"email": email, "password": password}

    # Make 3 more login requests
    for i in range(3):
        response = client.post(
            "/users/login/",
            data=json.dumps(login_data),
            content_type="application/json",
            HTTP_X_FORWARDED_FOR=f"192.168.1.{201 + i}",
            HTTP_HOST="testserver",
        )

        if response.status_code == 200:
            user.refresh_from_db()
            print(
                f"  Login {i+1}: Count = {user.login_count}, IP = {user.last_login_ip}"
            )
        else:
            print(f"  Login {i+1} failed: {response.status_code}")

    final_count = user.login_count
    print(f"  Initial count: {initial_count}, Final count: {final_count}")
    print(f"  Count increment: {final_count - initial_count}")

    return final_count > initial_count


if __name__ == "__main__":
    print("Testing API Login Tracking")
    print("=" * 50)

    success1 = test_api_login()
    success2 = test_multiple_logins()

    if success1 and success2:
        print("\n🎉 All API login tests passed!")
    else:
        print("\n❌ Some API login tests failed!")
