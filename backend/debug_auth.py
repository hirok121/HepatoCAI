#!/usr/bin/env python
"""
Debug script to test JWT authentication flow
Run with: python manage.py shell < debug_auth.py
"""
import os
import django
import requests
import json
from datetime import datetime

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from users.models import CustomUser
from users.serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from jwt import decode as jwt_decode
from django.conf import settings


def debug_jwt_auth():
    print("=" * 60)
    print("JWT Authentication Debug Script")
    print("=" * 60)

    # Find a superuser for testing
    superuser = CustomUser.objects.filter(is_superuser=True).first()
    if not superuser:
        print("❌ No superuser found! Creating one...")
        superuser = CustomUser.objects.create_superuser(
            email="admin@test.com", password="admin123", full_name="Test Admin"
        )
        print(f"✅ Created superuser: {superuser.email}")
    else:
        print(f"✅ Found superuser: {superuser.email}")

    print(f"   - is_staff: {superuser.is_staff}")
    print(f"   - is_superuser: {superuser.is_superuser}")
    print()

    # Test 1: Generate token using CustomTokenObtainPairSerializer
    print("1️⃣ Testing CustomTokenObtainPairSerializer...")
    try:
        custom_token = CustomTokenObtainPairSerializer.get_token(superuser)
        access_token = str(custom_token.access_token)
        refresh_token = str(custom_token)

        print("✅ Token generated successfully")
        print(f"   Access token length: {len(access_token)}")
        print(f"   Refresh token length: {len(refresh_token)}")

        # Decode the token to see its content
        decoded = jwt_decode(access_token, options={"verify_signature": False})
        print("   Token payload:")
        for key, value in decoded.items():
            if key in ["is_staff", "is_superuser", "email", "full_name"]:
                print(f"     {key}: {value}")
        print()

    except Exception as e:
        print(f"❌ Error generating token: {e}")
        return

    # Test 2: Test login endpoint
    print("2️⃣ Testing login endpoint...")
    try:
        login_data = {
            "email": superuser.email,
            "password": "admin123",  # Use the password we know
        }

        # If the superuser was just created, the password is 'admin123'
        # If it's an existing user, try to set a known password
        if not hasattr(superuser, "_password_set"):
            superuser.set_password("admin123")
            superuser.save()

        response = requests.post(
            "http://127.0.0.1:8000/accounts/token/",
            json=login_data,
            headers={"Content-Type": "application/json"},
        )

        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful")
            print(f"   Has access token: {'access' in data}")
            print(f"   Has refresh token: {'refresh' in data}")
            login_access_token = data.get("access")
            login_refresh_token = data.get("refresh")

            # Decode login token
            if login_access_token:
                decoded_login = jwt_decode(
                    login_access_token, options={"verify_signature": False}
                )
                print("   Login token payload:")
                for key, value in decoded_login.items():
                    if key in ["is_staff", "is_superuser", "email", "full_name"]:
                        print(f"     {key}: {value}")
            print()
        else:
            print(f"❌ Login failed: {response.text}")
            return

    except Exception as e:
        print(f"❌ Error testing login: {e}")
        return

    # Test 3: Test protected endpoint
    print("3️⃣ Testing protected endpoint...")
    try:
        headers = {
            "Authorization": f"Bearer {login_access_token}",
            "Content-Type": "application/json",
        }

        response = requests.get(
            "http://127.0.0.1:8000/users/admin/users/", headers=headers
        )

        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Protected endpoint access successful")
            data = response.json()
            print(f"   Response keys: {list(data.keys())}")
        else:
            print(f"❌ Protected endpoint failed: {response.text}")
            print(f"   Headers sent: {headers}")
        print()

    except Exception as e:
        print(f"❌ Error testing protected endpoint: {e}")

    # Test 4: Check JWT settings
    print("4️⃣ JWT Settings Check...")
    print(f"   SECRET_KEY length: {len(settings.SECRET_KEY)}")
    print(
        f"   ACCESS_TOKEN_LIFETIME: {settings.SIMPLE_JWT.get('ACCESS_TOKEN_LIFETIME')}"
    )
    print(
        f"   REFRESH_TOKEN_LIFETIME: {settings.SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME')}"
    )
    print()

    print("=" * 60)
    print("Debug script completed")
    print("=" * 60)


if __name__ == "__main__":
    debug_jwt_auth()
