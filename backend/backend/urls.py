from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import CustomTokenObtainPairView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("accounts/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("accounts/", include("allauth.urls")),  # allauth routes
    path("users/", include("users.urls")),
    path("diagnosis/", include("diagnosis.urls")),
    path("note/", include("note.urls")),
    path("api-auth/", include("rest_framework.urls")),
]
