from rest_framework import generics
from .serializers import LoginSerializer, RegisterSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.views import View
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth import authenticate, get_user_model
from dotenv import load_dotenv
import os

User = get_user_model()
load_dotenv()


def SendVerificationEmail(user):
    DOMAIN = os.getenv("DOMAIN", default="localhost:8000")
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    verification_link = f"http://{DOMAIN}/accounts/verify-email/{uid}/{token}/"

    send_mail(
        subject="Verify Your Email for HepatoCAI",
        message=(
            f'Dear {user.get_full_name() or "User"},\n\n'
            "Thank you for registering with HepatoCAI — your trusted assistant for liver disease classification and analysis.\n\n"
            "To activate your account and start using our AI-powered health tools, please verify your email by clicking the link below:\n\n"
            f"{verification_link}\n\n"
            "If you did not sign up for HepatoCAI, please ignore this email.\n\n"
            "Best regards,\n"
            "The HepatoCAI Team"
        ),
        from_email="noreply@hepatocai.com",
        recipient_list=[user.email],
    )


class SendVerificationEmailView(View):
    permission_classes = [AllowAny]

    def post(self, request):
        DOMAIN = os.getenv("DOMAIN", default="localhost:8000")
        email = request.POST.get("email")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        if user.is_active:
            return Response({"message": "Email already verified."})

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        verification_link = f"http://{DOMAIN}/accounts/verify-email/{uid}/{token}/"

        send_mail(
            subject="Verify your HepatoCAI account",
            message=(
                f"Hi {user.username},\n\n"
                "Thanks for registering with HepatoCAI, your AI-powered assistant for liver diagnostics.\n\n"
                f"Please verify your email by clicking the link below:\n{verification_link}\n\n"
                "If you did not register, you can ignore this email.\n\n"
                "— The HepatoCAI Team"
            ),
            from_email="noreply@hepatocai.com",
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response({"message": "Verification email sent."})


class VerifyEmailView(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user and default_token_generator.check_token(user, token):
            user.is_active = True  # ✅ Activate user account
            user.save()
            return HttpResponse(
                "Your email has been verified and your account is now active."
            )
        else:
            return HttpResponse("Verification link is invalid or expired.")


class LoginViewSet(viewsets.ViewSet):
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


class RegisterViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save(is_active=False)  # Set is_active to False initially
            # Send verification email
            SendVerificationEmail(user)
            messages.success(
                request,
                "Registration successful. Please verify your email to activate your account.",
            )
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)


class UserViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def list(self, request):
        queryset = User.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
