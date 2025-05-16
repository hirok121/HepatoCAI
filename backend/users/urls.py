from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterViewset,
    LoginViewSet,
    UserViewset,
    SendVerificationEmailView,
    VerifyEmailView,
    ProfileViewSet,
    google_login_view,
    logout_view,
    login_redirect_view,
)
from django.urls import include

router = DefaultRouter()
router.register("register", RegisterViewset, basename="register")
router.register("login", LoginViewSet, basename="login")
router.register("users", UserViewset, basename="users")
router.register("profile", ProfileViewSet, basename="profile")
urlpatterns = router.urls

urlpatterns += [
    path(
        "send-verification-email/",
        SendVerificationEmailView.as_view(),
        name="send-verification-email",
    ),
    path(
        "verify-email/<uidb64>/<token>/", VerifyEmailView.as_view(), name="verify-email"
    ),
    path(
        "password-reset/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
    path("accounts/google/login/redirect/", login_redirect_view, name="login-redirect"),
    # TODO: the login and logout page should not be here , it should be in frontend
    path("glogin/", google_login_view),
    path("logout/", logout_view, name="logout"),
]
