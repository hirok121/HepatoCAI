from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import uuid

User = get_user_model()


class Chat(models.Model):
    """
    Represents a conversation/chat session between a user and the AI assistant.

    Each chat can contain multiple messages and automatically generates titles
    from the first user message for better organization.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the chat conversation",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="chats",
        help_text="User who owns this chat conversation",
    )
    title = models.CharField(
        max_length=255,
        blank=True,
        help_text="Chat title, auto-generated from first message if not provided",
    )
    created_at = models.DateTimeField(
        default=timezone.now, help_text="Timestamp when the chat was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True, help_text="Timestamp when the chat was last modified"
    )
    is_archived = models.BooleanField(
        default=False,
        help_text="Whether the chat is archived (hidden from main list)",
    )

    class Meta:
        ordering = ["-updated_at"]
        verbose_name = "Chat Conversation"
        verbose_name_plural = "Chat Conversations"

    def __str__(self):
        return f"{self.user.username} - {self.title or 'Untitled Chat'}"

    def save(self, *args, **kwargs):
        # Auto-generate title from first message if not set
        if not self.title and self.messages.exists():
            first_message = self.messages.filter(is_from_user=True).first()
            if first_message:
                self.title = first_message.content[:50] + (
                    "..." if len(first_message.content) > 50 else ""
                )
        super().save(*args, **kwargs)


class Message(models.Model):
    """
    Represents individual messages in a chat conversation.

    Messages can be from either the user or the AI assistant, and include
    token usage tracking for monitoring API consumption.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the message",
    )
    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="messages",
        help_text="Chat conversation this message belongs to",
    )
    content = models.TextField(
        help_text="The actual message content (user input or AI response)"
    )
    is_from_user = models.BooleanField(
        default=True,
        help_text="True if message is from user, False if from AI assistant",
    )
    created_at = models.DateTimeField(
        default=timezone.now, help_text="Timestamp when the message was created"
    )
    tokens_used = models.IntegerField(
        null=True,
        blank=True,
        help_text="Number of tokens consumed by AI for this message (for usage tracking)",
    )

    class Meta:
        ordering = ["created_at"]
        verbose_name = "Chat Message"
        verbose_name_plural = "Chat Messages"

    def __str__(self):
        sender = "User" if self.is_from_user else "AI"
        return f"{sender}: {self.content[:50]}..."


class UserProfile(models.Model):
    """
    Extended user profile for AI assistant preferences and usage tracking.

    Tracks user's AI usage statistics, preferences, and activity patterns
    for analytics and quota management.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="ai_profile",
        help_text="User account associated with this AI profile",
    )
    total_tokens_used = models.IntegerField(
        default=0,
        help_text="Total number of AI tokens consumed by this user across all conversations",
    )
    daily_message_count = models.IntegerField(
        default=0,
        help_text="Number of messages sent today (resets daily for rate limiting)",
    )
    last_activity = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp of user's last interaction with AI assistant",
    )
    preferred_model = models.CharField(
        max_length=50,
        default="gpt-3.5-turbo",
        help_text="User's preferred AI model for generating responses",
    )

    class Meta:
        verbose_name = "AI User Profile"
        verbose_name_plural = "AI User Profiles"

    def __str__(self):
        return f"{self.user.username}'s AI Profile"
