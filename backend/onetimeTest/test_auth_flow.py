#!/usr/bin/env python
"""
Test authentication flow to debug JWT issues
Run with: python manage.py shell -c "exec(open('test_auth_flow.py').read())"
"""
import os
import django
import json
import requests
from datetime import datetime

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from users.models import CustomUser
from users.serializers import CustomTokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import jwt


def test_full_auth_flow():
    print("🔍 Testing Full Authentication Flow")
    print("=" * 60)

    # Step 1: Create/Find superuser
    print("1️⃣ Creating/Finding superuser...")
    try:
        superuser = CustomUser.objects.filter(is_superuser=True).first()
        if not superuser:
            superuser = CustomUser.objects.create_superuser(
                email="admin@test.com", password="admin123", full_name="Test Admin"
            )
            print(f"✅ Created superuser: {superuser.email}")
        else:
            # Ensure password is set
            superuser.set_password("admin123")
            superuser.save()
            print(f"✅ Using existing superuser: {superuser.email}")

        print(f"   - ID: {superuser.id}")
        print(f"   - is_staff: {superuser.is_staff}")
        print(f"   - is_superuser: {superuser.is_superuser}")
        print(f"   - is_active: {superuser.is_active}")

    except Exception as e:
        print(f"❌ Error with superuser: {e}")
        return False

    # Step 2: Test Django authentication
    print("\n2️⃣ Testing Django authentication...")
    try:
        auth_user = authenticate(email="admin@test.com", password="admin123")
        if auth_user:
            print(f"✅ Django authenticate successful: {auth_user.email}")
        else:
            print("❌ Django authenticate failed")
            return False
    except Exception as e:
        print(f"❌ Django authenticate error: {e}")
        return False

    # Step 3: Test token generation
    print("\n3️⃣ Testing token generation...")
    try:
        token = CustomTokenObtainPairSerializer.get_token(superuser)
        access_token = str(token.access_token)
        refresh_token = str(token)

        print(f"✅ Tokens generated successfully")
        print(f"   - Access token length: {len(access_token)}")
        print(f"   - Refresh token length: {len(refresh_token)}")

        # Decode and check token content
        decoded = jwt.decode(access_token, options={"verify_signature": False})
        print(f"   - Token payload includes:")
        critical_fields = ["user_id", "email", "is_staff", "is_superuser", "exp"]
        for field in critical_fields:
            print(f"     {field}: {decoded.get(field, 'MISSING')}")

    except Exception as e:
        print(f"❌ Token generation error: {e}")
        return False

    # Step 4: Test login endpoint
    print("\n4️⃣ Testing login endpoint...")
    try:
        login_data = {"email": "admin@test.com", "password": "admin123"}
        response = requests.post(
            "http://127.0.0.1:8000/accounts/token/",
            json=login_data,
            headers={"Content-Type": "application/json"},
            timeout=10,
        )

        print(f"   - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login endpoint successful")
            print(f"   - Has access token: {'access' in data}")
            print(f"   - Has refresh token: {'refresh' in data}")
            print(f"   - Has user data: {'user' in data}")

            api_access_token = data.get("access")
            if api_access_token:
                api_decoded = jwt.decode(
                    api_access_token, options={"verify_signature": False}
                )
                print(f"   - API token is_staff: {api_decoded.get('is_staff')}")
                print(f"   - API token is_superuser: {api_decoded.get('is_superuser')}")
        else:
            print(f"❌ Login endpoint failed: {response.text}")
            return False

    except Exception as e:
        print(f"❌ Login endpoint error: {e}")
        return False

    # Step 5: Test protected endpoint
    print("\n5️⃣ Testing protected endpoint...")
    try:
        headers = {
            "Authorization": f"Bearer {api_access_token}",
            "Content-Type": "application/json",
        }

        response = requests.get(
            "http://127.0.0.1:8000/users/admin/users/", headers=headers, timeout=10
        )

        print(f"   - Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Protected endpoint successful")
            print(f"   - Response type: {type(data)}")
            print(
                f"   - Has data: {'data' in data if isinstance(data, dict) else 'N/A'}"
            )
        else:
            print(f"❌ Protected endpoint failed: {response.text}")

            # Try to debug what's wrong
            print(f"\n🔍 Debugging protected endpoint failure...")
            print(f"   - Token used: {api_access_token[:50]}...")
            print(f"   - Headers sent: {headers}")

            # Check if user still exists and is valid
            check_user = CustomUser.objects.filter(email="admin@test.com").first()
            if check_user:
                print(f"   - User still exists: {check_user.email}")
                print(f"   - User is_active: {check_user.is_active}")
                print(f"   - User is_staff: {check_user.is_staff}")
                print(f"   - User is_superuser: {check_user.is_superuser}")

            return False

    except Exception as e:
        print(f"❌ Protected endpoint error: {e}")
        return False

    print("\n🎉 All authentication tests passed!")
    return True


if __name__ == "__main__":
    test_full_auth_flow()
