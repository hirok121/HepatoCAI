#!/usr/bin/env python
"""
Test script to verify URLBuilder functionality and environment variable configuration.
This script tests the URL generation with different environment configurations.
"""

import os
import sys
import django
from django.conf import settings

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

# Initialize Django
django.setup()

from utils.url_utils import URLBuilder


def test_url_builder():
    """Test URLBuilder with current environment configuration"""
    print("=" * 60)
    print("TESTING URL BUILDER WITH CURRENT CONFIGURATION")
    print("=" * 60)

    # Test basic URL generation
    print(f"Frontend URL: {URLBuilder.get_frontend_url()}")
    print(f"Backend URL: {URLBuilder.get_backend_url()}")

    # Test path appending
    print(f"Frontend signin: {URLBuilder.get_frontend_url('/signin')}")
    print(f"Backend API: {URLBuilder.get_backend_url('/api/users/')}")

    # Test OAuth callback URLs
    print(
        f"Success callback: {URLBuilder.get_auth_callback_url(access_token='test_access', refresh_token='test_refresh')}"
    )
    print(
        f"Error callback: {URLBuilder.get_auth_callback_url(error='authentication_failed')}"
    )

    # Test email verification URL
    print(
        f"Email verification: {URLBuilder.get_email_verification_url('uid123', 'token456')}"
    )

    # Test password reset URL
    print(
        f"Password reset: {URLBuilder.get_password_reset_url('uid789', 'reset_token')}"
    )

    print("\n" + "=" * 60)
    print("ENVIRONMENT VARIABLES")
    print("=" * 60)
    print(f"FRONTEND_URL: {os.getenv('FRONTEND_URL', 'Not set')}")
    print(f"BACKEND_URL: {os.getenv('BACKEND_URL', 'Not set')}")
    print(f"DOMAIN: {os.getenv('DOMAIN', 'Not set')}")

    print("\n" + "=" * 60)
    print("DJANGO SETTINGS")
    print("=" * 60)
    print(f"settings.FRONTEND_URL: {getattr(settings, 'FRONTEND_URL', 'Not set')}")
    print(f"settings.BACKEND_URL: {getattr(settings, 'BACKEND_URL', 'Not set')}")
    print(
        f"settings.CORS_ALLOWED_ORIGINS: {getattr(settings, 'CORS_ALLOWED_ORIGINS', 'Not set')}"
    )


if __name__ == "__main__":
    test_url_builder()
