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
        ]
        read_only_fields = [
            "email",
            "is_social_user",
            "social_provider",
            "verified_email",
        ]

    def validate_birthday(self, value):
        """Custom validation for birthday field"""
        if value is None or value == "":
            return None
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
        }

        return data
