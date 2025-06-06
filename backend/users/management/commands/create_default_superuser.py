from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Create a default superuser for production deployment"

    def handle(self, *args, **options):
        User = get_user_model()
        email = "hirokreza121@gmail.com"
        password = "qwedsazx123"

        if not User.objects.filter(email=email).exists():
            user = User.objects.create_superuser(
                email=email, password=password, first_name="Admin", last_name="User"
            )
            self.stdout.write(
                self.style.SUCCESS(f"✅ Superuser created successfully: {email}")
            )
        else:
            self.stdout.write(
                self.style.WARNING(f"ℹ️ Superuser already exists: {email}")
            )
