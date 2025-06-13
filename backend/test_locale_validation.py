#!/usr/bin/env python
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import CustomUser
from django.core.exceptions import ValidationError
import uuid

def test_locale_validation():
    """Test locale field validation"""
    print("Testing locale validation...")
    
    # Test valid locale formats
    valid_locales = ['en-US', 'fr-FR', 'en', 'es', 'de-DE', 'ja-JP']
    
    for locale in valid_locales:
        try:
            # Generate unique email for each test
            email = f'test-{uuid.uuid4().hex[:8]}@example.com'
            user = CustomUser(
                email=email,
                password='test123',
                locale=locale,
                first_name='Test',
                last_name='User'
            )
            # Validate the entire model to trigger field validation
            user.full_clean(exclude=['password'])  # Exclude password as we're not setting it properly
            print(f"✅ Locale '{locale}' validation passed")
        except ValidationError as e:
            if 'locale' in str(e):
                print(f"❌ Locale '{locale}' validation failed: {e}")
            else:
                print(f"✅ Locale '{locale}' validation passed (other field errors: {e})")
        except Exception as e:
            print(f"❌ Unexpected error for locale '{locale}': {e}")
    
    # Test invalid locale formats
    invalid_locales = ['invalid', 'en-us-US', 'EN-US', '123', 'en-123']
    
    for locale in invalid_locales:
        try:
            # Generate unique email for each test
            email = f'test-{uuid.uuid4().hex[:8]}@example.com'
            user = CustomUser(
                email=email,
                password='test123',
                locale=locale,
                first_name='Test',
                last_name='User'
            )
            # Validate the entire model to trigger field validation
            user.full_clean(exclude=['password'])
            print(f"❌ Locale '{locale}' should have failed validation but passed")
        except ValidationError as e:
            if 'locale' in str(e):
                print(f"✅ Locale '{locale}' correctly failed validation")
            else:
                print(f"❌ Locale '{locale}' failed for wrong reason: {e}")
        except Exception as e:
            print(f"❌ Unexpected error for locale '{locale}': {e}")

if __name__ == '__main__':
    test_locale_validation()
