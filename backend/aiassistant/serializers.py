from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from typing import Dict, Any, Optional
from .models import Chat, Message, UserProfile


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for Message model with comprehensive field documentation"""

    class Meta:
        model = Message
        fields = ["id", "content", "is_from_user", "created_at"]
        read_only_fields = ["id", "created_at"]

    def to_representation(self, instance):
        """Add additional formatting for API responses"""
        data = super().to_representation(instance)
        # Ensure proper datetime formatting
        if data.get("created_at"):
            data["created_at"] = instance.created_at.isoformat()
        return data


class ChatSerializer(serializers.ModelSerializer):
    """Serializer for Chat model with messages and metadata"""

    messages = MessageSerializer(many=True, read_only=True)
    message_count = serializers.SerializerMethodField(
        help_text="Total number of messages in this chat conversation"
    )
    last_message = serializers.SerializerMethodField(
        help_text="Preview of the most recent message in the chat (truncated to 100 characters)"
    )

    class Meta:
        model = Chat
        fields = [
            "id",
            "title",
            "created_at",
            "updated_at",
            "messages",
            "message_count",
            "last_message",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "messages",
            "message_count",
            "last_message",
        ]
        extra_kwargs = {
            "id": {"help_text": "Unique UUID identifier for the chat"},
            "title": {
                "help_text": "Chat title, auto-generated from first user message if not set",
                "max_length": 255,
                "allow_blank": True,
            },
            "created_at": {"help_text": "Timestamp when the chat was created"},
            "updated_at": {"help_text": "Timestamp when the chat was last modified"},
        }

    @extend_schema_field(serializers.IntegerField)
    def get_message_count(self, obj: Chat) -> int:
        """Get total number of messages in the chat"""
        return obj.messages.count()

    @extend_schema_field(serializers.DictField)
    def get_last_message(self, obj: Chat) -> Optional[Dict[str, Any]]:
        """Get preview of the last message"""
        last_message = obj.messages.last()
        if last_message:
            return {
                "content": (
                    last_message.content[:100] + "..."
                    if len(last_message.content) > 100
                    else last_message.content
                ),
                "is_from_user": last_message.is_from_user,
                "created_at": last_message.created_at.isoformat(),
            }
        return None


class ChatListSerializer(serializers.ModelSerializer):
    """Simplified serializer for chat list view without message details"""

    message_count = serializers.SerializerMethodField(
        help_text="Total number of messages in this chat"
    )
    last_message = serializers.SerializerMethodField(
        help_text="Preview of the most recent message (content truncated to 100 chars)"
    )

    class Meta:
        model = Chat
        fields = [
            "id",
            "title",
            "created_at",
            "updated_at",
            "message_count",
            "last_message",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "message_count",
            "last_message",
        ]
        extra_kwargs = {
            "id": {"help_text": "Unique UUID identifier for the chat"},
            "title": {
                "help_text": "Chat title, auto-generated from first message if empty",
                "max_length": 255,
            },
            "created_at": {"help_text": "Chat creation timestamp in ISO format"},
            "updated_at": {"help_text": "Last modification timestamp in ISO format"},
        }

    @extend_schema_field(serializers.IntegerField)
    def get_message_count(self, obj: Chat) -> int:
        """Get total number of messages in the chat"""
        return obj.messages.count()

    @extend_schema_field(serializers.DictField)
    def get_last_message(self, obj: Chat) -> Optional[Dict[str, Any]]:
        """Get preview of the last message with truncated content"""
        last_message = obj.messages.last()
        if last_message:
            return {
                "content": (
                    last_message.content[:100] + "..."
                    if len(last_message.content) > 100
                    else last_message.content
                ),
                "is_from_user": last_message.is_from_user,
                "created_at": last_message.created_at.isoformat(),
            }
        return None


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model with AI usage statistics"""

    total_chats = serializers.SerializerMethodField(
        help_text="Total number of chat conversations created by the user"
    )

    class Meta:
        model = UserProfile
        fields = [
            "total_tokens_used",
            "daily_message_count",
            "last_activity",
            "preferred_model",
            "total_chats",
        ]
        read_only_fields = [
            "total_tokens_used",
            "daily_message_count",
            "last_activity",
            "total_chats",
        ]
        extra_kwargs = {
            "total_tokens_used": {
                "help_text": "Cumulative number of AI tokens consumed by the user across all conversations"
            },
            "daily_message_count": {
                "help_text": "Number of messages sent by the user today (resets daily)"
            },
            "last_activity": {
                "help_text": "Timestamp of the user's last interaction with the AI assistant"
            },
            "preferred_model": {
                "help_text": "User's preferred AI model for generating responses",
                "max_length": 50,
            },
        }

    @extend_schema_field(serializers.IntegerField)
    def get_total_chats(self, obj: UserProfile) -> int:
        """Get total number of chats created by the user"""
        return Chat.objects.filter(user=obj.user).count()


class MessageCreateSerializer(serializers.Serializer):
    """Serializer for creating new messages with validation"""

    message = serializers.CharField(
        max_length=10000,
        required=True,
        help_text="Message content to send to the AI assistant (max 10,000 characters)",
        style={"base_template": "textarea.html"},
    )

    class Meta:
        extra_kwargs = {
            "message": {
                "help_text": "The message content to send to the AI assistant. Should be clear and specific for best results.",
                "style": {"base_template": "textarea.html"},
            }
        }

    def validate_message(self, value):
        """Validate message content"""
        if not value.strip():
            raise serializers.ValidationError(
                "Message cannot be empty or contain only whitespace"
            )

        if len(value.strip()) < 2:
            raise serializers.ValidationError(
                "Message must be at least 2 characters long"
            )

        return value.strip()
