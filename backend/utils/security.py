"""
Security utilities for HepatoCAI application.
"""

import re
import html
import logging
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.core.cache import cache
from django.conf import settings
from django.http import JsonResponse
from functools import wraps
import hashlib
import secrets

logger = logging.getLogger("django.security")


class SecurityValidator:
    """Security validation utilities"""

    # Common XSS patterns
    XSS_PATTERNS = [
        r"<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>",
        r"javascript:",
        r"on\w+\s*=",
        r"<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>",
        r"<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>",
        r"<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>",
    ]  # SQL injection patterns
    SQL_PATTERNS = [
        r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)",
        r"(\'|\"|;|--|\*|\||&)",
        r"(\b(OR|AND)\b.*[=<>])",
    ]

    @classmethod
    def validate_input(cls, data, field_name="input"):
        """Validate and sanitize user input"""
        if not isinstance(data, str):
            return data

        # Check for XSS patterns
        for pattern in cls.XSS_PATTERNS:
            if re.search(pattern, data, re.IGNORECASE):
                logger.warning(f"XSS attempt detected in {field_name}: {data[:100]}")
                raise ValidationError(f"Invalid characters detected in {field_name}")

        # Check for SQL injection patterns
        for pattern in cls.SQL_PATTERNS:
            if re.search(pattern, data, re.IGNORECASE):
                logger.warning(f"SQL injection attempt in {field_name}: {data[:100]}")
                raise ValidationError(f"Invalid characters detected in {field_name}")

        # Sanitize HTML
        sanitized = html.escape(data)
        return sanitized

    @classmethod
    def validate_input_data(cls, data):
        """Validate entire request data for security"""
        if not isinstance(data, dict):
            return False

        try:
            for key, value in data.items():
                if isinstance(value, str):
                    cls.validate_input(value, key)
            return True
        except ValidationError:
            return False

    @classmethod
    def validate_email_format(cls, email):
        """Validate email format"""
        import re

        email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not isinstance(email, str):
            return False
        return re.match(email_pattern, email) is not None

    @classmethod
    def validate_patient_data(cls, patient_data):
        """Validate patient diagnosis data for security"""
        validated_data = {}

        # String fields that need validation
        string_fields = ["patient_name", "symptoms"]
        for field in string_fields:
            if field in patient_data:
                validated_data[field] = cls.validate_input(patient_data[field], field)

        # Numeric fields validation
        numeric_fields = [
            "age",
            "alp",
            "ast",
            "che",
            "crea",
            "ggt",
            "alb",
            "bil",
            "chol",
            "prot",
            "alt",
        ]
        for field in numeric_fields:
            if field in patient_data:
                value = patient_data[field]
                if value is not None and value != "":
                    try:
                        # Ensure numeric values are within reasonable ranges
                        float_val = float(value)
                        if field == "age" and (float_val < 0 or float_val > 150):
                            raise ValidationError(f"Invalid age value: {float_val}")
                        elif field != "age" and (float_val < 0 or float_val > 10000):
                            raise ValidationError(f"Invalid {field} value: {float_val}")
                        validated_data[field] = float_val
                    except (ValueError, TypeError):
                        raise ValidationError(f"Invalid numeric value for {field}")

        # Sex field validation
        if "sex" in patient_data:
            sex = patient_data["sex"]
            if sex not in ["Male", "Female", "Other"]:
                raise ValidationError("Invalid sex value")
            validated_data["sex"] = sex

        return validated_data


class RateLimitManager:
    """Advanced rate limiting with different strategies"""

    @staticmethod
    def check_rate_limit(identifier, limit_type="api", custom_limit=None):
        """Check if request should be rate limited"""

        # Define different rate limits for different operations
        limits = {
            "api": {"requests": 100, "window": 3600},  # 100 requests per hour
            "login": {"requests": 5, "window": 900},  # 5 login attempts per 15 minutes
            "diagnosis": {"requests": 20, "window": 3600},  # 20 diagnoses per hour
            "email": {"requests": 3, "window": 3600},  # 3 email sends per hour
        }

        if custom_limit:
            limit_config = custom_limit
        else:
            limit_config = limits.get(limit_type, limits["api"])

        cache_key = f"rate_limit:{limit_type}:{identifier}"
        current_count = cache.get(cache_key, 0)

        if current_count >= limit_config["requests"]:
            logger.warning(f"Rate limit exceeded for {identifier} on {limit_type}")
            return False

        # Increment counter
        cache.set(cache_key, current_count + 1, limit_config["window"])
        return True

    @staticmethod
    def rate_limit_decorator(limit_type="api", get_identifier=None):
        """Decorator for rate limiting views"""

        def decorator(view_func):
            @wraps(view_func)
            def wrapper(*args, **kwargs):
                # Handle both function-based views and ViewSet methods
                if len(args) > 0 and hasattr(args[0], "META"):
                    # Function-based view: first arg is request
                    request = args[0]
                    view_args = args[1:]
                elif len(args) > 1 and hasattr(args[1], "META"):
                    # ViewSet method: first arg is self, second is request
                    request = args[1]
                    view_args = args
                else:
                    # Fallback - try to find request in kwargs
                    request = kwargs.get("request")
                    view_args = args
                    if not request:
                        # Cannot find request object, skip rate limiting
                        return view_func(*args, **kwargs)

                # Determine identifier
                if get_identifier:
                    identifier = get_identifier(request)
                else:
                    identifier = request.META.get("REMOTE_ADDR", "unknown")

                if not RateLimitManager.check_rate_limit(identifier, limit_type):
                    return JsonResponse(
                        {
                            "status": "error",
                            "message": "Rate limit exceeded. Please try again later.",
                            "error_code": "RATE_LIMIT_EXCEEDED",
                        },
                        status=429,
                    )

                return view_func(*view_args, **kwargs)

            return wrapper

        return decorator


