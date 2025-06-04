from django.contrib import admin
from .models import Chat, Message, UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "preferred_model",
        "total_tokens_used",
        "daily_message_count",
        "last_activity",
    )
    list_filter = ("preferred_model", "last_activity")
    search_fields = ("user__username", "user__email")
    readonly_fields = ("total_tokens_used", "daily_message_count", "last_activity")


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "is_archived", "created_at", "updated_at")
    list_filter = ("is_archived", "created_at", "updated_at")
    search_fields = ("user__username", "title")
    readonly_fields = ("id", "created_at", "updated_at")
    ordering = ("-updated_at",)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "chat",
        "is_from_user",
        "content_preview",
        "tokens_used",
        "created_at",
    )
    list_filter = ("is_from_user", "created_at")
    search_fields = ("chat__title", "content")
    readonly_fields = ("id", "tokens_used", "created_at")
    ordering = ("-created_at",)

    def content_preview(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content

    content_preview.short_description = "Content Preview"
