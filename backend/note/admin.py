from django.contrib import admin
from .models import Note

# Register your models here.


class NoteAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    list_display = ("title", "created_at", "updated_at")
    list_filter = ("created_at", "updated_at")
    search_fields = ("title", "content")
    ordering = ("-created_at",)


admin.site.register(Note, NoteAdmin)
