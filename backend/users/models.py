from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import RegexValidator
from django.utils import timezone
from dotenv import load_dotenv
import os
import logging

load_dotenv()
logger = logging.getLogger(__name__)


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

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    """
    Custom user model extending Django's AbstractUser with additional fields
    for social authentication, profile information, and activity tracking.
    """

    # Core authentication fields
    email = models.EmailField(
        max_length=254,  # RFC 5321 compliant
        unique=True,
        db_index=True,
        help_text="User's email address used for authentication",
    )

    # Personal information
    birthday = models.DateField(null=True, blank=True, help_text="User's date of birth")
    username = models.CharField(
        max_length=150,  # Django default
        null=True,
        blank=True,
        db_index=True,
        help_text="Display username",
    )
    full_name = models.CharField(
        max_length=300,  # Accommodate longer names
        blank=True,
        default="",
        help_text="User's complete name",
    )
    first_name = models.CharField(
        max_length=150,  # Django default
        blank=True,
        default="",
        help_text="User's first name",
    )
    last_name = models.CharField(
        max_length=150,  # Django default
        blank=True,
        default="",
        help_text="User's last name",
    )
    # Profile and social authentication
    profile_picture = models.URLField(
        max_length=2048,  # URLs can be long
        blank=True,
        default="",
        help_text="URL to user's profile picture",
    )
    google_id = models.CharField(
        max_length=255,  # Google IDs can be long
        blank=True,
        null=True,
        unique=True,
        db_index=True,        help_text="Google account identifier",
    )
    locale = models.CharField(
        max_length=10,
        blank=True,
        default="en-US",
        null=False,
        validators=[
            RegexValidator(
                regex=r"^[a-z]{2}(-[A-Z]{2})?$",
                message="Locale must be in format 'en' or 'en-US'",
            )
        ],
        help_text="User's language preference",
    )
    verified_email = models.BooleanField(
        default=False, help_text="Whether user's email has been verified"
    )
    is_social_user = models.BooleanField(
        default=False, help_text="Whether user registered via social authentication"
    )
    social_provider = models.CharField(
        max_length=50,
        blank=True,
        default="",
        choices=[
            ("google", "Google"),
            ("facebook", "Facebook"),
            ("github", "GitHub"),
            ("linkedin", "LinkedIn"),
        ],
        help_text="Social authentication provider",
    )

    # Contact & Location Information
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        default="",
        validators=[
            RegexValidator(
                regex=r"^\+?1?\d{9,15}$",
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.",
            )
        ],
        help_text="User's phone number in international format",
    )
    country = models.CharField(
        max_length=100, blank=True, default="", help_text="User's country of residence"
    )
    city = models.CharField(
        max_length=100, blank=True, default="", help_text="User's city of residence"
    )
    timezone = models.CharField(
        max_length=50, blank=True, default="UTC", help_text="User's preferred timezone"
    )

    # Account Status & Verification
    phone_verified_at = models.DateTimeField(
        null=True, blank=True, help_text="Timestamp when phone number was verified"
    )

    # Activity Tracking
    last_login_ip = models.GenericIPAddressField(
        null=True, blank=True, help_text="IP address of user's last login"
    )
    login_count = models.PositiveIntegerField(
        default=0, help_text="Total number of successful logins"
    )
    # Terms and Legal
    terms_accepted_at = models.DateTimeField(
        null=True, blank=True, help_text="Timestamp when user accepted terms of service"
    )
    terms_version = models.CharField(
        max_length=10,  # Keep consistent with serializer validation
        blank=True,
        default="",
        help_text="Version of terms accepted by user",
    )

    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True, help_text="Timestamp when user account was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True, help_text="Timestamp when user account was last updated"
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "users_customuser"
        verbose_name = "User"
        verbose_name_plural = "Users"
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["username"]),
            models.Index(fields=["social_provider"]),
            models.Index(fields=["created_at"]),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(birthday__lte=timezone.now().date()),
                name="birthday_not_future",
            ),
            models.CheckConstraint(
                check=models.Q(login_count__gte=0), name="login_count_non_negative"
            ),
            models.UniqueConstraint(
                fields=["google_id"],
                condition=models.Q(google_id__isnull=False),
                name="unique_google_id_when_not_null",
            ),
        ]

    def __str__(self):
        """String representation of the user"""
        return f"{self.email} ({self.get_full_name() or 'No name'})"

    def __repr__(self):
        """Developer-friendly representation of the user"""
        return f"<CustomUser: {self.email}>"

    @property
    def display_name(self):
        """Get the best available display name for the user"""
        if self.full_name and self.full_name.strip():
            return self.full_name.strip()
        elif self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}".strip()
        elif self.first_name:
            return self.first_name.strip()
        elif self.username:
            return self.username
        else:
            return self.email.split("@")[0]

    @property
    def is_profile_complete(self):
        """Check if user profile has essential information"""
        required_fields = [
            self.email,
            self.full_name or (self.first_name and self.last_name),
        ]
        return all(field for field in required_fields)

    @property
    def age(self):
        """Calculate user's age from birthday"""
        if not self.birthday:
            return None
        today = timezone.now().date()
        return (
            today.year
            - self.birthday.year
            - ((today.month, today.day) < (self.birthday.month, self.birthday.day))
        )

    def get_full_name(self):
        """Return the user's full name"""
        if self.full_name and self.full_name.strip():
            return self.full_name.strip()
        elif self.first_name or self.last_name:
            return f"{self.first_name or ''} {self.last_name or ''}".strip()
        return ""

    def get_short_name(self):
        """Return the user's short name"""
        return self.first_name or self.username or self.email.split("@")[0]

    def increment_login_count(self, ip_address=None):
        """Increment login count and update last login IP"""
        self.login_count += 1
        if ip_address:
            self.last_login_ip = ip_address
        self.save(update_fields=["login_count", "last_login_ip"])

    def verify_phone(self):
        """Mark phone number as verified"""
        self.phone_verified_at = timezone.now()
        self.save(update_fields=["phone_verified_at"])

    def accept_terms(self, version):
        """Record terms acceptance"""
        self.terms_accepted_at = timezone.now()
        self.terms_version = version
        self.save(update_fields=["terms_accepted_at", "terms_version"])

    def clean(self):
        """Model validation"""
        from django.core.exceptions import ValidationError

        if self.birthday and self.birthday > timezone.now().date():
            raise ValidationError({"birthday": "Birthday cannot be in the future."})

        if self.social_provider and not self.is_social_user:
            raise ValidationError(
                {"social_provider": "Social provider can only be set for social users."}
            )

        if self.is_social_user and not self.social_provider:
            raise ValidationError(
                {
                    "is_social_user": "Social users must have a social provider specified."
                }
            )

        # Ensure superusers are also staff members
        if self.is_superuser and not self.is_staff:
            raise ValidationError(
                {"is_staff": "Superusers must also be staff members."}
            )

    def save(self, *args, **kwargs):
        # Handle bidirectional relationship between full_name, first_name, and last_name
        self._sync_name_fields()

        # Auto-populate username from email if not provided
        if not self.username and self.email:
            self.username = self.email.split("@")[0]

        # Ensure superusers are also staff members
        if self.is_superuser and not self.is_staff:
            self.is_staff = True

        # Clean the model before saving
        self.full_clean()

        super().save(*args, **kwargs)

    def _sync_name_fields(self):
        """
        Synchronizes full_name, first_name, and last_name fields bidirectionally.

        Logic:
        1. Clean all name fields first
        2. If full_name is provided and component names are missing, split full_name
        3. If full_name is empty but component names exist, build full_name
        4. Handle edge cases gracefully
        """
        # Clean all fields first to avoid issues with whitespace
        self.full_name = (self.full_name or "").strip()
        self.first_name = (self.first_name or "").strip()
        self.last_name = (self.last_name or "").strip()

        # Priority 1: If full_name exists and component names are incomplete, split full_name
        if self.full_name and (not self.first_name or not self.last_name):
            self._split_full_name()

        # Priority 2: If full_name is empty but we have component names, build full_name
        elif not self.full_name and (self.first_name or self.last_name):
            self._build_full_name()

    def _split_full_name(self):
        """
        Split full_name into first_name and last_name components.
        Handles various name formats gracefully.
        """
        if not self.full_name:
            return

        # Split on whitespace and filter out empty strings
        name_parts = [part.strip() for part in self.full_name.split() if part.strip()]

        if len(name_parts) == 0:
            # Empty full_name after cleaning
            self.first_name = ""
            self.last_name = ""
        elif len(name_parts) == 1:
            # Single name - treat as first name
            self.first_name = name_parts[0]
            self.last_name = ""
        elif len(name_parts) == 2:
            # Two parts - first and last name
            self.first_name = name_parts[0]
            self.last_name = name_parts[1]
        else:
            # Multiple parts - first name is all but last, last name is the final part
            self.first_name = " ".join(name_parts[:-1])
            self.last_name = name_parts[-1]

    def _build_full_name(self):
        """
        Build full_name from first_name and last_name components.
        """
        name_parts = []

        if self.first_name:
            name_parts.append(self.first_name)
        if self.last_name:
            name_parts.append(self.last_name)

        self.full_name = " ".join(name_parts)
