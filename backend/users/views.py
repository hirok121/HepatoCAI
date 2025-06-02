from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import (
    ValidationError,
    PermissionDenied,
    NotAuthenticated,
)
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from drf_spectacular.types import OpenApiTypes

from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model, logout, authenticate
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail, EmailMultiAlternatives
from django.views import View
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.contrib import messages
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.shortcuts import render, redirect
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from allauth.socialaccount.models import SocialAccount, SocialToken

from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    ProfileSerializer,
    EmailCheckSerializer,
    CustomTokenObtainPairSerializer,
)
from utils.responses import StandardResponse, handle_exceptions
from utils.security import SecurityValidator, RateLimitManager, AuditLogger
from utils.ip_utils import update_user_login_tracking

import json
import logging
from dotenv import load_dotenv
import os

User = get_user_model()
load_dotenv()
logger = logging.getLogger(__name__)
logger = logging.getLogger(__name__)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # Call the parent post method to handle authentication
        response = super().post(request, *args, **kwargs)

        # If authentication was successful, update login tracking
        if response.status_code == 200:
            # Extract user from the serializer
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                user = serializer.user
                # Update login tracking for email/password authentication
                update_user_login_tracking(user, request)
                logger.info(
                    f"Login tracking updated for user {user.email} via /accounts/token/"
                )

        return response


def verificationMail(name, verification_link, email):
    context = {
        "verification_link": verification_link,
        "email_address": email,
        "name": name or "User",
    }

    html_message = render_to_string("backend/emailConfirm.html", context=context)
    plain_message = strip_tags(html_message)

    msg = EmailMultiAlternatives(
        subject="Request for Confirm your email {title}".format(title=email),
        body=plain_message,
        from_email=f"HepatoCAI Team <{settings.EMAIL_HOST_USER}>",
        to=[email],
    )

    msg.attach_alternative(html_message, "text/html")
    msg.send()


def SendVerificationEmail(user):
    DOMAIN = os.getenv("DOMAIN", default="localhost:8000")
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    verification_link = f"http://{DOMAIN}/users/verify-email/{uid}/{token}/"

    verificationMail(user.get_full_name(), verification_link, user.email)


@login_required
def login_redirect_view(request):
    frontend_url = os.getenv("FRONTEND_URL", default="http://localhost:5173")
    jwt_data = request.session.pop("jwt", None)

    if jwt_data:
        access = jwt_data["access"]
        refresh = jwt_data["refresh"]

        # We're no longer updating login tracking here
        # Login tracking is now handled in the generate_jwt_on_login signal
        logger.info(f"Google OAuth redirect for user: {request.user.email}")

        # print("JWT data (from login redirect view):", jwt_data) # Debugging line
        return HttpResponseRedirect(
            f"{frontend_url}/auth/callback?access={access}&refresh={refresh}"
        )

    return HttpResponseRedirect(f"{frontend_url}/auth/callback?error=missing_token")


class VerifyEmailView(View):
    def get(self, request, uidb64, token):
        frontend_url = os.getenv("FRONTEND_URL", default="http://localhost:5173")
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user and default_token_generator.check_token(user, token):
            user.is_active = True  # ✅ Activate user account
            user.verified_email = True  # ✅ Mark email as verified
            user.save()
            logger.info(f"Email verified successfully for user: {user.email}")
            return render(
                request,
                "backend/confirmationDone.html",
                context={"login_link": f"{frontend_url}/signin"},
            )
        else:
            return render(
                request,
                "backend/expiredConfirmationToken.html",
                context={
                    "home": f"{frontend_url}/",
                },
            )


