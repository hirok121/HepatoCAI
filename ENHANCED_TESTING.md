# Enhanced Testing Strategy

## 1. Integration Tests

### Create integration test suite:

```python
# backend/tests/test_integration.py
from django.test import TestCase, TransactionTestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
import json

User = get_user_model()

class HCVDiagnosisIntegrationTests(TestCase):
    """Integration tests for complete diagnosis workflow"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_complete_diagnosis_workflow(self):
        """Test complete user registration -> login -> diagnosis workflow"""

        # 1. User Registration
        registration_data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepass123',
            'password_confirm': 'securepass123'
        }
        response = self.client.post('/users/register/', registration_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # 2. User Login
        login_data = {
            'email': 'newuser@example.com',
            'password': 'securepass123'
        }
        response = self.client.post('/accounts/token/', login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Extract token
        token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # 3. Submit Diagnosis
        diagnosis_data = {
            'patient_name': 'Test Patient',
            'age': 45,
            'sex': 'Male',
            'alp': 85.5,
            'ast': 32.0,
            'che': 7500,
            'crea': 1.2,
            'ggt': 28.5
        }
        response = self.client.post('/diagnosis/analyze-hcv/', diagnosis_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # 4. Verify diagnosis result structure
        self.assertIn('data', response.data)
        self.assertIn('diagnosis_result', response.data['data'])

        # 5. Retrieve user's diagnoses
        response = self.client.get('/diagnosis/my-diagnoses/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

class SecurityIntegrationTests(TestCase):
    """Test security features work together"""

    def test_rate_limiting_integration(self):
        """Test rate limiting across multiple endpoints"""
        client = APIClient()

        # Test login rate limiting
        for _ in range(6):  # Exceed limit of 5
            response = client.post('/accounts/token/', {
                'email': 'test@example.com',
                'password': 'wrongpass'
            })

        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    def test_xss_protection_chain(self):
        """Test XSS protection across input validation chain"""
        # Create user and login
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        client = APIClient()
        client.force_authenticate(user=user)

        # Try XSS in diagnosis data
        malicious_data = {
            'patient_name': '<script>alert("xss")</script>',
            'age': 45,
            'sex': 'Male',
            'alp': 85.5,
            'ast': 32.0,
            'che': 7500,
            'crea': 1.2,
            'ggt': 28.5
        }

        response = client.post('/diagnosis/analyze-hcv/', malicious_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
```

## 2. Load Testing

### Create performance tests:

```python
# backend/tests/test_performance.py
import time
import concurrent.futures
from django.test import TestCase, TransactionTestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

class LoadTests(TransactionTestCase):
    """Load testing for API endpoints"""

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='loadtestuser',
            email='loadtest@example.com',
            password='testpass123'
        )

    def test_concurrent_diagnosis_requests(self):
        """Test handling multiple concurrent diagnosis requests"""

        def make_diagnosis_request():
            client = APIClient()
            client.force_authenticate(user=self.user)

            start_time = time.time()
            response = client.post('/diagnosis/analyze-hcv/', {
                'patient_name': f'Test Patient {time.time()}',
                'age': 45,
                'sex': 'Male',
                'alp': 85.5,
                'ast': 32.0,
                'che': 7500,
                'crea': 1.2,
                'ggt': 28.5
            })
            end_time = time.time()

            return {
                'status_code': response.status_code,
                'response_time': end_time - start_time
            }

        # Make 10 concurrent requests
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_diagnosis_request) for _ in range(10)]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]

        # Verify all requests succeeded
        success_count = sum(1 for r in results if r['status_code'] == 201)
        avg_response_time = sum(r['response_time'] for r in results) / len(results)

        self.assertEqual(success_count, 10)
        self.assertLess(avg_response_time, 2.0)  # Average response time under 2 seconds
```

## 3. End-to-End Tests

### Frontend E2E tests with Playwright:

```bash
npm install --save-dev @playwright/test
```

```javascript
// frontend/tests/e2e/diagnosis.spec.js
import { test, expect } from "@playwright/test";

test.describe("Diagnosis Workflow", () => {
  test("complete diagnosis flow", async ({ page }) => {
    // Navigate to app
    await page.goto("http://localhost:5173");

    // Login
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', "test@example.com");
    await page.fill('[data-testid="password-input"]', "testpass123");
    await page.click('[data-testid="submit-login"]');

    // Navigate to diagnosis
    await page.click('[data-testid="diagnosis-nav"]');

    // Fill diagnosis form
    await page.fill('[data-testid="patient-name"]', "Test Patient");
    await page.fill('[data-testid="age"]', "45");
    await page.selectOption('[data-testid="sex"]', "Male");
    await page.fill('[data-testid="alp"]', "85.5");
    // ... fill other fields

    // Submit diagnosis
    await page.click('[data-testid="submit-diagnosis"]');

    // Verify results
    await expect(
      page.locator('[data-testid="diagnosis-results"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="hcv-probability"]')).toContainText(
      "%"
    );
  });
});
```