class SecurityHeaders:
    """Security headers middleware"""

    @staticmethod
    def add_security_headers(response):
        """Add security headers to response"""

        # Prevent clickjacking
        response["X-Frame-Options"] = "DENY"

        # Prevent MIME type sniffing
        response["X-Content-Type-Options"] = "nosniff"

        # XSS protection
        response["X-XSS-Protection"] = "1; mode=block"

        # HSTS (only for HTTPS)
        if getattr(settings, "SECURE_SSL_REDIRECT", False):
            response["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains"  # Content Security Policy
            )
        csp_policy = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "img-src 'self' data: https:; "
            "font-src 'self' https: https://cdn.jsdelivr.net; "
            "connect-src 'self' https:; "
            "frame-ancestors 'none';"
        )
        response["Content-Security-Policy"] = csp_policy

        # Referrer Policy
        response["Referrer-Policy"] = "strict-origin-when-cross-origin"

        return response


class AuditLogger:
    """Security audit logging"""

    @staticmethod
    def log_security_event(event_type, user=None, ip_address=None, details=None):
        """Log security-related events"""

        log_data = {
            "event_type": event_type,
            "timestamp": timezone.now().isoformat(),
            "user": str(user) if user else "anonymous",
            "ip_address": ip_address or "unknown",
            "details": details or {},
        }

        logger.warning(f"Security Event: {log_data}")

        # Store in cache for recent events tracking
        cache_key = f"security_events:{event_type}"
        events = cache.get(cache_key, [])
        events.append(log_data)

        # Keep only last 100 events
        if len(events) > 100:
            events = events[-100:]

        cache.set(cache_key, events, 86400)  # 24 hours    @staticmethod

    @staticmethod
    def log_failed_login(username, ip_address, user_agent=None):
        """Log failed login attempts"""
        AuditLogger.log_security_event(
            "failed_login",
            user=username,
            ip_address=ip_address,
            details={"user_agent": user_agent},
        )

    @staticmethod
    def log_suspicious_activity(
        activity_type, user=None, ip_address=None, details=None
    ):
        """Log suspicious activities"""
        AuditLogger.log_security_event(
            f"suspicious_{activity_type}",
            user=user,
            ip_address=ip_address,
            details=details,
        )

    @staticmethod
    def log_authentication_event(event_type, user=None, ip_address=None, details=None):
        """Log authentication events"""
        AuditLogger.log_security_event(
            f"auth_{event_type}",
            user=user,
            ip_address=ip_address,
            details=details,
        )


class TokenManager:
    """Secure token management"""

    @staticmethod
    def generate_secure_token(length=32):
        """Generate cryptographically secure token"""
        return secrets.token_urlsafe(length)

    @staticmethod
    def hash_token(token, salt=None):
        """Hash token with salt"""
        if salt is None:
            salt = secrets.token_bytes(32)

        token_hash = hashlib.pbkdf2_hmac(
            "sha256", token.encode("utf-8"), salt, 100000  # iterations
        )

        return token_hash, salt

    @staticmethod
    def verify_token(token, token_hash, salt):
        """Verify token against hash"""
        computed_hash, _ = TokenManager.hash_token(token, salt)
        return secrets.compare_digest(computed_hash, token_hash)


# Security middleware
class SecurityMiddleware:
    """Enhanced security middleware"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Add security checks before processing request
        self.security_checks(request)

        response = self.get_response(request)

        # Add security headers to response
        response = SecurityHeaders.add_security_headers(response)

        return response

    def security_checks(self, request):
        """Perform security checks on incoming request"""

        # Check for suspicious headers
        suspicious_headers = ["X-Forwarded-Host", "X-Original-URL", "X-Rewrite-URL"]
        for header in suspicious_headers:
            if header in request.META:
                AuditLogger.log_suspicious_activity(
                    "suspicious_header",
                    ip_address=request.META.get("REMOTE_ADDR"),
                    details={"header": header, "value": request.META[header]},
                )

        # Check for suspicious user agents
        user_agent = request.META.get("HTTP_USER_AGENT", "")
        suspicious_agents = ["sqlmap", "nikto", "nmap", "masscan"]
        if any(agent in user_agent.lower() for agent in suspicious_agents):
            AuditLogger.log_suspicious_activity(
                "suspicious_user_agent",
                ip_address=request.META.get("REMOTE_ADDR"),
                details={"user_agent": user_agent},
            )
