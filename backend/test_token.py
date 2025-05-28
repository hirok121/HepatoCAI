"""
Simple JWT test script for Django shell
"""

from users.models import CustomUser
from users.serializers import CustomTokenObtainPairSerializer
import jwt

# Find or create a superuser
superuser = CustomUser.objects.filter(is_superuser=True).first()
if not superuser:
    print("Creating superuser...")
    superuser = CustomUser.objects.create_superuser(
        email="admin@test.com", password="admin123", full_name="Test Admin"
    )

print(f"Testing with superuser: {superuser.email}")
print(f"is_staff: {superuser.is_staff}, is_superuser: {superuser.is_superuser}")

# Generate token
token = CustomTokenObtainPairSerializer.get_token(superuser)
access_token = str(token.access_token)

print(f"\nAccess token: {access_token[:50]}...")

# Decode token
decoded = jwt.decode(access_token, options={"verify_signature": False})
print(f"\nDecoded token:")
for key, value in decoded.items():
    print(f"  {key}: {value}")

print(f"\nToken includes is_staff: {'is_staff' in decoded}")
print(f"Token is_staff value: {decoded.get('is_staff')}")
