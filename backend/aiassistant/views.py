from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from drf_spectacular.types import OpenApiTypes
import json
from .models import Chat, Message, UserProfile
from .serializers import (
    ChatSerializer,
    MessageSerializer,
    UserProfileSerializer,
    ChatListSerializer,
    MessageCreateSerializer,
)
from .AiModels.Gemini import gemini_assistant


class ChatListView(APIView):
    """Get all chats for the authenticated user or create a new chat"""

    permission_classes = [IsAuthenticated]
    serializer_class = ChatListSerializer

    @extend_schema(
        operation_id="list_chats",
        summary="List user chats",
        description="Retrieve all chat conversations for the authenticated user with message counts and last message previews.",
        responses={
            200: OpenApiResponse(
                response=ChatListSerializer(many=True),
                description="Chat list retrieved successfully",
            ),
            401: OpenApiResponse(description="Authentication required"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["AI Assistant", "Chats"],
    )
    def get(self, request):
        """Get all chats for the user"""
        try:
            chats = Chat.objects.filter(user=request.user)
            chat_data = []

            for chat in chats:
                # Get the last message for preview
                last_message = chat.messages.last()
                chat_info = {
                    "id": str(chat.id),
                    "title": chat.title,
                    "created_at": chat.created_at.isoformat(),
                    "updated_at": chat.updated_at.isoformat(),
                    "message_count": chat.messages.count(),
                    "last_message": (
                        {
                            "content": (
                                last_message.content[:100] + "..."
                                if last_message and len(last_message.content) > 100
                                else last_message.content if last_message else None
                            ),
                            "is_from_user": (
                                last_message.is_from_user if last_message else None
                            ),
                            "created_at": (
                                last_message.created_at.isoformat()
                                if last_message
                                else None
                            ),
                        }
                        if last_message
                        else None
                    ),
                }
                chat_data.append(chat_info)

            return Response(
                {"success": True, "chats": chat_data, "total": len(chat_data)},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @extend_schema(
        operation_id="create_chat",
        summary="Create new chat",
        description="Create a new chat conversation for the authenticated user.",
        responses={
            201: OpenApiResponse(
                response=ChatSerializer, description="Chat created successfully"
            ),
            401: OpenApiResponse(description="Authentication required"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["AI Assistant", "Chats"],
    )
    def post(self, request):
        """Create a new chat"""
        try:
            # Create new chat
            chat = Chat.objects.create(user=request.user)

            return Response(
                {
                    "success": True,
                    "chat": {
                        "id": str(chat.id),
                        "title": chat.title,
                        "created_at": chat.created_at.isoformat(),
                        "updated_at": chat.updated_at.isoformat(),
                        "message_count": 0,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ChatDetailView(APIView):
    """Get, update, or delete a specific chat"""

    permission_classes = [IsAuthenticated]
    serializer_class = ChatSerializer

    @extend_schema(
        operation_id="get_chat_detail",
        summary="Get chat details",
        description="Retrieve complete chat conversation with all messages for the authenticated user.",
        parameters=[
            OpenApiParameter(
                "chat_id",
                OpenApiTypes.UUID,
                OpenApiParameter.PATH,
                description="UUID of the chat to retrieve",
            ),
        ],
        responses={
            200: OpenApiResponse(
                response=ChatSerializer,
                description="Chat details retrieved successfully",
            ),
            401: OpenApiResponse(description="Authentication required"),
            404: OpenApiResponse(description="Chat not found"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["AI Assistant", "Chats"],
    )
    def get(self, request, chat_id):
        """Get chat details with all messages"""
        try:
            chat = get_object_or_404(Chat, id=chat_id, user=request.user)
            messages = chat.messages.all()

            message_data = []
            for message in messages:
                message_data.append(
                    {
                        "id": str(message.id),
                        "content": message.content,
                        "is_from_user": message.is_from_user,
                        "created_at": message.created_at.isoformat(),
                    }
                )

            return Response(
                {
                    "success": True,
                    "chat": {
                        "id": str(chat.id),
                        "title": chat.title,
                        "created_at": chat.created_at.isoformat(),
                        "updated_at": chat.updated_at.isoformat(),
                        "messages": message_data,
                    },
                },
                status=status.HTTP_200_OK,
            )

        except Chat.DoesNotExist:
            return Response(
                {"success": False, "error": "Chat not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @extend_schema(
        operation_id="update_chat",
        summary="Update chat details",
        description="Update chat information such as title for the authenticated user.",
        parameters=[
            OpenApiParameter(
                "chat_id",
                OpenApiTypes.UUID,
                OpenApiParameter.PATH,
                description="UUID of the chat to update",
            ),
        ],
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "New title for the chat",
                        "maxLength": 255,
                    },
                },
            }
        },
        responses={
            200: OpenApiResponse(description="Chat updated successfully"),
            401: OpenApiResponse(description="Authentication required"),
            404: OpenApiResponse(description="Chat not found"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["AI Assistant", "Chats"],
    )
    def patch(self, request, chat_id):
        """Update chat title"""
        try:
            chat = get_object_or_404(Chat, id=chat_id, user=request.user)

            data = request.data
            if "title" in data:
                chat.title = data["title"]
                chat.save()

            return Response(
                {
                    "success": True,
                    "chat": {
                        "id": str(chat.id),
                        "title": chat.title,
                        "updated_at": chat.updated_at.isoformat(),
                    },
                },
                status=status.HTTP_200_OK,
            )

        except Chat.DoesNotExist:
            return Response(
                {"success": False, "error": "Chat not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @extend_schema(
        operation_id="delete_chat",
        summary="Delete chat",
        description="Permanently delete a chat conversation and all its messages for the authenticated user.",
        parameters=[
            OpenApiParameter(
                "chat_id",
                OpenApiTypes.UUID,
                OpenApiParameter.PATH,
                description="UUID of the chat to delete",
            ),
        ],
        responses={
            200: OpenApiResponse(description="Chat deleted successfully"),
            401: OpenApiResponse(description="Authentication required"),
            404: OpenApiResponse(description="Chat not found"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["AI Assistant", "Chats"],
    )
    def delete(self, request, chat_id):
        """Delete a chat"""
        try:
            chat = get_object_or_404(Chat, id=chat_id, user=request.user)
            chat.delete()

            return Response(
                {"success": True, "message": "Chat deleted successfully"},
                status=status.HTTP_200_OK,
            )

        except Chat.DoesNotExist:
            return Response(
                {"success": False, "error": "Chat not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ChatMessageView(APIView):
    """Send a message and get AI response"""

    permission_classes = [IsAuthenticated]
    serializer_class = MessageCreateSerializer

    @extend_schema(
        operation_id="send_message",
        summary="Send message to AI",
        description="Send a message to the AI assistant in a specific chat and receive an AI-generated response. The system maintains conversation context and automatically updates user statistics.",
        parameters=[
            OpenApiParameter(
                "chat_id",
                OpenApiTypes.UUID,
                OpenApiParameter.PATH,
                description="UUID of the chat to send message to",
            ),
        ],
        request=MessageCreateSerializer,
        responses={
            201: OpenApiResponse(
                description="Message sent and AI response received successfully",
                response={
                    "type": "object",
                    "properties": {
                        "success": {"type": "boolean"},
                        "user_message": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string", "format": "uuid"},
                                "content": {"type": "string"},
                                "is_from_user": {"type": "boolean"},
                                "created_at": {"type": "string", "format": "date-time"},
                            },
                        },
                        "ai_message": {
                            "type": "object",
                            "properties": {
                                "id": {"type": "string", "format": "uuid"},
                                "content": {"type": "string"},
                                "is_from_user": {"type": "boolean"},
                                "created_at": {"type": "string", "format": "date-time"},
                            },
                        },
                        "chat_title": {"type": "string"},
                    },
                },
            ),
            400: OpenApiResponse(description="Invalid message content"),
            401: OpenApiResponse(description="Authentication required"),
            404: OpenApiResponse(description="Chat not found"),
            500: OpenApiResponse(
                description="AI service error or internal server error"
            ),
        },
        tags=["AI Assistant", "Messages"],
    )
    def post(self, request, chat_id):
        """Send a message and get AI response"""
        try:
            chat = get_object_or_404(Chat, id=chat_id, user=request.user)
            data = request.data

            if "message" not in data:
                return Response(
                    {"success": False, "error": "Message content is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user_message_content = data["message"].strip()
            if not user_message_content:
                return Response(
                    {"success": False, "error": "Message cannot be empty"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if this is the first message exchange for title generation
            is_first_exchange = chat.messages.count() == 0 and not chat.title

            # Prepare context from previous messages
            previous_messages = chat.messages.order_by("created_at")[
                :10
            ]  # Last 10 messages for context

            chat_history = [
                {
                    "role": "user" if msg.is_from_user else "assistant",
                    "content": msg.content,
                }
                for msg in previous_messages
            ]

            # Get AI response FIRST - don't save user message until AI succeeds
            ai_response = gemini_assistant.get_response(
                prompt=user_message_content, chat_history=chat_history
            )

            if ai_response.get("success"):
                # Only create messages if AI response is successful
                user_message = Message.objects.create(
                    chat=chat, content=user_message_content, is_from_user=True
                )
                # Create AI message
                ai_message = Message.objects.create(
                    chat=chat, content=ai_response["response"], is_from_user=False
                )

                # Update chat title if it's the first message exchange
                if is_first_exchange:
                    chat.save()  # This will trigger the auto-title generation

                # Update user profile (optional)
                try:
                    profile, created = UserProfile.objects.get_or_create(
                        user=request.user
                    )
                    profile.total_tokens_used += ai_response.get(
                        "prompt_tokens", 0
                    ) + ai_response.get("response_tokens", 0)
                    profile.daily_message_count += 1
                    profile.save()
                except:
                    pass  # Don't fail if profile update fails

                return Response(
                    {
                        "success": True,
                        "user_message": {
                            "id": str(user_message.id),
                            "content": user_message.content,
                            "is_from_user": True,
                            "created_at": user_message.created_at.isoformat(),
                        },
                        "ai_message": {
                            "id": str(ai_message.id),
                            "content": ai_message.content,
                            "is_from_user": False,
                            "created_at": ai_message.created_at.isoformat(),
                        },
                        "chat_title": chat.title,
                    },
                    status=status.HTTP_201_CREATED,
                )

            else:
                # AI response failed - don't save any messages
                return Response(
                    {
                        "success": False,
                        "error": ai_response.get("error", "Failed to get AI response"),
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        except Chat.DoesNotExist:
            return Response(
                {"success": False, "error": "Chat not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserProfileView(APIView):
    """Get or update user profile"""

    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    @extend_schema(
        operation_id="get_user_profile",
        summary="Get user AI profile",
        description="Retrieve AI assistant usage statistics and preferences for the authenticated user.",
        responses={
            200: OpenApiResponse(
                response=UserProfileSerializer,
                description="User profile retrieved successfully",
            ),
            401: OpenApiResponse(description="Authentication required"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["AI Assistant", "Profile"],
    )
    def get(self, request):
        """Get user profile"""
        try:
            profile, created = UserProfile.objects.get_or_create(user=request.user)

            return Response(
                {
                    "success": True,
                    "profile": {
                        "total_tokens_used": profile.total_tokens_used,
                        "daily_message_count": profile.daily_message_count,
                        "last_activity": profile.last_activity.isoformat(),
                        "preferred_model": profile.preferred_model,
                        "total_chats": Chat.objects.filter(user=request.user).count(),
                    },
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @extend_schema(
        operation_id="update_user_profile",
        summary="Update user AI profile",
        description="Update AI assistant preferences for the authenticated user.",
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "preferred_model": {
                        "type": "string",
                        "description": "Preferred AI model for responses",
                        "maxLength": 50,
                        "examples": ["gpt-3.5-turbo", "gpt-4", "gemini-pro"],
                    },
                },
            }
        },
        responses={
            200: OpenApiResponse(
                response=UserProfileSerializer,
                description="User profile updated successfully",
            ),
            401: OpenApiResponse(description="Authentication required"),
            500: OpenApiResponse(description="Internal server error"),
        },
        tags=["AI Assistant", "Profile"],
    )
    def patch(self, request):
        """Update user profile"""
        try:
            profile, created = UserProfile.objects.get_or_create(user=request.user)
            data = request.data

            if "preferred_model" in data:
                profile.preferred_model = data["preferred_model"]

            profile.save()

            return Response(
                {
                    "success": True,
                    "profile": {
                        "total_tokens_used": profile.total_tokens_used,
                        "daily_message_count": profile.daily_message_count,
                        "last_activity": profile.last_activity.isoformat(),
                        "preferred_model": profile.preferred_model,
                    },
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
