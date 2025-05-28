from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view, permission_classes
from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    ProfileSerializer,
    EmailCheckSerializer,
    CustomTokenObtainPairSerializer,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model, logout
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.views import View
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth import authenticate, get_user_model
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.shortcuts import render, redirect
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponseRedirect

from allauth.socialaccount.models import SocialAccount, SocialToken

import json
from dotenv import load_dotenv
import os

User = get_user_model()
load_dotenv()


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
    BaseURLFrontend = os.getenv("BaseURLForntend", default="http://localhost:5173")
    jwt_data = request.session.pop("jwt", None)

    if jwt_data:
        access = jwt_data["access"]
        refresh = jwt_data["refresh"]
        # print("JWT data (from login redirect view):", jwt_data) # Debugging line
        return HttpResponseRedirect(
            f"http://localhost:5173/auth/callback?access={access}&refresh={refresh}"
        )

    return HttpResponseRedirect(
        f"http://localhost:5173/auth/callback?error=missing_token"
    )


# TODO: this view is not used anywhere
class SendVerificationEmailView(
    View
):  # TODO if email is not verified then verification email can be sent by this view
    permission_classes = [AllowAny]

    def post(self, request):
        DOMAIN = os.getenv("DOMAIN", default="localhost:8000")
        email = request.POST.get("email")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=404
            )  # TODO redirect to register page with a massage "user not Found"

        if user.is_active:
            return Response(
                {"message": "Email already verified."}
            )  # TODO redirect to login page and show a message "Email already verified"

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        verification_link = f"http://{DOMAIN}/users/verify-email/{uid}/{token}/"

        verificationMail(user.get_full_name(), verification_link, user.email)

        return Response(
            {"message": "Verification email sent."}
        )  # TODO redirect to login page and show a message "Verification email sent"


class VerifyEmailView(View):
    def get(self, request, uidb64, token):
        BaseURLForntend = os.getenv("BaseURLForntend")
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
                context={"login_link": f"http://localhost:5173/signin"},
            )
        else:
            return render(
                request,
                "backend/expiredConfirmationToken.html",
                context={
                    "home": f"http://localhost:5173/",
                },
            )


class LoginViewSet(viewsets.ViewSet):
    #! this is almost the same as the TokenObtainPairView from rest_framework_simplejwt.views
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]
            user = authenticate(request, email=email, password=password)
            if user is not None:
                refresh = RefreshToken.for_user(user)
                return Response(
                    {
                        "user": {
                            "id": user.id,
                            "email": user.email,
                            "username": user.username,
                        },
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    }
                )
            return Response({"error": "Invalid credentials"}, status=401)
        return Response(serializer.errors, status=400)


class CheckEmailView(APIView):
    permission_classes = [AllowAny]
    serializer_class = EmailCheckSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            exists = User.objects.filter(email=email).exists()
            return Response({"exists": exists})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request):
        email = request.data.get("email")
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
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Active user with usable password already exists
            return Response(
                {"email": "A user with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Standard registration flow
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save(is_active=False)
            SendVerificationEmail(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def list(self, request):
        queryset = User.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class ProfileViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = ProfileSerializer

    @action(detail=False, methods=["get", "patch"], url_path="me")
    def me(self, request):
        if request.method == "GET":
            serializer = ProfileSerializer(request.user)
            return Response(serializer.data)

        elif request.method == "PATCH":
            serializer = ProfileSerializer(
                request.user, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)


# logout
def logout_view(request):
    logout(request)
    return redirect("http://localhost:5173/signin")


class UserManagementView(APIView):
    """
    API endpoints for user management - only accessible by superusers
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get list of all users for management"""
        print(f"UserManagementView - request.user: {request.user}")
        print(
            f"UserManagementView - request.user.is_authenticated: {request.user.is_authenticated}"
        )
        print(
            f"UserManagementView - request.user.is_superuser: {getattr(request.user, 'is_superuser', 'No attr')}"
        )
        print(
            f"UserManagementView - Authorization header: {request.headers.get('Authorization', 'No header')}"
        )

        if not request.user.is_superuser:
            return Response(
                {"error": "Only superusers can access user management"},
                status=status.HTTP_403_FORBIDDEN,
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

        return Response(
            {
                "status": "success",
                "data": user_data,
                "total_users": len(user_data),
                "permissions": {
                    "can_promote_to_staff": request.user.is_superuser,
                    "can_promote_to_superuser": request.user.is_superuser,
                    "can_deactivate_users": request.user.is_superuser,
                },
            }
        )

    def patch(self, request, user_id=None):
        """Update user permissions"""
        if not request.user.is_superuser:
            return Response(
                {"error": "Only superusers can modify user permissions"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if not user_id:
            return Response(
                {"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_to_update = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Prevent users from removing their own superuser status
        if user_to_update == request.user and request.data.get("is_superuser") == False:
            return Response(
                {"error": "You cannot remove your own superuser privileges"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update permissions
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

        return Response(
            {
                "status": "success",
                "message": f"User permissions updated successfully",
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
            }
        )


class StaffManagementView(APIView):
    """
    API endpoints for staff management - accessible by staff users
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get list of all users for staff management (limited permissions)"""
        if not request.user.is_staff:
            return Response(
                {"error": "Only staff members can access user management"},
                status=status.HTTP_403_FORBIDDEN,
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

        return Response(
            {
                "status": "success",
                "data": user_data,
                "total_users": len(user_data),
                "permissions": {
                    "can_promote_to_staff": request.user.is_superuser,
                    "can_promote_to_superuser": request.user.is_superuser,
                    "can_deactivate_users": request.user.is_superuser,
                },
            }
        )

    def patch(self, request, user_id=None):
        """Update user staff status (limited permissions)"""
        if not request.user.is_staff:
            return Response(
                {"error": "Only staff members can modify user permissions"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if not user_id:
            return Response(
                {"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_to_update = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Only superusers can promote to staff or superuser
        if not request.user.is_superuser:
            return Response(
                {
                    "error": "Only superusers can promote users to staff or superuser status"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Prevent users from removing their own superuser status
        if user_to_update == request.user and request.data.get("is_superuser") == False:
            return Response(
                {"error": "You cannot remove your own superuser privileges"},
                status=status.HTTP_400_BAD_REQUEST,
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

        return Response(
            {
                "status": "success",
                "message": f"User permissions updated successfully",
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
            }
        )
