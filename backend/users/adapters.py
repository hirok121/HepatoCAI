# accounts/adapters.py
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.exceptions import ImmediateHttpResponse
from allauth.account.utils import user_email, user_username
from django.contrib.auth import get_user_model
from utils.ip_utils import update_user_login_tracking
import logging

User = get_user_model()
logger = logging.getLogger(__name__)


class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        if sociallogin.is_existing:
            # We no longer update login tracking here to avoid multiple counts
            # This is now handled in the generate_jwt_on_login signal
            logger.info(
                f"Google OAuth existing user detected: {sociallogin.user.email}"
            )
            return

        email = user_email(sociallogin.user)
        if not email:
            return

        try:
            user = User.objects.get(email=email)

            # Optionally activate inactive users here
            if not user.is_active:
                user.is_active = True
                user.save()

            # Connect social account to existing user
            sociallogin.connect(request, user)

            # We no longer update login tracking here to avoid multiple counts
            logger.info(f"Google OAuth connected to existing user: {user.email}")

        except User.DoesNotExist:
            pass  # Proceed with the default behavior (create new user)

    def save_user(self, request, sociallogin, form=None):
        """
        Save user with additional information from Google OAuth
        """
        user = super().save_user(request, sociallogin, form)

        # Get extra data from Google
        if sociallogin.account.provider == "google":
            extra_data = sociallogin.account.extra_data

            # Populate user fields with Google data
            user.google_id = extra_data.get("id")
            user.first_name = extra_data.get("given_name", "")
            user.last_name = extra_data.get("family_name", "")
            user.profile_picture = extra_data.get("picture")
            user.locale = extra_data.get("locale")
            user.verified_email = extra_data.get("verified_email", False)
            user.is_social_user = True
            user.social_provider = "google"

            # Auto-activate user since Google has verified the email
            user.is_active = True

            # Build full_name from Google data
            if user.first_name or user.last_name:
                user.full_name = f"{user.first_name} {user.last_name}".strip()
            elif extra_data.get("name"):
                user.full_name = extra_data.get("name")

                # Set username from email if not provided            if not user.username:
                user.username = user.email.split("@")[0]

            user.save()

            # We no longer update login tracking here to avoid multiple counts
            # Login tracking will be handled by generate_jwt_on_login signal
            logger.info(f"Google OAuth new user created: {user.email}")

        return user

    def populate_user(self, request, sociallogin, data):
        """
        Populate user instance with data from social account
        """
        user = super().populate_user(request, sociallogin, data)

        if sociallogin.account.provider == "google":
            extra_data = sociallogin.account.extra_data

            # Set additional fields during user creation
            user.google_id = extra_data.get("id")
            user.first_name = extra_data.get("given_name", "")
            user.last_name = extra_data.get("family_name", "")
            user.profile_picture = extra_data.get("picture")
            user.locale = extra_data.get("locale")
            user.verified_email = extra_data.get("verified_email", False)
            user.is_social_user = True
            user.social_provider = "google"

            # Build full_name
            if user.first_name or user.last_name:
                user.full_name = f"{user.first_name} {user.last_name}".strip()
            elif extra_data.get("name"):
                user.full_name = extra_data.get("name")

        return user
