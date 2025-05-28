# Google OAuth Testing Guide

## Pre-requisites

- Backend server running on http://127.0.0.1:8000/
- Frontend server running on http://localhost:5173/
- Google OAuth credentials configured in googleOAuth.json

## Test Steps

### 1. Test Email/Password Login (Control Test)

1. Navigate to http://localhost:5173/signin
2. Login with email/password
3. Check that `is_staff` appears in JWT token (if user is staff)
4. Verify user name appears in NavBar

### 2. Test Google OAuth Login

1. Navigate to http://localhost:5174/signin
2. Click "Sign in with Google"
3. Complete Google authentication
4. Verify redirect to AuthCallback
5. Check that user is properly authenticated
6. Verify `is_staff` appears in JWT token (if user is staff)
7. Check that user profile is populated with Google data:
   - Profile picture
   - First/Last name
   - Email verification status
   - Google ID

### 3. Test NavBar Enhancements

1. After successful login, check NavBar displays:
   - User name or email beside profile icon
   - Profile picture from Google (if available)
   - Responsive behavior on mobile/desktop

### 4. Test Admin Access (if user is staff)

1. Verify AdminPage appears in navigation menu
2. Access /adminpage route
3. Confirm admin functionality works

## Expected Results

### Email/Password Login

- JWT token includes `is_staff: true/false`
- User profile displays correctly
- All functionality works as before

### Google OAuth Login

- JWT token includes `is_staff: true/false` (same as email/password)
- User profile auto-populated from Google:
  - `first_name`, `last_name` from Google profile
  - `profile_picture` from Google avatar
  - `google_id` stored for reference
  - `verified_email: true`
  - `is_social_user: true`
  - `social_provider: "google"`
- NavBar shows user information correctly
- Staff users can access admin features

### Database Verification

Check the database to ensure new fields are populated:

```sql
SELECT email, first_name, last_name, profile_picture, google_id,
       is_social_user, social_provider, verified_email, is_staff
FROM users_customuser
WHERE is_social_user = 1;
```
