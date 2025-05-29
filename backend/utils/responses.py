"""
Standardized API response utilities for consistent error handling and response formatting.
"""

from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import (
    ValidationError as DRFValidationError,
    PermissionDenied,
    NotAuthenticated,
)
from django.core.exceptions import ValidationError as DjangoValidationError
from functools import wraps
import logging

logger = logging.getLogger(__name__)


class StandardResponse:
    """Utility class for standardized API responses"""

    @staticmethod
    def success(
        data=None,
        message="Operation successful",
        status_code=status.HTTP_200_OK,
        **kwargs,
    ):
        """Create a standardized success response"""
        response_data = {
            "status": "success",
            "message": message,
        }

        if data is not None:
            response_data["data"] = data

        # Add any additional kwargs to the response
        response_data.update(kwargs)

        return Response(response_data, status=status_code)

    @staticmethod
    def error(
        message="An error occurred",
        status_code=status.HTTP_400_BAD_REQUEST,
        errors=None,
        error_code=None,
        **kwargs,
    ):
        """Create a standardized error response"""
        response_data = {
            "status": "error",
            "message": message,
        }

        if errors is not None:
            response_data["errors"] = errors

        if error_code is not None:
            response_data["error_code"] = error_code

        # Add any additional kwargs to the response
        response_data.update(kwargs)

        # Log the error for debugging
        logger.error(f"API Error: {message} - Status: {status_code}")
        if errors:
            logger.error(f"Error details: {errors}")

        return Response(response_data, status=status_code)

    @staticmethod
    def validation_error(errors, message="Validation failed"):
        """Create a standardized validation error response"""
        return StandardResponse.error(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            errors=errors,
            error_code="VALIDATION_ERROR",
        )

    @staticmethod
    def not_found(message="Resource not found", resource_type=None):
        """Create a standardized not found response"""
        return StandardResponse.error(
            message=message,
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="NOT_FOUND",
            resource_type=resource_type,
        )

    @staticmethod
    def permission_denied(message="Permission denied"):
        """Create a standardized permission denied response"""
        return StandardResponse.error(
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="PERMISSION_DENIED",
        )

    @staticmethod
    def unauthorized(message="Authentication required"):
        """Create a standardized unauthorized response"""
        return StandardResponse.error(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="UNAUTHORIZED",
        )

    @staticmethod
    def server_error(message="Internal server error", exception=None):
        """Create a standardized server error response"""
        logger.error(f"Server Error: {message}")
        if exception:
            logger.exception(f"Exception: {str(exception)}")

        return StandardResponse.error(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="SERVER_ERROR",
        )


def handle_exceptions(func):
    """Decorator to handle common exceptions in API views"""

    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except DRFValidationError as e:
            return StandardResponse.validation_error(
                e.detail if hasattr(e, "detail") else str(e)
            )
        except DjangoValidationError as e:
            return StandardResponse.validation_error(
                e.messages if hasattr(e, "messages") else str(e)
            )
        except PermissionDenied as e:
            return StandardResponse.permission_denied(str(e))
        except NotAuthenticated as e:
            return StandardResponse.unauthorized(str(e))
        except Exception as e:
            return StandardResponse.server_error("An unexpected error occurred", e)

    return wrapper
