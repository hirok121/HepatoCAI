from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Note(models.Model):
    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)  # ✅ Required for admin prepopulated_fields
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
