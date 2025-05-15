from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RegisterViewset, LoginViewSet, UserViewset

router = DefaultRouter()
router.register("register", RegisterViewset, basename="register")
router.register("login", LoginViewSet, basename="login")
router.register("users", UserViewset, basename="users")
urlpatterns = router.urls
