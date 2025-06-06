"""
URL utilities for HepatoCAI application.
Provides dynamic URL generation based on environment variables.
"""

import os
from django.conf import settings


class URLBuilder:
    """Utility class for building URLs dynamically"""

    @staticmethod
    def get_frontend_url(path=""):
        """
        Get frontend URL with optional path

        Args:
            path (str): Optional path to append to frontend URL

        Returns:
            str: Complete frontend URL
        """
        base_url = settings.FRONTEND_URL.rstrip("/")
        if path:
            path = path.lstrip("/")
            return f"{base_url}/{path}"
        return base_url

    @staticmethod
    def get_backend_url(path=""):
        """
        Get backend URL with optional path

        Args:
            path (str): Optional path to append to backend URL

        Returns:
            str: Complete backend URL
        """
        base_url = getattr(settings, "BACKEND_URL", "http://localhost:8000").rstrip("/")
        if path:
            path = path.lstrip("/")
            return f"{base_url}/{path}"
        return base_url

    @staticmethod
    def get_auth_callback_url(access_token=None, refresh_token=None, error=None):
        """
        Generate auth callback URL for OAuth redirects

        Args:
            access_token (str): Access token for successful auth
            refresh_token (str): Refresh token for successful auth
            error (str): Error message for failed auth

        Returns:
            str: Complete callback URL
        """
        base_url = URLBuilder.get_frontend_url("/auth/callback")

        params = []
        if access_token:
            params.append(f"access={access_token}")
        if refresh_token:
            params.append(f"refresh={refresh_token}")
        if error:
            params.append(f"error={error}")

        if params:
            return f"{base_url}?{'&'.join(params)}"
        return base_url

    @staticmethod
    def get_email_verification_url(uid, token):
        """
        Generate email verification URL

        Args:
            uid (str): Base64 encoded user ID
            token (str): Verification token

        Returns:
            str: Complete verification URL
        """
        return URLBuilder.get_backend_url(f"/users/verify-email/{uid}/{token}/")

    @staticmethod
    def get_password_reset_url(uid, token):
        """
        Generate password reset URL for frontend

        Args:
            uid (str): Base64 encoded user ID
            token (str): Reset token

        Returns:
            str: Complete password reset URL
        """
        return URLBuilder.get_frontend_url(f"/reset-password/{uid}/{token}")


# Legacy functions for backward compatibility
def get_frontend_url(path=""):
    """Legacy function - use URLBuilder.get_frontend_url() instead"""
    return URLBuilder.get_frontend_url(path)


def get_backend_url(path=""):
    """Legacy function - use URLBuilder.get_backend_url() instead"""
    return URLBuilder.get_backend_url(path)