class CheckEmailView(APIView):
    permission_classes = [AllowAny]
    serializer_class = EmailCheckSerializer

    @extend_schema(
        operation_id="check_email_availability",
        summary="Check email availability",
        description="Check if an email address is already registered in the system.",
        request=EmailCheckSerializer,
        responses={
            200: OpenApiResponse(description="Email check completed successfully"),
            400: OpenApiResponse(description="Invalid email format or input data"),
            429: OpenApiResponse(description="Rate limit exceeded"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["Authentication"],
    )
    @handle_exceptions
    @RateLimitManager.rate_limit_decorator("api")  # 100 requests per hour
    def post(self, request):
        """Check email availability endpoint"""
        client_ip = request.META.get("REMOTE_ADDR")

        # Security validation
        if not SecurityValidator.validate_input_data(request.data):
            AuditLogger.log_suspicious_activity(
                "invalid_email_check_input",
                ip_address=client_ip,
                details={"data_keys": list(request.data.keys())},
            )
            return StandardResponse.error(
                message="Invalid input data detected",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                email = serializer.validated_data["email"]

                # Validate email format
                if not SecurityValidator.validate_email_format(email):
                    AuditLogger.log_suspicious_activity(
                        "invalid_email_format_check",
                        ip_address=client_ip,
                        details={"email": email},
                    )
                    return StandardResponse.error(
                        message="Invalid email format",
                        status_code=status.HTTP_400_BAD_REQUEST,
                    )

                exists = User.objects.filter(email=email).exists()
                return StandardResponse.success(
                    data={"exists": exists},
                    message="Email check completed successfully",
                )
            return StandardResponse.validation_error(serializer.errors)
        except Exception as e:
            logger.error(f"Error in CheckEmailView: {str(e)}")
            return StandardResponse.server_error("Failed to check email", e)


class RegisterViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    @extend_schema(
        operation_id="register_user",
        summary="User registration",
        description="Register a new user account. Account will require email verification before activation.",
        request=RegisterSerializer,
        responses={
            201: OpenApiResponse(description="Registration successful"),
            400: OpenApiResponse(description="Validation error or user already exists"),
            429: OpenApiResponse(description="Rate limit exceeded"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["Authentication"],
    )
    @handle_exceptions
    @RateLimitManager.rate_limit_decorator("api")  # 100 requests per hour
    def create(self, request):
        """User registration endpoint"""
        client_ip = request.META.get("REMOTE_ADDR")

        email = request.data.get("email")
        logger.info(f"Registration attempt for: {email} from IP: {client_ip}")

        existing_user = User.objects.filter(email=email).first()

        if existing_user:
            if not existing_user.has_usable_password() or not existing_user.is_active:
                # Allow update for social login user or inactive account
                serializer = self.serializer_class(
                    existing_user, data=request.data, partial=True
                )
                if serializer.is_valid():
                    user = serializer.save()
                    user.set_password(request.data["password"])
                    user.is_active = False  # Still require verification
                    user.verified_email = False  # Email not yet verified
                    user.save()
                    SendVerificationEmail(user)
                    logger.info(f"Updated existing inactive user: {email}")
                    # AuditLogger.log_authentication_event(
                    #     "user_account_updated", user=user, ip_address=client_ip
                    # )

                    return StandardResponse.success(
                        data=serializer.data,
                        message="Account updated successfully. Please check your email for verification.",
                        status_code=status.HTTP_200_OK,
                    )

                logger.warning(
                    f"Registration validation failed for existing user: {email}"
                )
                return StandardResponse.validation_error(
                    errors=serializer.errors, message="Invalid registration data"
                )

            # Active user with usable password already exists
            # Log the registration attempt
            logger.info(f"Registration attempt for existing active user: {email}")
            # AuditLogger.log_authentication_event(
            #     "duplicate_registration_attempt",
            #     ip_address=client_ip,
            #     details={"email": email},
            # )
            return StandardResponse.error(
                message="A user with this email already exists.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )  # Standard registration flow
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save(is_active=False)
            user.verified_email = False  # Email not yet verified
            user.save()
            SendVerificationEmail(user)
            logger.info(f"Successfully registered new user: {email}")
            # AuditLogger.log_authentication_event(
            #     "successful_registration", user=user, ip_address=client_ip
            # )

            return StandardResponse.success(
                data=serializer.data,
                message="Registration successful! Please check your email for verification.",
                status_code=status.HTTP_201_CREATED,
            )

        logger.warning(f"Registration validation failed: {serializer.errors}")
        return StandardResponse.validation_error(
            errors=serializer.errors, message="Invalid registration data"
        )


class ProfileViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = ProfileSerializer

    @extend_schema(
        operation_id="user_profile",
        summary="User profile operations",
        description="Get or update the authenticated user's profile information.",
        request=ProfileSerializer,
        responses={
            200: OpenApiResponse(description="Profile operation successful"),
            400: OpenApiResponse(description="Validation error"),
            401: OpenApiResponse(description="Authentication required"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["User Profile"],
    )
    @action(detail=False, methods=["get", "patch"], url_path="me")
    @handle_exceptions
    def me(self, request):
        """User profile endpoint"""
        if request.method == "GET":
            logger.info(f"Profile requested by: {request.user.email}")
            serializer = ProfileSerializer(request.user)

            return StandardResponse.success(
                data=serializer.data, message="Profile retrieved successfully"
            )

        elif request.method == "PATCH":
            logger.info(f"Profile update attempted by: {request.user.email}")
            logger.info(f"Profile update data received: {request.data}")
            serializer = ProfileSerializer(
                request.user, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                logger.info(f"Profile updated successfully for: {request.user.email}")

                return StandardResponse.success(
                    data=serializer.data, message="Profile updated successfully"
                )

            logger.warning(
                f"Profile update validation failed for: {request.user.email}"
            )
            logger.warning(f"Validation errors: {serializer.errors}")
            return StandardResponse.validation_error(
                errors=serializer.errors, message="Invalid profile data"
            )


class UserManagementView(APIView):
    """
    Unified API endpoints for user management - accessible by staff, modifiable by superusers only
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id="user_management_list",
        summary="List all users",
        description="Get comprehensive list of all users for admin management. Accessible by staff, only superusers can modify.",
        responses={
            200: OpenApiResponse(description="Users retrieved successfully"),
            403: OpenApiResponse(description="Permission denied - staff required"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["User Management"],
    )
    @handle_exceptions
    def get(self, request):
        """Get list of all users for management"""
        logger.info(f"UserManagementView - request.user: {request.user}")
        logger.info(
            f"UserManagementView - request.user.is_authenticated: {request.user.is_authenticated}"
        )
        logger.info(
            f"UserManagementView - request.user.is_staff: {getattr(request.user, 'is_staff', 'No attr')}"
        )
        logger.info(
            f"UserManagementView - request.user.is_superuser: {getattr(request.user, 'is_superuser', 'No attr')}"
        )

        try:
            # Check for export parameter
            export_format = request.GET.get("export")
            if export_format == "csv":
                return self.export_users(request)

            # Allow access to staff members, but only superusers can modify
            if not request.user.is_staff:
                return StandardResponse.permission_denied(
                    "Only staff members can access user management"
                )

            users = User.objects.all().order_by("-date_joined")
            user_data = []

            # Calculate statistics
            total_users = users.count()
            active_users = users.filter(is_active=True).count()
            staff_users = users.filter(is_staff=True).count()
            super_users = users.filter(is_superuser=True).count()

            # Get new users this week
            from datetime import datetime, timedelta

            week_ago = datetime.now() - timedelta(days=7)
            new_users_this_week = users.filter(date_joined__gte=week_ago).count()

            # Get recent logins (last 24 hours)
            day_ago = datetime.now() - timedelta(days=1)
            recent_logins = users.filter(last_login__gte=day_ago).count()

            for user in users:
                user_data.append(
                    {
                        "id": user.id,
                        "email": user.email,
                        "full_name": user.full_name
                        or f"{user.first_name} {user.last_name}".strip()
                        or user.username,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "username": user.username,
                        "is_staff": user.is_staff,
                        "is_superuser": user.is_superuser,
                        "is_active": user.is_active,
                        "verified_email": user.verified_email,
                        "is_social_user": user.is_social_user,
                        "social_provider": user.social_provider,
                        "date_joined": user.date_joined,
                        "last_login": user.last_login,
                        "profile_picture": user.profile_picture,
                        # Contact & Location Information
                        "phone_number": user.phone_number,
                        "country": user.country,
                        "city": user.city,
                        "timezone": user.timezone,
                        # Activity Tracking
                        "last_login_ip": user.last_login_ip,
                        "login_count": user.login_count,
                        "phone_verified_at": user.phone_verified_at,
                        "terms_accepted_at": user.terms_accepted_at,
                        "terms_version": user.terms_version,
                    }
                )

            return StandardResponse.success(
                data=user_data,
                message="Users retrieved successfully",
                total_users=total_users,
                statistics={
                    "total_users": total_users,
                    "active_users": active_users,
                    "staff_users": staff_users,
                    "super_users": super_users,
                    "new_users_this_week": new_users_this_week,
                    "recent_logins": recent_logins,
                },
                permissions={
                    "can_view_users": request.user.is_staff,
                    "can_promote_to_staff": request.user.is_superuser,
                    "can_promote_to_superuser": request.user.is_superuser,
                    "can_deactivate_users": request.user.is_superuser,
                    "can_modify_permissions": request.user.is_superuser,
                },
            )

        except Exception as e:
            logger.error(f"Error in UserManagementView.get: {str(e)}")
            return StandardResponse.server_error("Failed to retrieve users", e)

    @extend_schema(
        operation_id="user_management_update",
        summary="Update user permissions",
        description="Update user permissions following hierarchy (user -> staff -> superuser). Only accessible by superusers.",
        parameters=[
            OpenApiParameter(
                "user_id",
                OpenApiTypes.INT,
                OpenApiParameter.PATH,
                description="ID of the user to update",
            )
        ],
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "action": {
                        "type": "string",
                        "enum": [
                            "promote_to_staff",
                            "promote_to_superuser",
                            "demote_from_staff",
                            "demote_from_superuser",
                            "activate",
                            "deactivate",
                        ],
                        "description": "Action to perform on user",
                    },
                    "is_staff": {
                        "type": "boolean",
                        "description": "Staff status (deprecated - use action instead)",
                    },
                    "is_superuser": {
                        "type": "boolean",
                        "description": "Superuser status (deprecated - use action instead)",
                    },
                    "is_active": {
                        "type": "boolean",
                        "description": "Account activation status",
                    },
                },
            }
        },
        responses={
            200: OpenApiResponse(description="User permissions updated successfully"),
            400: OpenApiResponse(description="Bad request - invalid data"),
            403: OpenApiResponse(description="Permission denied"),
            404: OpenApiResponse(description="User not found"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["User Management"],
    )
    @handle_exceptions
    def patch(self, request, user_id=None):
        """Update user permissions following hierarchy"""
        try:
            if not request.user.is_superuser:
                return StandardResponse.permission_denied(
                    "Only superusers can modify user permissions"
                )

            if not user_id:
                return StandardResponse.error(
                    "User ID is required", status.HTTP_400_BAD_REQUEST
                )

            try:
                user_to_update = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return StandardResponse.not_found("User not found", "user")

            # Prevent users from removing their own superuser status
            if user_to_update == request.user and (
                request.data.get("is_superuser") == False
                or request.data.get("action")
                in ["demote_from_superuser", "demote_from_staff"]
            ):
                return StandardResponse.error(
                    "You cannot remove your own superuser privileges",
                    status.HTTP_400_BAD_REQUEST,
                )

            action = request.data.get("action")

            # Handle hierarchical promotion/demotion
            if action:
                if action == "promote_to_staff":
                    if user_to_update.is_superuser:
                        return StandardResponse.error(
                            "User is already a superuser (higher than staff)",
                            status.HTTP_400_BAD_REQUEST,
                        )
                    user_to_update.is_staff = True

                elif action == "promote_to_superuser":
                    user_to_update.is_staff = True  # Superuser must be staff
                    user_to_update.is_superuser = True

                elif action == "demote_from_superuser":
                    user_to_update.is_superuser = False
                    # Keep staff status unless explicitly demoting further

                elif action == "demote_from_staff":
                    if user_to_update.is_superuser:
                        return StandardResponse.error(
                            "Cannot demote from staff while user is superuser. Demote from superuser first.",
                            status.HTTP_400_BAD_REQUEST,
                        )
                    user_to_update.is_staff = False

                elif action == "activate":
                    user_to_update.is_active = True

                elif action == "deactivate":
                    user_to_update.is_active = False

                else:
                    return StandardResponse.error(
                        "Invalid action specified",
                        status.HTTP_400_BAD_REQUEST,
                    )
            else:
                # Legacy support for direct field updates
                if "is_staff" in request.data:
                    if not request.data["is_staff"] and user_to_update.is_superuser:
                        return StandardResponse.error(
                            "Cannot remove staff status from superuser. Demote from superuser first.",
                            status.HTTP_400_BAD_REQUEST,
                        )
                    user_to_update.is_staff = request.data["is_staff"]

                if "is_superuser" in request.data:
                    user_to_update.is_superuser = request.data["is_superuser"]
                    # If promoting to superuser, also make them staff
                    if request.data["is_superuser"]:
                        user_to_update.is_staff = True

                if "is_active" in request.data:
                    user_to_update.is_active = request.data["is_active"]

            user_to_update.save()

            logger.info(
                f"User permissions updated for {user_to_update.email} by {request.user.email}. "
                f"Action: {action or 'direct_update'}, Staff: {user_to_update.is_staff}, "
                f"Superuser: {user_to_update.is_superuser}, Active: {user_to_update.is_active}"
            )

            return StandardResponse.success(
                data={
                    "user": {
                        "id": user_to_update.id,
                        "email": user_to_update.email,
                        "full_name": user_to_update.full_name
                        or f"{user_to_update.first_name} {user_to_update.last_name}".strip()
                        or user_to_update.username,
                        "is_staff": user_to_update.is_staff,
                        "is_superuser": user_to_update.is_superuser,
                        "is_active": user_to_update.is_active,
                    }
                },
                message="User permissions updated successfully",
            )
        except Exception as e:
            logger.error(f"Error in UserManagementView.patch: {str(e)}")
            return StandardResponse.server_error("Failed to update user permissions", e)

    def export_users(self, request):
        """Export users data as CSV"""
        try:
            if not request.user.is_staff:
                return StandardResponse.permission_denied(
                    "Only staff members can export user data"
                )

            users = User.objects.all().order_by("-date_joined")

            import csv
            from django.http import HttpResponse

            response = HttpResponse(content_type="text/csv")
            response["Content-Disposition"] = 'attachment; filename="users_export.csv"'

            writer = csv.writer(response)
            writer.writerow(
                [
                    "ID",
                    "Email",
                    "Full Name",
                    "First Name",
                    "Last Name",
                    "Username",
                    "Is Staff",
                    "Is Superuser",
                    "Is Active",
                    "Verified Email",
                    "Is Social User",
                    "Social Provider",
                    "Date Joined",
                    "Last Login",
                    "Phone Number",
                    "Country",
                    "City",
                    "Timezone",
                    "Login Count",
                ]
            )

            for user in users:
                writer.writerow(
                    [
                        user.id,
                        user.email,
                        user.full_name,
                        user.first_name,
                        user.last_name,
                        user.username,
                        user.is_staff,
                        user.is_superuser,
                        user.is_active,
                        user.verified_email,
                        user.is_social_user,
                        user.social_provider,
                        user.date_joined,
                        user.last_login,
                        user.phone_number,
                        user.country,
                        user.city,
                        user.timezone,
                        user.login_count,
                    ]
                )

            return response

        except Exception as e:
            logger.error(f"Error in export_users: {str(e)}")
            return StandardResponse.server_error("Failed to export users", e)
