#!/usr/bin/env python
import requests
import json


def test_direct_login():
    print("🔍 Testing Direct Login API")
    print("=" * 50)

    # Test with the user we know exists
    login_data = {"email": "test@admin.com", "password": "admin123"}

    try:
        response = requests.post(
            "http://127.0.0.1:8000/accounts/token/",
            json=login_data,
            headers={"Content-Type": "application/json"},
        )

        print(f"Response Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")

        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful!")
            print(f"Access Token: {data.get('access', 'Not provided')[:50]}...")
            print(f"Refresh Token: {data.get('refresh', 'Not provided')[:50]}...")
            print(f"User Data: {data.get('user', 'Not provided')}")

            # Test a protected endpoint
            access_token = data.get("access")
            if access_token:
                print("\n🔍 Testing Protected Endpoint...")
                headers = {"Authorization": f"Bearer {access_token}"}

                users_response = requests.get(
                    "http://127.0.0.1:8000/users/admin/users/", headers=headers
                )

                print(f"Users API Status: {users_response.status_code}")
                if users_response.status_code == 200:
                    print("✅ Protected endpoint working!")
                    users_data = users_response.json()
                    print(f"Total users found: {len(users_data.get('results', []))}")
                else:
                    print(f"❌ Protected endpoint failed: {users_response.text}")

        else:
            print(f"❌ Login failed: {response.text}")

    except Exception as e:
        print(f"❌ Request failed: {e}")


if __name__ == "__main__":
    test_direct_login()
