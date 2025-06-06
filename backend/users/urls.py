from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterViewset,
    VerifyEmailView,
    ProfileViewSet,
    CheckEmailView,
    login_redirect_view,
    UserManagementView,
    ContactMeView,
)
from django.urls import include

router = DefaultRouter()
router.register("register", RegisterViewset, basename="register")
router.register("profile", ProfileViewSet, basename="profile")
urlpatterns = router.urls

urlpatterns += [
    path(
        "verify-email/<uidb64>/<token>/", VerifyEmailView.as_view(), name="verify-email"
    ),
    path(
        "reset-password/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
    path("accounts/google/login/redirect/", login_redirect_view, name="login-redirect"),
    path(
        "check-email/", CheckEmailView.as_view(), name="check-email"
    ),  # User Management endpoints    path("admin/users/", UserManagementView.as_view(), name="user-management"),
    path(
        "admin/users/",
        UserManagementView.as_view(),
        name="get-all-users",
    ),
    path(
        "admin/users/<int:user_id>/",
        UserManagementView.as_view(),
        name="user-management-detail",
    ),
    path("contact/me/", ContactMeView.as_view(), name="contact-me"),
]
