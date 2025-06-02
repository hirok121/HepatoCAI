# users/signals.py
from django.conf import settings
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django_rest_passwordreset.signals import reset_password_token_created
from django.contrib.auth.signals import user_logged_in
from dotenv import load_dotenv
import os
import logging

load_dotenv()
logger = logging.getLogger(__name__)


@receiver(reset_password_token_created)
def password_reset_token_created(reset_password_token, *args, **kwargs):
    """
    Handle password reset token creation by sending email to user.

    This signal is triggered when a password reset token is created
    via django_rest_passwordreset package.
    """
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
        from_email=f"HepatoCAI Team <{settings.EMAIL_HOST_USER}>",
        to=[reset_password_token.user.email],
    )

    msg.attach_alternative(html_message, "text/html")
    msg.send()

    logger.info(f"Password reset email sent to: {reset_password_token.user.email}")


@receiver(user_logged_in)
def generate_jwt_on_login(request, user, **kwargs):
    """
    Generate JWT token and update login tracking when user logs in.

    This signal is triggered for all login methods including:
    - Email/password authentication
    - Social authentication (Google OAuth)
    - Admin login
    """
    # Import here to avoid circular import
    from .serializers import CustomTokenObtainPairSerializer
    from utils.ip_utils import update_user_login_tracking

    # Use the custom token serializer to ensure is_staff is included
    refresh = CustomTokenObtainPairSerializer.get_token(user)
    request.session["jwt"] = {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }

    # Update login tracking when user logs in via social auth
    # This is the central place where we track all social auth logins
    if hasattr(user, "socialaccount_set") and user.socialaccount_set.exists():
        update_user_login_tracking(user, request)
        logger.info(f"Login tracking updated for social auth user: {user.email}")

    logger.info(f"JWT generated for user login: {user.email}")
