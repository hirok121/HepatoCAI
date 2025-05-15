from django.contrib import admin
from .models import CustomUser

# Register your models here.


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "username", "is_staff", "is_active")
    search_fields = ("email", "username")
    list_filter = ("is_staff", "is_active")
    ordering = ("-date_joined",)
    list_per_page = 10
    list_display_links = ("id", "email")


admin.site.register(CustomUser, CustomUserAdmin)
