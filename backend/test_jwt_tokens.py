"""
Quick test script to verify JWT token structure for both login methods
Run this in Django shell: python manage.py shell
"""

from users.models import CustomUser
from users.serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import json


def test_jwt_token_structure():
    """Test that both login methods produce consistent JWT tokens"""

    # Find a test user (adjust email as needed)
    try:
        user = CustomUser.objects.filter(email__icontains="test").first()
        if not user:
            user = CustomUser.objects.first()

        if not user:
            print("No users found. Create a test user first.")
            return

        print(f"Testing with user: {user.email}")
        print(f"User is_staff: {user.is_staff}")
        print(f"User is_social_user: {user.is_social_user}")
        print("-" * 50)

        # Test 1: Basic RefreshToken (old method)
        basic_token = RefreshToken.for_user(user)
        print("Basic RefreshToken payload:")
        print(json.dumps(basic_token.payload, indent=2))
        print("-" * 50)

        # Test 2: Custom TokenObtainPairSerializer (new method)
        custom_token = CustomTokenObtainPairSerializer.get_token(user)
        print("Custom TokenObtainPairSerializer payload:")
        print(json.dumps(custom_token.payload, indent=2))
        print("-" * 50)

        # Verify is_staff is included in custom token
        if "is_staff" in custom_token.payload:
            print("✅ SUCCESS: is_staff field found in custom token")
        else:
            print("❌ ERROR: is_staff field missing from custom token")

        # Check for other enhanced fields
        enhanced_fields = ["first_name", "last_name", "profile_picture", "google_id"]
        for field in enhanced_fields:
            if field in custom_token.payload:
                print(f"✅ Enhanced field '{field}' found in token")
            else:
                print(f"ℹ️  Enhanced field '{field}' not in token (may be null)")

    except Exception as e:
        print(f"Error during test: {e}")


if __name__ == "__main__":
    test_jwt_token_structure()
