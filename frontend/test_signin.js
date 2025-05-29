// Simple test script to verify signin functionality
const API_BASE_URL = 'http://127.0.0.1:8000';

async function testSignin() {
  try {
    console.log('Testing signin functionality...');
    
    const response = await fetch(`${API_BASE_URL}/accounts/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@admin.com',
        password: 'testpass123'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Login successful! Response data keys:', Object.keys(data));
      console.log('Has access token:', !!data.access);
      console.log('Has refresh token:', !!data.refresh);
      return data;
    } else {
      const errorData = await response.text();
      console.error('Login failed:', errorData);
      return null;
    }
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}

// Test CORS by making a simple GET request first
async function testCORS() {
  try {
    console.log('Testing CORS...');
    const response = await fetch(`${API_BASE_URL}/admin/`, {
      method: 'GET',
      mode: 'cors'
    });
    console.log('CORS test - Status:', response.status);
    console.log('CORS test - Headers:', Object.fromEntries(response.headers.entries()));
  } catch (error) {
    console.error('CORS test failed:', error);
  }
}

// Run tests
testCORS().then(() => {
  return testSignin();
}).then((result) => {
  if (result) {
    console.log('✅ Signin test completed successfully');
  } else {
    console.log('❌ Signin test failed');
  }
});
