from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterViewset,
    LoginViewSet,
    UserViewset,
    SendVerificationEmailView,
    VerifyEmailView,
)

router = DefaultRouter()
router.register("register", RegisterViewset, basename="register")
router.register("login", LoginViewSet, basename="login")
router.register("users", UserViewset, basename="users")
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
]
