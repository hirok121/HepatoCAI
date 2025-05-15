from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("accounts/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("accounts/", include("accounts.urls")),
    path("note/", include("note.urls")),
]
