# Testing Guide

<div align="center">
  <h2>🧪 HepatoCAI Testing Guide</h2>
  <p>Comprehensive testing strategy and implementation guide</p>
</div>

---

## 📋 Table of Contents

- [Testing Overview](#testing-overview)
- [Testing Strategy](#testing-strategy)
- [Backend Testing](#backend-testing)
- [Frontend Testing](#frontend-testing)
- [Integration Testing](#integration-testing)
- [API Testing](#api-testing)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Test Automation](#test-automation)
- [Best Practices](#best-practices)

## 🎯 Testing Overview

HepatoCAI follows a comprehensive testing strategy that ensures reliability, security, and performance across all components of the application.

### Testing Pyramid

```
                    /\
                   /  \
                  / E2E \
                 /______\
                /        \
               /Integration\
              /__________\
             /            \
            /    Unit      \
           /________________\
```

- **Unit Tests**: 70% - Fast, isolated tests for individual components
- **Integration Tests**: 20% - Tests for component interactions
- **End-to-End Tests**: 10% - Full application workflow tests

### Testing Goals

- **Quality Assurance**: Catch bugs before production
- **Regression Prevention**: Ensure new changes don't break existing functionality
- **Documentation**: Tests serve as living documentation
- **Confidence**: Enable safe refactoring and feature additions

## 📊 Testing Strategy

### Test Coverage Goals

| Component           | Target Coverage | Current Coverage |
| ------------------- | --------------- | ---------------- |
| Backend Models      | 95%             | 90%              |
| Backend Views       | 90%             | 85%              |
| Backend Utils       | 95%             | 88%              |
| Frontend Components | 85%             | 80%              |
| Frontend Services   | 90%             | 85%              |
| API Endpoints       | 95%             | 90%              |

### Testing Environments

```
Development → Testing → Staging → Production

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Testing     │    │     Staging     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ Unit Tests      │    │ Integration     │    │ E2E Testing     │
│ Local DB        │    │ Test DB         │    │ Production-like │
│ Mock Services   │    │ Real Services   │    │ Real Services   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Backend Testing

### Django Test Framework

The backend uses Django's built-in testing framework with additional tools for comprehensive coverage.

#### Test Configuration

```python
# backend/settings/test.py
from .base import *

# Test-specific settings
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Disable external API calls during testing
GOOGLE_API_KEY = 'test-key'
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'

# Speed up password hashing in tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Disable caching
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}
```

### Model Testing

#### User Model Tests

```python
# tests/test_user_models.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

class CustomUserModelTest(TestCase):
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'testpass123'
        }

    def test_user_creation(self):
        """Test user creation with valid data"""
        user = User.objects.create_user(**self.user_data)

        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.username, 'testuser')
        self.assertTrue(user.check_password('testpass123'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)

    def test_user_email_unique(self):
        """Test that user email must be unique"""
        User.objects.create_user(**self.user_data)

        with self.assertRaises(Exception):
            User.objects.create_user(**self.user_data)

    def test_user_string_representation(self):
        """Test user string representation"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(str(user), 'test@example.com')

    def test_superuser_creation(self):
        """Test superuser creation"""
        admin_user = User.objects.create_superuser(
            email='admin@example.com',
            username='admin',
            password='adminpass123'
        )

        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.is_active)
```

#### Diagnosis Model Tests

```python
# tests/test_diagnosis_models.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from diagnosis.models import HCVPatient, HCVResult
from decimal import Decimal

User = get_user_model()

class HCVPatientModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='doctor@example.com',
            username='doctor',
            password='doctorpass123'
        )

        self.patient_data = {
            'created_by': self.user,
            'patient_name': 'John Doe',
            'age': 45,
            'sex': 'Male',
            'alt': 55.0,
            'ast': 48.0,
            'bilirubin': 1.8,
            'albumin': 3.5,
            'alkaline_phosphatase': 120.0,
            'gamma_glutamyl_transferase': 85.0
        }

    def test_patient_creation(self):
        """Test HCV patient creation"""
        patient = HCVPatient.objects.create(**self.patient_data)

        self.assertEqual(patient.patient_name, 'John Doe')
        self.assertEqual(patient.age, 45)
        self.assertEqual(patient.sex, 'Male')
        self.assertEqual(patient.created_by, self.user)

    def test_patient_biomarkers_validation(self):
        """Test biomarker value validation"""
        # Test negative ALT value
        invalid_data = self.patient_data.copy()
        invalid_data['alt'] = -10.0

        patient = HCVPatient(**invalid_data)
        with self.assertRaises(ValidationError):
            patient.full_clean()

    def test_patient_age_validation(self):
        """Test age validation"""
        invalid_data = self.patient_data.copy()
        invalid_data['age'] = -5

        patient = HCVPatient(**invalid_data)
        with self.assertRaises(ValidationError):
            patient.full_clean()

    def test_hcv_result_relationship(self):
        """Test HCV result relationship"""
        patient = HCVPatient.objects.create(**self.patient_data)
        result = HCVResult.objects.create(
            patient=patient,
            predicted_stage='F2',
            confidence=0.85,
            biomarker_importance={'alt': 0.3, 'ast': 0.25}
        )

        self.assertEqual(patient.hcv_result, result)
        self.assertEqual(result.patient, patient)
```

### View Testing

#### Authentication View Tests

```python
# tests/test_auth_views.py
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from unittest.mock import patch

User = get_user_model()

class AuthenticationViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'testpass123'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_user_registration(self):
        """Test user registration endpoint"""
        registration_data = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'newpass123'
        }

        response = self.client.post('/users/register/', registration_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('Registration successful', response.data['message'])

    def test_user_login(self):
        """Test user login endpoint"""
        login_data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }

        response = self.client.post('/accounts/token/', login_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        login_data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }

        response = self.client.post('/accounts/token/', login_data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_protected_endpoint_without_token(self):
        """Test accessing protected endpoint without token"""
        response = self.client.get('/users/profile/me/')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_protected_endpoint_with_token(self):
        """Test accessing protected endpoint with valid token"""
        # Get token
        login_response = self.client.post('/accounts/token/', {
            'email': 'test@example.com',
            'password': 'testpass123'
        })
        token = login_response.data['access']

        # Access protected endpoint
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/users/profile/me/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['email'], 'test@example.com')

    @patch('users.views.send_mail')
    def test_email_verification_sent(self, mock_send_mail):
        """Test email verification is sent on registration"""
        registration_data = {
            'email': 'verify@example.com',
            'username': 'verifyuser',
            'password': 'verifypass123'
        }

        response = self.client.post('/users/register/', registration_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_send_mail.assert_called_once()
```

#### Diagnosis View Tests

```python
# tests/test_diagnosis_views.py
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from diagnosis.models import HCVPatient
from unittest.mock import patch, MagicMock

User = get_user_model()

class DiagnosisViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='doctor@example.com',
            username='doctor',
            password='doctorpass123'
        )
        self.client.force_authenticate(user=self.user)

        self.diagnosis_data = {
            'patient_name': 'John Doe',
            'age': 45,
            'sex': 'Male',
            'alt': 55.0,
            'ast': 48.0,
            'bilirubin': 1.8,
            'albumin': 3.5,
            'alkaline_phosphatase': 120.0,
            'gamma_glutamyl_transferase': 85.0
        }

    @patch('diagnosis.AiDiagnosisTool.main.AiDiagnosisTool.predict_hcv_stage')
    def test_hcv_diagnosis_creation(self, mock_predict):
        """Test HCV diagnosis creation"""
        # Mock AI prediction
        mock_predict.return_value = {
            'predicted_stage': 'F2',
            'confidence': 0.85,
            'biomarker_importance': {'alt': 0.3, 'ast': 0.25}
        }

        response = self.client.post('/diagnosis/analyze-hcv/', self.diagnosis_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertIn('data', response.data)

        # Verify patient was created
        patient = HCVPatient.objects.get(patient_name='John Doe')
        self.assertEqual(patient.created_by, self.user)
        self.assertEqual(patient.hcv_result.predicted_stage, 'F2')

    def test_invalid_diagnosis_data(self):
        """Test diagnosis with invalid data"""
        invalid_data = self.diagnosis_data.copy()
        invalid_data['age'] = -5  # Invalid age

        response = self.client.post('/diagnosis/analyze-hcv/', invalid_data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_get_user_diagnoses(self):
        """Test retrieving user's diagnoses"""
        # Create test patient
        HCVPatient.objects.create(
            created_by=self.user,
            patient_name='Test Patient',
            age=30,
            sex='Female',
            alt=40.0,
            ast=35.0,
            bilirubin=1.0,
            albumin=4.0
        )

        response = self.client.get('/diagnosis/analyze-hcv/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(len(response.data['data']['results']), 1)

    def test_diagnosis_search(self):
        """Test diagnosis search functionality"""
        # Create test patients
        HCVPatient.objects.create(
            created_by=self.user,
            patient_name='High Risk Patient',
            age=60,
            sex='Male',
            alt=80.0,
            ast=75.0,
            bilirubin=2.5,
            albumin=3.0
        )

        response = self.client.get('/diagnosis/search/?min_age=50&max_age=70')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
```

### Testing Utilities

#### Test Data Factories

```python
# tests/factories.py
import factory
from django.contrib.auth import get_user_model
from diagnosis.models import HCVPatient, HCVResult

User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f'user{n}@example.com')
    username = factory.Sequence(lambda n: f'user{n}')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    is_active = True

class HCVPatientFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = HCVPatient

    created_by = factory.SubFactory(UserFactory)
    patient_name = factory.Faker('name')
    age = factory.Faker('random_int', min=18, max=80)
    sex = factory.Faker('random_element', elements=['Male', 'Female'])
    alt = factory.Faker('random_int', min=10, max=100)
    ast = factory.Faker('random_int', min=10, max=100)
    bilirubin = factory.Faker('pydecimal', left_digits=1, right_digits=1, positive=True)
    albumin = factory.Faker('pydecimal', left_digits=1, right_digits=1, positive=True)

class HCVResultFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = HCVResult

    patient = factory.SubFactory(HCVPatientFactory)
    predicted_stage = factory.Faker('random_element', elements=['F0', 'F1', 'F2', 'F3', 'F4'])
    confidence = factory.Faker('pyfloat', left_digits=0, right_digits=2, positive=True, max_value=1)
    biomarker_importance = factory.Dict({
        'alt': factory.Faker('pyfloat', left_digits=0, right_digits=2, max_value=1),
        'ast': factory.Faker('pyfloat', left_digits=0, right_digits=2, max_value=1),
    })
```

#### Custom Test Mixins

```python
# tests/mixins.py
class AuthenticatedTestMixin:
    """Mixin for tests requiring authentication"""

    def setUp(self):
        super().setUp()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

class AdminTestMixin:
    """Mixin for tests requiring admin privileges"""

    def setUp(self):
        super().setUp()
        self.admin_user = UserFactory(is_staff=True, is_superuser=True)
        self.client.force_authenticate(user=self.admin_user)
```

## 🎨 Frontend Testing

### React Testing Library Setup

```javascript
// frontend/src/setupTests.js
import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

// Configure testing library
configure({ testIdAttribute: "data-testid" });

// Mock environment variables
process.env.VITE_API_BASE_URL = "http://localhost:8000";

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};
```

### Component Testing

#### Authentication Components

```javascript
// frontend/src/components/auth/__tests__/LoginForm.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../../hooks/AuthContext";
import LoginForm from "../LoginForm";

const MockedLoginForm = () => (
  <BrowserRouter>
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  </BrowserRouter>
);

describe("LoginForm", () => {
  test("renders login form elements", () => {
    render(<MockedLoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors for empty fields", async () => {
    render(<MockedLoginForm />);

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test("submits form with valid data", async () => {
    const mockLogin = jest.fn().mockResolvedValue({});

    // Mock the auth context
    jest.mock("../../../hooks/AuthContext", () => ({
      useAuth: () => ({
        login: mockLogin,
        loading: false,
        error: null,
      }),
    }));

    render(<MockedLoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  test("displays error message on login failure", async () => {
    const mockLogin = jest
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));

    render(<MockedLoginForm />);

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
```

#### Diagnosis Components

```javascript
// frontend/src/components/diagnosis/__tests__/DiagnosisForm.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DiagnosisForm from "../DiagnosisForm";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (component) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

describe("DiagnosisForm", () => {
  test("renders all biomarker input fields", () => {
    renderWithProviders(<DiagnosisForm />);

    expect(screen.getByLabelText(/patient name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sex/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/alt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ast/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bilirubin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/albumin/i)).toBeInTheDocument();
  });

  test("validates numeric biomarker fields", async () => {
    renderWithProviders(<DiagnosisForm />);

    // Enter invalid numeric value
    fireEvent.change(screen.getByLabelText(/alt/i), {
      target: { value: "invalid" },
    });

    fireEvent.click(screen.getByRole("button", { name: /analyze/i }));

    await waitFor(() => {
      expect(screen.getByText(/alt must be a number/i)).toBeInTheDocument();
    });
  });

  test("submits form with valid data", async () => {
    const mockOnSubmit = jest.fn();
    renderWithProviders(<DiagnosisForm onSubmit={mockOnSubmit} />);

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText(/patient name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/age/i), {
      target: { value: "45" },
    });
    fireEvent.change(screen.getByLabelText(/alt/i), {
      target: { value: "55" },
    });
    // ... fill other fields

    fireEvent.click(screen.getByRole("button", { name: /analyze/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          patient_name: "John Doe",
          age: 45,
          alt: 55,
        })
      );
    });
  });
});
```

### Service Testing

#### API Service Tests

```javascript
// frontend/src/services/__tests__/api.test.js
import { rest } from "msw";
import { setupServer } from "msw/node";
import api from "../api";

const server = setupServer(
  rest.post("http://localhost:8000/accounts/token/", (req, res, ctx) => {
    return res(
      ctx.json({
        access: "mock-access-token",
        refresh: "mock-refresh-token",
        user: { id: 1, email: "test@example.com" },
      })
    );
  }),

  rest.get("http://localhost:8000/users/profile/me/", (req, res, ctx) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res(ctx.status(401));
    }

    return res(
      ctx.json({
        success: true,
        data: {
          id: 1,
          email: "test@example.com",
          first_name: "Test",
          last_name: "User",
        },
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("API Service", () => {
  test("authentication request", async () => {
    const response = await api.post("/accounts/token/", {
      email: "test@example.com",
      password: "password123",
    });

    expect(response.data.access).toBe("mock-access-token");
    expect(response.data.user.email).toBe("test@example.com");
  });

  test("authenticated request with token", async () => {
    // Set token in localStorage (mocked)
    localStorage.setItem("authToken", "mock-access-token");

    const response = await api.get("/users/profile/me/");

    expect(response.data.success).toBe(true);
    expect(response.data.data.email).toBe("test@example.com");
  });

  test("request without token returns 401", async () => {
    localStorage.removeItem("authToken");

    try {
      await api.get("/users/profile/me/");
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
  });
});
```

### Hook Testing

```javascript
// frontend/src/hooks/__tests__/useAuth.test.js
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth, AuthProvider } from "../AuthContext";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

describe("useAuth Hook", () => {
  test("initializes with no user", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  test("login sets user data", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.login({
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user.email).toBe("test@example.com");
  });

  test("logout clears user data", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    // First login
    await act(async () => {
      await result.current.login({
        email: "test@example.com",
        password: "password123",
      });
    });

    // Then logout
    await act(async () => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });
});
```

## 🔗 Integration Testing

### Full Workflow Tests

```python
# tests/test_integration.py
from django.test import TestCase, TransactionTestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from diagnosis.models import HCVPatient, HCVResult
from unittest.mock import patch

User = get_user_model()

class HCVDiagnosisWorkflowTest(TransactionTestCase):
    """Test complete HCV diagnosis workflow"""

    def setUp(self):
        self.client = APIClient()

    def test_complete_user_journey(self):
        """Test complete user journey from registration to diagnosis"""

        # 1. User Registration
        registration_data = {
            'email': 'doctor@example.com',
            'username': 'doctor',
            'password': 'doctorpass123',
            'first_name': 'Dr',
            'last_name': 'Smith'
        }

        registration_response = self.client.post('/users/register/', registration_data)
        self.assertEqual(registration_response.status_code, 201)

        # 2. Email verification (simulate)
        user = User.objects.get(email='doctor@example.com')
        user.is_active = True
        user.save()

        # 3. User Login
        login_response = self.client.post('/accounts/token/', {
            'email': 'doctor@example.com',
            'password': 'doctorpass123'
        })
        self.assertEqual(login_response.status_code, 200)

        token = login_response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # 4. Create HCV Diagnosis
        with patch('diagnosis.AiDiagnosisTool.main.AiDiagnosisTool.predict_hcv_stage') as mock_predict:
            mock_predict.return_value = {
                'predicted_stage': 'F2',
                'confidence': 0.85,
                'biomarker_importance': {'alt': 0.3, 'ast': 0.25}
            }

            diagnosis_data = {
                'patient_name': 'John Doe',
                'age': 45,
                'sex': 'Male',
                'alt': 55.0,
                'ast': 48.0,
                'bilirubin': 1.8,
                'albumin': 3.5,
                'alkaline_phosphatase': 120.0,
                'gamma_glutamyl_transferase': 85.0
            }

            diagnosis_response = self.client.post('/diagnosis/analyze-hcv/', diagnosis_data)
            self.assertEqual(diagnosis_response.status_code, 201)

            # Verify diagnosis was created
            patient = HCVPatient.objects.get(patient_name='John Doe')
            self.assertEqual(patient.created_by, user)
            self.assertEqual(patient.hcv_result.predicted_stage, 'F2')

        # 5. Retrieve User's Diagnoses
        diagnoses_response = self.client.get('/diagnosis/analyze-hcv/')
        self.assertEqual(diagnoses_response.status_code, 200)
        self.assertEqual(len(diagnoses_response.data['data']['results']), 1)

        # 6. Search Diagnoses
        search_response = self.client.get('/diagnosis/search/?patient_name=John')
        self.assertEqual(search_response.status_code, 200)
        self.assertTrue(len(search_response.data['data']['results']) > 0)

        # 7. Get User Analytics
        analytics_response = self.client.get('/diagnosis/analytics/user/')
        self.assertEqual(analytics_response.status_code, 200)
        self.assertIn('total_diagnoses', analytics_response.data['data'])
```

### Database Transaction Tests

```python
# tests/test_transactions.py
from django.test import TransactionTestCase
from django.db import transaction
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from diagnosis.models import HCVPatient

User = get_user_model()

class DatabaseTransactionTest(TransactionTestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_diagnosis_atomic_transaction(self):
        """Test that diagnosis creation is atomic"""

        # Simulate a failure during diagnosis creation
        with patch('diagnosis.views.HCVResult.objects.create') as mock_create:
            mock_create.side_effect = Exception("Database error")

            diagnosis_data = {
                'patient_name': 'Test Patient',
                'age': 30,
                'sex': 'Male',
                'alt': 40.0,
                'ast': 35.0,
                'bilirubin': 1.0,
                'albumin': 4.0
            }

            response = self.client.post('/diagnosis/analyze-hcv/', diagnosis_data)

            # Verify that no patient was created due to rollback
            self.assertEqual(HCVPatient.objects.count(), 0)
            self.assertEqual(response.status_code, 500)
```

## 🌐 API Testing

### Postman/Newman Integration

```json
{
  "info": {
    "name": "HepatoCAI API Tests",
    "description": "Comprehensive API test suite"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "User Registration",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"username\": \"testuser\",\n  \"password\": \"testpass123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/users/register/",
              "host": ["{{base_url}}"],
              "path": ["users", "register", ""]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Registration successful\", function () {",
                  "    pm.response.to.have.status(201);",
                  "    pm.expect(pm.response.json().success).to.be.true;",
                  "});"
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Load Testing with Artillery

```yaml
# artillery-config.yml
config:
  target: "http://localhost:8000"
  phases:
    - duration: 60
      arrivalRate: 10
  defaults:
    headers:
      Content-Type: "application/json"

scenarios:
  - name: "Authentication Flow"
    flow:
      - post:
          url: "/accounts/token/"
          json:
            email: "test@example.com"
            password: "testpass123"
          capture:
            - json: "$.access"
              as: "authToken"
      - get:
          url: "/users/profile/me/"
          headers:
            Authorization: "Bearer {{ authToken }}"

  - name: "Diagnosis Flow"
    flow:
      - post:
          url: "/accounts/token/"
          json:
            email: "test@example.com"
            password: "testpass123"
          capture:
            - json: "$.access"
              as: "authToken"
      - post:
          url: "/diagnosis/analyze-hcv/"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            patient_name: "Load Test Patient"
            age: 45
            sex: "Male"
            alt: 55.0
            ast: 48.0
            bilirubin: 1.8
            albumin: 3.5
```

## ⚡ Performance Testing

### Backend Performance Tests

```python
# tests/test_performance.py
from django.test import TestCase
from django.test.utils import override_settings
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from diagnosis.models import HCVPatient
import time

User = get_user_model()

class PerformanceTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

        # Create test data
        for i in range(100):
            HCVPatient.objects.create(
                created_by=self.user,
                patient_name=f'Patient {i}',
                age=30 + i % 50,
                sex='Male' if i % 2 == 0 else 'Female',
                alt=40.0 + i,
                ast=35.0 + i,
                bilirubin=1.0 + (i * 0.1),
                albumin=4.0 - (i * 0.01)
            )

    def test_diagnosis_list_performance(self):
        """Test that diagnosis list loads within acceptable time"""
        start_time = time.time()

        response = self.client.get('/diagnosis/analyze-hcv/')

        end_time = time.time()
        response_time = end_time - start_time

        self.assertEqual(response.status_code, 200)
        self.assertLess(response_time, 1.0)  # Should load in less than 1 second

    def test_search_performance(self):
        """Test search functionality performance"""
        start_time = time.time()

        response = self.client.get('/diagnosis/search/?patient_name=Patient&page_size=50')

        end_time = time.time()
        response_time = end_time - start_time

        self.assertEqual(response.status_code, 200)
        self.assertLess(response_time, 0.5)  # Search should be fast

    @override_settings(DEBUG=True)
    def test_database_query_count(self):
        """Test that views don't generate excessive database queries"""
        from django.db import connection

        initial_queries = len(connection.queries)

        response = self.client.get('/diagnosis/analyze-hcv/')

        query_count = len(connection.queries) - initial_queries

        self.assertEqual(response.status_code, 200)
        self.assertLess(query_count, 10)  # Should not exceed 10 queries
```

### Frontend Performance Tests

```javascript
// frontend/src/__tests__/performance.test.js
import { render, screen, waitFor } from "@testing-library/react";
import { performance } from "perf_hooks";
import App from "../App";

describe("Performance Tests", () => {
  test("App renders within acceptable time", async () => {
    const startTime = performance.now();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId("app-container")).toBeInTheDocument();
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(1000); // Should render in less than 1 second
  });

  test("Large component list renders efficiently", () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
    }));

    const startTime = performance.now();

    render(<ItemList items={items} />);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(renderTime).toBeLessThan(100); // Should render quickly even with many items
  });
});
```

## 🔒 Security Testing

### Security Test Suite

```python
# tests/test_security.py
from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from unittest.mock import patch

User = get_user_model()

class SecurityTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )

    def test_sql_injection_protection(self):
        """Test protection against SQL injection attacks"""
        malicious_input = "'; DROP TABLE auth_user; --"

        response = self.client.post('/users/check-email/', {
            'email': malicious_input
        })

        # Should handle malicious input gracefully
        self.assertIn(response.status_code, [400, 422])

        # Verify user table still exists
        self.assertTrue(User.objects.filter(email='test@example.com').exists())

    def test_xss_protection(self):
        """Test protection against XSS attacks"""
        self.client.force_authenticate(user=self.user)

        malicious_script = '<script>alert("XSS")</script>'

        response = self.client.post('/diagnosis/analyze-hcv/', {
            'patient_name': malicious_script,
            'age': 30,
            'sex': 'Male',
            'alt': 40.0,
            'ast': 35.0,
            'bilirubin': 1.0,
            'albumin': 4.0
        })

        # Should either reject the input or sanitize it
        if response.status_code == 201:
            # If accepted, should be sanitized
            self.assertNotIn('<script>', response.data['data']['patient_name'])

    def test_rate_limiting(self):
        """Test rate limiting functionality"""
        # Make multiple rapid requests
        for i in range(20):
            response = self.client.post('/users/check-email/', {
                'email': f'test{i}@example.com'
            })

        # Should eventually hit rate limit
        final_response = self.client.post('/users/check-email/', {
            'email': 'final@example.com'
        })

        self.assertEqual(final_response.status_code, 429)

    def test_authentication_required(self):
        """Test that protected endpoints require authentication"""
        protected_endpoints = [
            '/users/profile/me/',
            '/diagnosis/analyze-hcv/',
            '/diagnosis/analytics/user/',
            '/aiassistant/chats/'
        ]

        for endpoint in protected_endpoints:
            response = self.client.get(endpoint)
            self.assertEqual(response.status_code, 401)

    def test_authorization_levels(self):
        """Test that admin endpoints require proper authorization"""
        # Regular user
        self.client.force_authenticate(user=self.user)

        admin_endpoints = [
            '/users/admin/users/',
            '/diagnosis/analytics/admin/',
            '/diagnosis/admin/search/'
        ]

        for endpoint in admin_endpoints:
            response = self.client.get(endpoint)
            self.assertEqual(response.status_code, 403)

        # Admin user
        admin_user = User.objects.create_user(
            email='admin@example.com',
            username='admin',
            password='adminpass123',
            is_staff=True,
            is_superuser=True
        )
        self.client.force_authenticate(user=admin_user)

        for endpoint in admin_endpoints:
            response = self.client.get(endpoint)
            self.assertNotEqual(response.status_code, 403)
```

## 🤖 Test Automation

### GitHub Actions CI/CD

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_hepatocai
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt

      - name: Run tests
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test_hepatocai
          SECRET_KEY: test-secret-key
          DEBUG: False
        run: |
          cd backend
          python manage.py test --verbosity=2

      - name: Generate coverage report
        run: |
          cd backend
          coverage run --source='.' manage.py test
          coverage xml

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./backend/coverage.xml

  frontend-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Run tests
        run: |
          cd frontend
          npm test -- --coverage --watchAll=false

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./frontend/coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests]

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install Playwright
        run: |
          cd frontend
          npm ci
          npx playwright install

      - name: Run E2E tests
        run: |
          cd frontend
          npm run test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

### Pre-commit Hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files

  - repo: https://github.com/psf/black
    rev: 22.10.0
    hooks:
      - id: black
        files: backend/.*\.py$

  - repo: https://github.com/pycqa/isort
    rev: 5.11.4
    hooks:
      - id: isort
        files: backend/.*\.py$

  - repo: https://github.com/pycqa/flake8
    rev: 6.0.0
    hooks:
      - id: flake8
        files: backend/.*\.py$

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.28.0
    hooks:
      - id: eslint
        files: frontend/src/.*\.(js|jsx|ts|tsx)$
        additional_dependencies:
          - eslint@8.28.0
          - eslint-plugin-react@7.31.11
```

## 📏 Best Practices

### Test Organization

#### File Structure

```
tests/
├── unit/
│   ├── test_models.py
│   ├── test_serializers.py
│   └── test_utils.py
├── integration/
│   ├── test_api_workflows.py
│   └── test_user_journeys.py
├── performance/
│   └── test_load.py
├── security/
│   └── test_security.py
├── fixtures/
│   └── test_data.json
├── factories.py
├── mixins.py
└── conftest.py
```

#### Test Naming Conventions

```python
# Good test names
def test_user_registration_with_valid_data_creates_user()
def test_diagnosis_with_invalid_biomarkers_returns_400()
def test_admin_user_can_access_user_management_endpoint()

# Bad test names
def test_user()
def test_endpoint()
def test_function()
```

### Test Data Management

#### Use Factories, Not Fixtures

```python
# Good: Use factories for flexible test data
user = UserFactory(email='specific@example.com')
patient = HCVPatientFactory(created_by=user, age=45)

# Avoid: Hard-coded fixtures that are difficult to maintain
# fixtures/users.json
```

#### Test Isolation

```python
# Ensure tests don't depend on each other
class DiagnosisTestCase(TestCase):
    def setUp(self):
        # Create fresh test data for each test
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

    def tearDown(self):
        # Clean up if necessary (usually handled by Django)
        pass
```

### Mocking Guidelines

#### Mock External Services

```python
# Always mock external API calls
@patch('diagnosis.AiDiagnosisTool.main.AiDiagnosisTool.predict_hcv_stage')
def test_diagnosis_prediction(self, mock_predict):
    mock_predict.return_value = {
        'predicted_stage': 'F2',
        'confidence': 0.85
    }
    # Test logic here
```

#### Don't Mock What You Own

```python
# Good: Test your own models directly
user = User.objects.create_user(email='test@example.com')

# Bad: Mock your own models
@patch('users.models.User.objects.create_user')
def test_something(self, mock_create):
    # This tests the mock, not your code
```

### Performance Testing Guidelines

#### Set Realistic Limits

```python
def test_api_response_time(self):
    """API should respond within 200ms under normal load"""
    start_time = time.time()
    response = self.client.get('/api/endpoint/')
    response_time = time.time() - start_time

    self.assertLess(response_time, 0.2)  # 200ms limit
```

#### Monitor Database Queries

```python
@override_settings(DEBUG=True)
def test_query_efficiency(self):
    with self.assertNumQueries(3):  # Expect exactly 3 queries
        response = self.client.get('/api/patients/')
        self.assertEqual(response.status_code, 200)
```

---

This testing guide provides a comprehensive framework for ensuring the quality and reliability of the HepatoCAI platform. Regular testing helps maintain code quality, catch regressions early, and build confidence in the application's stability.

**Last Updated**: January 13, 2025
**Version**: 1.0.0
