# accounts/adapters.py
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.exceptions import ImmediateHttpResponse
from allauth.account.utils import user_email, user_username
from django.contrib.auth import get_user_model

User = get_user_model()


class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        if sociallogin.is_existing:
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

        except User.DoesNotExist:
            pass  # Proceed with the default behavior (create new user)
