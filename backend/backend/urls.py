from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import CustomTokenObtainPairView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    # API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/swagger/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/docs/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"
    ),
    # Authentication endpoints
    path(
        "accounts/token/", CustomTokenObtainPairView.as_view(), name="get_token_legacy"
    ),
    path("accounts/token/refresh/", TokenRefreshView.as_view(), name="refresh_legacy"),
    path("accounts/", include("allauth.urls")),  # allauth routes
    # API endpoints
    path("users/", include("users.urls")),
    path("diagnosis/", include("diagnosis.urls")),
    path("ai/", include("aiassistant.urls")),
    # DRF browsable API
    path("api-auth/", include("rest_framework.urls")),
]
