#!/usr/bin/env python3
"""
Test script to debug profile update issues
"""

import requests
import json

# Test data
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/users/login/"
PROFILE_URL = f"{BASE_URL}/users/profile/me/"

# Test credentials - replace with actual test user
test_credentials = {
    "email": "hirokreza121@gmail.com",
    "password": "your_password_here",  # Replace with actual password
}


def test_profile_update():
    # First, login to get auth token
    print("Logging in...")
    login_response = requests.post(LOGIN_URL, json=test_credentials)

    if login_response.status_code != 200:
        print(f"Login failed: {login_response.status_code}")
        print(login_response.text)
        return

    auth_data = login_response.json()
    access_token = auth_data["data"]["access"]

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    # Get current profile
    print("Getting current profile...")
    profile_response = requests.get(PROFILE_URL, headers=headers)
    print(f"Profile GET status: {profile_response.status_code}")
    print(f"Profile data: {profile_response.json()}")

    # Test profile update with different date formats
    test_updates = [
        {
            "first_name": "Updated",
            "last_name": "Name",
            "birthday": "2000-01-01",  # YYYY-MM-DD format
        },
        {
            "first_name": "Updated2",
            "last_name": "Name2",
            "birthday": None,  # Null value
        },
        {
            "first_name": "Updated3",
            "last_name": "Name3",
            "birthday": "",  # Empty string
        },
    ]

    for i, update_data in enumerate(test_updates):
        print(f"\nTest {i+1}: Updating profile with data: {update_data}")

        update_response = requests.patch(PROFILE_URL, json=update_data, headers=headers)
        print(f"Update status: {update_response.status_code}")
        print(f"Update response: {update_response.text}")

        if update_response.status_code == 200:
            print("✅ Update successful!")
        else:
            print("❌ Update failed")
            try:
                error_data = update_response.json()
                print(f"Error details: {json.dumps(error_data, indent=2)}")
            except:
                print("Could not parse error response as JSON")


if __name__ == "__main__":
    test_profile_update()
