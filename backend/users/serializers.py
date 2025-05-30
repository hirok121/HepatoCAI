from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop("password", None)
        return ret


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "full_name", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class EmailCheckSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ProfileSerializer(serializers.ModelSerializer):
    birthday = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "birthday",
            "full_name",
            "first_name",
            "last_name",
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
            "email",
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

    def validate_birthday(self, value):
        """Custom validation for birthday field"""
        if value is None or value == "":
            return None
        return value

    def validate_phone_number(self, value):
        """Custom validation for phone number field"""
        if value and len(value) > 20:
            raise serializers.ValidationError(
                "Phone number cannot exceed 20 characters"
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

    def validate_terms_version(self, value):
        """Custom validation for terms version field"""
        if value and len(value) > 10:
            raise serializers.ValidationError(
                "Terms version cannot exceed 10 characters"
            )
        return value


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
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
