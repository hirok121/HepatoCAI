from django.urls import path
from . import views

app_name = "aiassistant"

urlpatterns = [
    # Chat management endpoints
    path(
        "chats/", views.ChatListView.as_view(), name="chat-list"
    ),  # GET: list chats, POST: create new chat
    path(
        "chats/<uuid:chat_id>/", views.ChatDetailView.as_view(), name="chat-detail"
    ),  # GET: chat details, PATCH: update, DELETE: delete
    path(
        "chats/<uuid:chat_id>/messages/",
        views.ChatMessageView.as_view(),
        name="chat-message",
    ),  # POST: send message
    # User profile endpoint
    path(
        "profile/", views.UserProfileView.as_view(), name="user-profile"
    ),  # GET: get profile, PATCH: update profile
]
