#!/usr/bin/env python
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from users.models import CustomUser
from django.contrib.auth import authenticate


def check_users():
    print("🔍 Checking Users in Database")
    print("=" * 50)

    users = CustomUser.objects.all()
    print(f"Total users: {users.count()}")

    for user in users:
        print(f"\nUser: {user.email}")
        print(f"  - ID: {user.id}")
        print(f"  - Password set: {bool(user.password)}")
        print(f"  - is_staff: {user.is_staff}")
        print(f"  - is_superuser: {user.is_superuser}")
        print(f"  - is_active: {user.is_active}")

        # Test authentication with a common password
        if user.email == "email@email.com":
            print(f"  - Testing authentication...")
            auth_result = authenticate(username=user.email, password="password")
            print(f"  - Auth result: {auth_result}")

    # Try creating a test user if none exist
    if users.count() == 0:
        print("\n🔧 Creating test superuser...")
        user = CustomUser.objects.create_superuser(
            email="admin@test.com", password="testpass123", full_name="Test Admin"
        )
        print(f"Created user: {user.email}")


if __name__ == "__main__":
    check_users()
