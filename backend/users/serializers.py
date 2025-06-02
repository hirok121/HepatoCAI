from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes
import re

User = get_user_model()


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user authentication.
    Handles email and password validation for user login.
    """

    email = serializers.EmailField(help_text="User's email address for authentication")
    password = serializers.CharField(
        help_text="User's password", style={"input_type": "password"}, write_only=True
    )

    def validate(self, attrs):
        """Validate email and password combination."""
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = authenticate(
                request=self.context.get("request"), username=email, password=password
            )

            if not user:
                raise serializers.ValidationError(
                    "Unable to log in with provided credentials.", code="authorization"
                )

            if not user.is_active:
                raise serializers.ValidationError(
                    "User account is disabled.", code="authorization"
                )

            attrs["user"] = user
            return attrs
        else:
            raise serializers.ValidationError(
                "Must include 'email' and 'password'.", code="authorization"
            )

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop("password", None)
        return ret


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Creates new user accounts with email, full name, and password validation.
    """

    password = serializers.CharField(
        write_only=True,
        help_text="User password (minimum 8 characters)",
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = ["id", "full_name", "email", "password"]
        extra_kwargs = {
            "full_name": {"help_text": "User's full name"},
            "email": {"help_text": "Valid email address (will be used as username)"},
            "id": {"read_only": True, "help_text": "Unique user identifier"},
        }

    def validate_password(self, value):
        """Validate password using Django's built-in validators"""
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def validate_email(self, value):
        """Validate email uniqueness"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, attrs):
        """Validate password confirmation and other fields"""
        password = attrs.get("password")
        password_confirm = attrs.pop("password_confirm", None)

        if password != password_confirm:
            raise serializers.ValidationError(
                {"password_confirm": "Password fields do not match."}
            )

        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class EmailCheckSerializer(serializers.Serializer):
    """Serializer for checking email availability during registration."""

    email = serializers.EmailField(help_text="Email address to check for availability")

    def validate_email(self, value):
        """Check if email is already taken"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email address is already in use.")
        return value


class ProfileSerializer(serializers.ModelSerializer):
    """
    Comprehensive user profile serializer.
    Handles user profile information including personal details,
    contact information, account status, and preferences.
    """

    birthday = serializers.DateField(
        required=False,
        allow_null=True,
        help_text="User's date of birth (YYYY-MM-DD format)",
    )
    age = serializers.ReadOnlyField(help_text="Calculated age from birthday")
    display_name = serializers.ReadOnlyField(help_text="Best available display name")
    is_profile_complete = serializers.ReadOnlyField(
        help_text="Whether profile has essential information"
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "birthday",
            "age",
            "full_name",
            "first_name",
            "last_name",
            "display_name",
            "is_profile_complete",
            "profile_picture",
            "is_social_user",
            "social_provider",
            "verified_email",
            # Contact & Location Information
            "phone_number",
            "country",
            "city",
            "timezone",
            # Account Status & Verification
            "phone_verified_at",
            # Activity Tracking (read-only)
            "last_login_ip",
            "login_count",
            "terms_accepted_at",
            "terms_version",
        ]
        read_only_fields = [
            "id",
            "email",
            "age",
            "display_name",
            "is_profile_complete",
            "is_social_user",
            "social_provider",
            "verified_email",
            # Activity tracking fields are read-only
            "last_login_ip",
            "login_count",
            "phone_verified_at",  # Should be updated through verification process
            "terms_accepted_at",
            "terms_version",
        ]
        extra_kwargs = {
            "email": {
                "help_text": "User's email address (read-only after registration)"
            },
            "username": {"help_text": "User's display username"},
            "full_name": {"help_text": "User's complete name"},
            "first_name": {"help_text": "User's first name"},
            "last_name": {"help_text": "User's last name"},
            "profile_picture": {"help_text": "URL to user's profile picture"},
            "phone_number": {"help_text": "User's phone number"},
            "country": {"help_text": "User's country of residence"},
            "city": {"help_text": "User's city of residence"},
            "timezone": {"help_text": "User's preferred timezone"},
        }

    def validate_birthday(self, value):
        """Custom validation for birthday field"""
        from django.utils import timezone

        if value and value > timezone.now().date():
            raise serializers.ValidationError("Birthday cannot be in the future.")
        return value

    def validate_phone_number(self, value):
        """Custom validation for phone number field"""
        if value and len(value) > 20:
            raise serializers.ValidationError(
                "Phone number cannot exceed 20 characters"
            )

        # Optional: Add regex validation for phone format
        if value and not re.match(r"^\+?1?\d{9,15}$", value):
            raise serializers.ValidationError(
                "Phone number must be in format: '+999999999'. Up to 15 digits allowed."
            )
        return value

    def validate_country(self, value):
        """Custom validation for country field"""
        if value and len(value) > 100:
            raise serializers.ValidationError(
                "Country name cannot exceed 100 characters"
            )
        return value

    def validate_city(self, value):
        """Custom validation for city field"""
        if value and len(value) > 100:
            raise serializers.ValidationError("City name cannot exceed 100 characters")
        return value

    def validate_timezone(self, value):
        """Custom validation for timezone field"""
        if value and len(value) > 50:
            raise serializers.ValidationError("Timezone cannot exceed 50 characters")
        return value


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for changing user password"""

    old_password = serializers.CharField(
        write_only=True, help_text="Current password", style={"input_type": "password"}
    )
    new_password = serializers.CharField(
        write_only=True, help_text="New password", style={"input_type": "password"}
    )
    new_password_confirm = serializers.CharField(
        write_only=True,
        help_text="Confirm new password",
        style={"input_type": "password"},
    )

    def validate_old_password(self, value):
        """Validate old password"""
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def validate_new_password(self, value):
        """Validate new password using Django's built-in validators"""
        try:
            validate_password(value, user=self.context["request"].user)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value

    def validate(self, attrs):
        """Validate password confirmation"""
        new_password = attrs.get("new_password")
        new_password_confirm = attrs.get("new_password_confirm")

        if new_password != new_password_confirm:
            raise serializers.ValidationError(
                {"new_password_confirm": "New password fields do not match."}
            )

        return attrs

    def save(self):
        """Save the new password"""
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT token serializer with additional user data"""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token
        token["is_staff"] = user.is_staff
        token["is_superuser"] = user.is_superuser
        token["email"] = user.email
        token["full_name"] = user.full_name
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name
        token["profile_picture"] = user.profile_picture
        token["is_social_user"] = user.is_social_user
        token["social_provider"] = user.social_provider
        # Add location and contact info for convenience
        token["country"] = user.country
        token["city"] = user.city
        token["timezone"] = user.timezone

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra data to the response
        data["user"] = {
            "id": self.user.id,
            "email": self.user.email,
            "is_staff": self.user.is_staff,
            "is_superuser": self.user.is_superuser,
            "full_name": self.user.full_name,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "profile_picture": self.user.profile_picture,
            "is_social_user": self.user.is_social_user,
            "social_provider": self.user.social_provider,
            # Contact & Location Information
            "phone_number": self.user.phone_number,
            "country": self.user.country,
            "city": self.user.city,
            "timezone": self.user.timezone,
        }

        return data
