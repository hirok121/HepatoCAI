from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django_rest_passwordreset.signals import reset_password_token_created
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from dotenv import load_dotenv
import os

load_dotenv()


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is a required field")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    email = models.EmailField(max_length=200, unique=True)
    birthday = models.DateField(null=True, blank=True)
    username = models.CharField(max_length=200, null=True, blank=True)
    full_name = models.CharField(max_length=200, null=True, blank=True)
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    profile_picture = models.URLField(max_length=500, null=True, blank=True)
    google_id = models.CharField(max_length=100, null=True, blank=True, unique=True)
    locale = models.CharField(
        max_length=10, null=True, blank=True
    )  # Language preference
    verified_email = models.BooleanField(default=False)

    # Social login tracking
    is_social_user = models.BooleanField(default=False)
    social_provider = models.CharField(max_length=50, null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def save(self, *args, **kwargs):
        # Auto-populate full_name from first_name and last_name if not provided
        if not self.full_name and (self.first_name or self.last_name):
            self.full_name = f"{self.first_name or ''} {self.last_name or ''}".strip()

        # Auto-populate username from email if not provided
        if not self.username and self.email:
            self.username = self.email.split("@")[0]

        super().save(*args, **kwargs)


@receiver(reset_password_token_created)
def password_reset_token_created(reset_password_token, *args, **kwargs):
    BaseURLForntend = os.getenv("BaseURLForntend", default="http://localhost:5173")
    token = "{}".format(reset_password_token.key)
    full_link = f"http://localhost:5173/resetpassword/confirm?token={token}"
    print(full_link)

    context = {"full_link": full_link, "email_adress": reset_password_token.user.email}

    html_message = render_to_string("backend/email.html", context=context)
    plain_message = strip_tags(html_message)

    msg = EmailMultiAlternatives(
        subject="Request for resetting password for {title}".format(
            title=reset_password_token.user.email
        ),
        body=plain_message,
        # from_email="sender@example.com",
        from_email=f"HepatoCAI Team <{settings.EMAIL_HOST_USER}>",
        to=[reset_password_token.user.email],
    )

    msg.attach_alternative(html_message, "text/html")
    msg.send()


@receiver(user_logged_in)
def generate_jwt_on_login(request, user, **kwargs):
    # Import here to avoid circular import
    from .serializers import CustomTokenObtainPairSerializer

    # Use the custom token serializer to ensure is_staff is included
    refresh = CustomTokenObtainPairSerializer.get_token(user)
    request.session["jwt"] = {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }
    # print("JWT generated and stored in session:", request.session["jwt"])  # Debugging line
