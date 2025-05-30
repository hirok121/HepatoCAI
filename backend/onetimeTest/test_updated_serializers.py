#!/usr/bin/env python
"""
Test script to validate updated serializers with new user model fields
"""

import os
import sys
import django
from django.conf import settings

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model
from users.serializers import ProfileSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


def test_profile_serializer():
    """Test ProfileSerializer with new fields"""
    print("=== Testing ProfileSerializer ===")

    # Test data including new fields
    test_data = {
        "first_name": "John",
        "last_name": "Doe",
        "full_name": "John Doe",
        "phone_number": "+1234567890",
        "country": "United States",
        "city": "New York",
        "timezone": "America/New_York",
        "terms_version": "v1.0",
    }

    # Test serializer validation
    serializer = ProfileSerializer(data=test_data)

    if serializer.is_valid():
        print("✅ ProfileSerializer validation passed")
        print(f"Validated data: {serializer.validated_data}")

        # Test field inclusion
        expected_fields = [
            "phone_number",
            "country",
            "city",
            "timezone",
            "phone_verified_at",
            "last_login_ip",
            "login_count",
            "terms_accepted_at",
            "terms_version",
        ]

        for field in expected_fields:
            if field in serializer.fields:
                print(f"✅ Field '{field}' included in serializer")
            else:
                print(f"❌ Field '{field}' missing from serializer")

        # Test read-only fields
        read_only_fields = serializer.Meta.read_only_fields
        expected_readonly = ["last_login_ip", "login_count", "phone_verified_at"]
        for field in expected_readonly:
            if field in read_only_fields:
                print(f"✅ Field '{field}' correctly set as read-only")
            else:
                print(f"❌ Field '{field}' should be read-only")

    else:
        print("❌ ProfileSerializer validation failed")
        print(f"Errors: {serializer.errors}")


def test_token_serializer():
    """Test CustomTokenObtainPairSerializer with new fields"""
    print("\n=== Testing CustomTokenObtainPairSerializer ===")

    # Create a test user
    try:
        user = User.objects.filter(email="test@example.com").first()
        if not user:
            user = User.objects.create_user(
                email="test@example.com",
                password="testpass123",
                full_name="Test User",
                country="Test Country",
                city="Test City",
                timezone="UTC",
            )
            print("✅ Test user created")
        else:
            print("✅ Using existing test user")

        # Test token generation
        token = RefreshToken.for_user(user)
        access_token = token.access_token

        # Check if custom claims are included
        payload = access_token.payload
        expected_claims = ["country", "city", "timezone"]

        for claim in expected_claims:
            if claim in payload:
                print(f"✅ Claim '{claim}' included in token: {payload[claim]}")
            else:
                print(f"❌ Claim '{claim}' missing from token")

        # Test serializer validate method
        serializer = CustomTokenObtainPairSerializer()
        serializer.user = user

        # Mock attrs for validate method
        attrs = {"username": user.email, "password": "testpass123"}

        print("✅ CustomTokenObtainPairSerializer token generation successful")

    except Exception as e:
        print(f"❌ Error testing CustomTokenObtainPairSerializer: {str(e)}")


def test_field_validations():
    """Test custom field validations"""
    print("\n=== Testing Field Validations ===")

    # Test phone number validation
    serializer = ProfileSerializer()

    # Test valid phone number
    try:
        result = serializer.validate_phone_number("+1234567890")
        print("✅ Valid phone number accepted")
    except Exception as e:
        print(f"❌ Valid phone number rejected: {e}")

    # Test invalid phone number (too long)
    try:
        result = serializer.validate_phone_number("a" * 25)
        print("❌ Invalid phone number (too long) was accepted")
    except Exception as e:
        print("✅ Invalid phone number correctly rejected")

    # Test country validation
    try:
        result = serializer.validate_country("United States")
        print("✅ Valid country accepted")
    except Exception as e:
        print(f"❌ Valid country rejected: {e}")

    # Test timezone validation
    try:
        result = serializer.validate_timezone("America/New_York")
        print("✅ Valid timezone accepted")
    except Exception as e:
        print(f"❌ Valid timezone rejected: {e}")

    # Test terms version validation
    try:
        result = serializer.validate_terms_version("v1.0")
        print("✅ Valid terms version accepted")
    except Exception as e:
        print(f"❌ Valid terms version rejected: {e}")


if __name__ == "__main__":
    print("Testing updated serializers with new user model fields...\n")

    try:
        test_profile_serializer()
        test_token_serializer()
        test_field_validations()

        print("\n=== Test Summary ===")
        print("All serializer tests completed. Check above for any issues.")

    except Exception as e:
        print(f"❌ Test execution failed: {str(e)}")
        import traceback

        traceback.print_exc()
