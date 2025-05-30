"""
IP address utility functions for consistent IP address extraction.
"""

import logging
from django.utils import timezone

logger = logging.getLogger(__name__)


def get_client_ip(request):
    """
    Extract client IP address from request headers.
    Handles various proxy scenarios and header combinations.

    Args:
        request: Django HttpRequest object

    Returns:
        str: Client IP address or 'unknown' if not found
    """
    # List of headers to check in order of priority
    ip_headers = [
        "HTTP_X_FORWARDED_FOR",
        "HTTP_X_REAL_IP",
        "HTTP_X_FORWARDED",
        "HTTP_X_CLUSTER_CLIENT_IP",
        "HTTP_FORWARDED_FOR",
        "HTTP_FORWARDED",
        "REMOTE_ADDR",
    ]

    for header in ip_headers:
        ip = request.META.get(header)
        if ip:
            # Handle comma-separated IPs (X-Forwarded-For can contain multiple IPs)
            if "," in ip:
                # Take the first IP (original client)
                ip = ip.split(",")[0].strip()

            # Validate IP format (basic check)
            if _is_valid_ip(ip):
                logger.debug(f"Client IP extracted from {header}: {ip}")
                return ip

    logger.warning("Could not extract valid client IP from request")
    return "unknown"


def _is_valid_ip(ip):
    """
    Basic IP address validation.

    Args:
        ip (str): IP address to validate

    Returns:
        bool: True if IP appears valid, False otherwise
    """
    if not ip or ip == "unknown":
        return False

    # Remove any leading/trailing whitespace
    ip = ip.strip()

    # Basic IPv4 validation
    parts = ip.split(".")
    if len(parts) == 4:
        try:
            for part in parts:
                num = int(part)
                if num < 0 or num > 255:
                    return False
            return True
        except ValueError:
            pass

    # Basic IPv6 validation (simplified)
    if ":" in ip and len(ip) > 2:
        return True

    return False


def update_user_login_tracking(user, request):
    """
    Update user login tracking fields.

    Args:
        user: User instance to update
        request: Django HttpRequest object
    """
    try:
        # Extract client IP
        client_ip = get_client_ip(request)

        # Update login tracking fields
        user.last_login_ip = client_ip
        user.login_count = (user.login_count or 0) + 1
        user.last_login = timezone.now()

        # Save the user with updated login tracking
        user.save(update_fields=["last_login_ip", "login_count", "last_login"])

        logger.info(
            f"Login tracking updated for user {user.email}: IP={client_ip}, Count={user.login_count}"
        )

    except Exception as e:
        logger.error(f"Failed to update login tracking for user {user.email}: {str(e)}")
        # Don't fail the login process if tracking update fails
        pass
