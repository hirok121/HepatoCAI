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
from utils.performance import RateLimiter

import json
import logging
from dotenv import load_dotenv
import os

User = get_user_model()
load_dotenv()
logger = logging.getLogger(__name__)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


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
        # print("JWT data (from login redirect view):", jwt_data) # Debugging line
        return HttpResponseRedirect(
            f"{frontend_url}/auth/callback?access={access}&refresh={refresh}"
        )

    return HttpResponseRedirect(f"{frontend_url}/auth/callback?error=missing_token")


# TODO: this view is not used anywhere
class SendVerificationEmailView(
    View
):  # TODO if email is not verified then verification email can be sent by this view
    permission_classes = [AllowAny]

    @handle_exceptions
    def post(self, request):
        DOMAIN = os.getenv("DOMAIN", default="localhost:8000")
        email = request.POST.get("email")

        if not email:
            logger.warning("Verification email request without email address")
            return StandardResponse.error(
                message="Email address is required",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            logger.warning(
                f"Verification email requested for non-existent user: {email}"
            )
            return StandardResponse.not_found(
                message="User not found", resource_type="user"
            )

        if user.is_active:
            logger.info(
                f"Verification email requested for already active user: {email}"
            )
            return StandardResponse.success(message="Email already verified")

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        verification_link = f"http://{DOMAIN}/users/verify-email/{uid}/{token}/"

        try:
            verificationMail(user.get_full_name(), verification_link, user.email)
            logger.info(f"Verification email sent successfully to: {email}")

            return StandardResponse.success(
                message="Verification email sent successfully"
            )
        except Exception as e:
            logger.error(f"Failed to send verification email to {email}: {str(e)}")
            return StandardResponse.server_error(
                message="Failed to send verification email", error=e
            )


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
            user.save()
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


class LoginViewSet(viewsets.ViewSet):
    #! this is almost the same as the TokenObtainPairView from rest_framework_simplejwt.views
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    @handle_exceptions
    @RateLimiter.rate_limit_view(limit=5, window=300)  # 5 attempts per 5 minutes
    def create(self, request):
        # Security validation for login attempt
        client_ip = request.META.get("REMOTE_ADDR")

        # Validate input data for XSS and injection attempts
        if not SecurityValidator.validate_input_data(request.data):
            AuditLogger.log_suspicious_activity(
                "invalid_login_input",
                ip_address=client_ip,
                details={"data_keys": list(request.data.keys())},
            )
            return StandardResponse.error(
                message="Invalid input data detected",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        logger.info(
            f"Login attempt for: {request.data.get('email', 'Unknown')} from IP: {client_ip}"
        )

        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Login validation failed: {serializer.errors}")
            return StandardResponse.validation_error(
                errors=serializer.errors, message="Invalid login data provided"
            )

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        # Additional security check for email format
        if not SecurityValidator.validate_email_format(email):
            AuditLogger.log_suspicious_activity(
                "invalid_email_format_login",
                ip_address=client_ip,
                details={"email": email},
            )
            return StandardResponse.error(
                message="Invalid email format", status_code=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, email=email, password=password)

        if user is not None:
            if not user.is_active:
                logger.warning(f"Inactive user login attempt: {email}")
                AuditLogger.log_authentication_event(
                    "inactive_login_attempt", user=user, ip_address=client_ip
                )
                return StandardResponse.error(
                    message="Account is not active. Please verify your email.",
                    status_code=status.HTTP_401_UNAUTHORIZED,
                )

            refresh = RefreshToken.for_user(user)
            logger.info(f"Successful login for user: {email}")
            AuditLogger.log_authentication_event(
                "successful_login", user=user, ip_address=client_ip
            )

            return StandardResponse.success(
                data={
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "username": user.username,
                        "full_name": user.full_name,
                        "is_staff": user.is_staff,
                        "is_superuser": user.is_superuser,
                    },
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                message="Login successful",
            )

        logger.warning(f"Failed login attempt for: {email} from IP: {client_ip}")
        AuditLogger.log_authentication_event(
            "failed_login_attempt", ip_address=client_ip, details={"email": email}
        )
        return StandardResponse.error(
            message="Invalid credentials", status_code=status.HTTP_401_UNAUTHORIZED
        )


class CheckEmailView(APIView):
    permission_classes = [AllowAny]
    serializer_class = EmailCheckSerializer

    @handle_exceptions
    @RateLimiter.rate_limit_view(limit=10, window=300)  # 10 checks per 5 minutes
    def post(self, request):
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

    @handle_exceptions
    @RateLimiter.rate_limit_view(limit=3, window=600)  # 3 registrations per 10 minutes
    def create(self, request):
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

            # Active user with usable password already exists            # Log the registration attempt
            logger.info(f"Registration attempt for existing active user: {email}")
            # AuditLogger.log_authentication_event(
            #     "duplicate_registration_attempt",
            #     ip_address=client_ip,
            #     details={"email": email},
            # )
            return StandardResponse.error(
                message="A user with this email already exists.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        # Standard registration flow
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save(is_active=False)
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


class UserViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    @handle_exceptions
    def list(self, request):
        logger.info(f"User list requested by: {request.user.email}")

        queryset = User.objects.all()
        serializer = self.serializer_class(queryset, many=True)

        return StandardResponse.success(
            data=serializer.data, message="Users retrieved successfully"
        )


class ProfileViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = ProfileSerializer

    @action(detail=False, methods=["get", "patch"], url_path="me")
    @handle_exceptions
    def me(self, request):
        if request.method == "GET":
            logger.info(f"Profile requested by: {request.user.email}")
            serializer = ProfileSerializer(request.user)

            return StandardResponse.success(
                data=serializer.data, message="Profile retrieved successfully"
            )

        elif request.method == "PATCH":
            logger.info(f"Profile update attempted by: {request.user.email}")
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
            return StandardResponse.validation_error(
                errors=serializer.errors, message="Invalid profile data"
            )


# logout
def logout_view(request):
    frontend_url = os.getenv("FRONTEND_URL", default="http://localhost:5173")
    logout(request)
    return redirect(f"{frontend_url}/signin")


class UserManagementView(APIView):
    """
    API endpoints for user management - only accessible by superusers
    """

    permission_classes = [IsAuthenticated]

    @handle_exceptions
    def get(self, request):
        """Get list of all users for management"""
        logger.info(f"UserManagementView - request.user: {request.user}")
        logger.info(
            f"UserManagementView - request.user.is_authenticated: {request.user.is_authenticated}"
        )
        logger.info(
            f"UserManagementView - request.user.is_superuser: {getattr(request.user, 'is_superuser', 'No attr')}"
        )

        try:
            if not request.user.is_superuser:
                return StandardResponse.permission_denied(
                    "Only superusers can access user management"
                )

            users = User.objects.all().order_by("-date_joined")
            user_data = []

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
                        "is_social_user": user.is_social_user,
                        "social_provider": user.social_provider,
                        "date_joined": user.date_joined,
                        "last_login": user.last_login,
                        "profile_picture": user.profile_picture,
                    }
                )

            return StandardResponse.success(
                data=user_data,
                message="Users retrieved successfully",
                total_users=len(user_data),
                permissions={
                    "can_promote_to_staff": request.user.is_superuser,
                    "can_promote_to_superuser": request.user.is_superuser,
                    "can_deactivate_users": request.user.is_superuser,
                },
            )
        except Exception as e:
            logger.error(f"Error in UserManagementView.get: {str(e)}")
            return (
                StandardResponse.server_error("Failed to retrieve users", e)
                @ handle_exceptions
            )

    def patch(self, request, user_id=None):
        """Update user permissions"""
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
            if (
                user_to_update == request.user
                and request.data.get("is_superuser") == False
            ):
                return StandardResponse.error(
                    "You cannot remove your own superuser privileges",
                    status.HTTP_400_BAD_REQUEST,
                )  # Update permissions
            if "is_staff" in request.data:
                user_to_update.is_staff = request.data["is_staff"]

            if "is_superuser" in request.data:
                user_to_update.is_superuser = request.data["is_superuser"]
                # If promoting to superuser, also make them staff
                if request.data["is_superuser"]:
                    user_to_update.is_staff = True

            if "is_active" in request.data:
                user_to_update.is_active = request.data["is_active"]

            user_to_update.save()

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


class StaffManagementView(APIView):
    """
    API endpoints for staff management - accessible by staff users
    """

    permission_classes = [IsAuthenticated]

    @handle_exceptions
    def get(self, request):
        """Get list of all users for staff management (limited permissions)"""
        if not request.user.is_staff:
            return StandardResponse.permission_denied(
                "Only staff members can access user management"
            )

        users = User.objects.all().order_by("-date_joined")
        user_data = []

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
                    "is_social_user": user.is_social_user,
                    "social_provider": user.social_provider,
                    "date_joined": user.date_joined,
                    "last_login": user.last_login,
                }
            )

        return StandardResponse.success(
            data=user_data,
            message="Users retrieved successfully",
            total_users=len(user_data),
            permissions={
                "can_promote_to_staff": request.user.is_superuser,
                "can_promote_to_superuser": request.user.is_superuser,
                "can_deactivate_users": request.user.is_superuser,
            },
        )

    @handle_exceptions
    def patch(self, request, user_id=None):
        """Update user staff status (limited permissions)"""
        if not request.user.is_staff:
            return StandardResponse.permission_denied(
                "Only staff members can modify user permissions"
            )

        if not user_id:
            return StandardResponse.error(
                "User ID is required", status.HTTP_400_BAD_REQUEST
            )

        try:
            user_to_update = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return StandardResponse.not_found("User not found", "user")

        # Only superusers can promote to staff or superuser
        if not request.user.is_superuser:
            return StandardResponse.permission_denied(
                "Only superusers can promote users to staff or superuser status"
            )

        # Prevent users from removing their own superuser status
        if user_to_update == request.user and request.data.get("is_superuser") == False:
            return StandardResponse.error(
                "You cannot remove your own superuser privileges",
                status.HTTP_400_BAD_REQUEST,
            )

        # Update permissions
        if "is_staff" in request.data:
            user_to_update.is_staff = request.data["is_staff"]

        if "is_superuser" in request.data:
            user_to_update.is_superuser = request.data["is_superuser"]
            # If promoting to superuser, also make them staff
            if request.data["is_superuser"]:
                user_to_update.is_staff = True

        user_to_update.save()

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
                },
            },
            message="User permissions updated successfully",
        )
