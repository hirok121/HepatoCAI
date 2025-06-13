# Contributing to HepatoCAI

We welcome contributions to HepatoCAI! This document provides guidelines for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background or experience level.

### Standards

- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 18+ and npm
- Python 3.11+
- Git knowledge
- Basic understanding of Django and React

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/HepatoCAI.git
   cd HepatoCAI
   ```

3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/hirok121/HepatoCAI.git
   ```

### Environment Setup

1. **Backend Setup:**

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your configuration
   python manage.py migrate
   python manage.py runserver
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

## 🔄 Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/feature-name` - Feature branches
- `bugfix/bug-name` - Bug fix branches
- `hotfix/issue-name` - Critical fixes

### Working on Features

1. **Create a Feature Branch:**

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make Changes:**

   - Write clean, well-documented code
   - Follow coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit Changes:**

   ```bash
   git add .
   git commit -m "feat: add amazing feature

   - Add feature description
   - Explain what it does
   - Include any breaking changes"
   ```

4. **Push and Create PR:**
   ```bash
   git push origin feature/amazing-feature
   ```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Changes to build process or auxiliary tools

**Examples:**

```
feat(auth): add OAuth Google integration
fix(api): resolve JWT token expiration issue
docs: update API documentation for diagnosis endpoint
```

## 📏 Coding Standards

### Python (Backend)

- Follow [PEP 8](https://pep8.org/) style guide
- Use type hints where appropriate
- Maximum line length: 88 characters (Black formatter)
- Use meaningful variable and function names

**Code Formatting:**

```bash
# Install formatting tools
pip install black isort flake8

# Format code
black .
isort .
flake8 .
```

**Example:**

```python
from typing import Dict, List, Optional
from rest_framework.views import APIView
from rest_framework.response import Response

class UserAnalyticsView(APIView):
    """
    User analytics endpoint for dashboard data.

    Returns comprehensive user statistics and analytics data.
    """

    def get(self, request) -> Response:
        """Get user analytics data."""
        analytics_data = self._calculate_analytics()
        return Response(analytics_data)

    def _calculate_analytics(self) -> Dict[str, Any]:
        """Calculate analytics metrics."""
        # Implementation here
        pass
```

### JavaScript/React (Frontend)

- Use ESLint and Prettier for formatting
- Prefer functional components with hooks
- Use TypeScript for type safety
- Follow React best practices

**Code Formatting:**

```bash
# Format code
npm run lint
npm run format
```

**Example:**

```jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Card } from "@mui/material";
import { useAuth } from "../hooks/AuthContext";

interface DashboardProps {
  title: string;
  data?: any[];
}

export const Dashboard: React.FC<DashboardProps> = ({ title, data = [] }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Effect logic here
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {/* Component content */}
    </Box>
  );
};
```

### API Design Guidelines

- Use RESTful conventions
- Consistent error responses
- Proper HTTP status codes
- Comprehensive documentation with OpenAPI/Swagger

**Example API Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Patient Name",
    "diagnosis": {
      "stage": "F2",
      "confidence": 0.95
    }
  },
  "message": "Diagnosis completed successfully",
  "timestamp": "2025-01-13T10:30:00Z"
}
```

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code follows project coding standards
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] No merge conflicts with main branch

### PR Guidelines

1. **Title:** Use descriptive titles following conventional commit format
2. **Description:**

   - Explain what changes were made
   - Reference related issues
   - Include screenshots for UI changes
   - List breaking changes if any

3. **Template:**

   ```markdown
   ## Description

   Brief description of changes

   ## Type of Change

   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing

   - [ ] Tests pass locally
   - [ ] Added tests for new features
   - [ ] Manual testing completed

   ## Checklist

   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No new warnings introduced
   ```

### Review Process

1. **Automated Checks:** All CI/CD checks must pass
2. **Code Review:** At least one maintainer review required
3. **Testing:** Manual testing for complex features
4. **Documentation:** Ensure docs are updated

## 🐛 Issue Guidelines

### Bug Reports

Use the bug report template and include:

- **Environment:** OS, Python/Node versions, browser
- **Steps to Reproduce:** Clear step-by-step instructions
- **Expected Behavior:** What should happen
- **Actual Behavior:** What actually happens
- **Screenshots:** If applicable
- **Error Messages:** Complete error logs

### Feature Requests

Use the feature request template and include:

- **Problem Statement:** What problem does this solve?
- **Proposed Solution:** Detailed description of the feature
- **Alternatives:** Other solutions considered
- **Additional Context:** Screenshots, mockups, examples

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high/medium/low` - Issue priority

## 🧪 Testing

### Backend Testing

```bash
# Run all tests
cd backend
python manage.py test

# Run specific test file
python manage.py test users.tests.test_views

# Run with coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Frontend Testing

```bash
# Run all tests
cd frontend
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Writing Tests

**Backend (Django):**

```python
from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthenticationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )

    def test_login_success(self):
        response = self.client.post('/accounts/token/', {
            'email': 'test@example.com',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
```

**Frontend (React Testing Library):**

```jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../components/LoginForm";

describe("LoginForm", () => {
  test("renders login form elements", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("submits form with valid data", async () => {
    const mockOnSubmit = jest.fn();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });
});
```

## 📚 Documentation

### Code Documentation

- **Python:** Use docstrings following Google style
- **JavaScript:** Use JSDoc comments
- **API:** Document all endpoints with OpenAPI

**Python Docstring Example:**

```python
def calculate_diagnosis_confidence(biomarkers: Dict[str, float]) -> float:
    """
    Calculate confidence score for HCV diagnosis.

    Args:
        biomarkers: Dictionary containing biomarker values
            - alt: ALT enzyme level
            - ast: AST enzyme level
            - bilirubin: Total bilirubin level

    Returns:
        Confidence score between 0.0 and 1.0

    Raises:
        ValueError: If required biomarkers are missing

    Example:
        >>> biomarkers = {'alt': 45, 'ast': 38, 'bilirubin': 1.2}
        >>> confidence = calculate_diagnosis_confidence(biomarkers)
        >>> confidence
        0.87
    """
    # Implementation here
```

### README Updates

When adding new features:

1. Update relevant README files
2. Add new dependencies to installation sections
3. Update API documentation links
4. Include usage examples

### Changelog

Follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [1.2.0] - 2025-01-13

### Added

- OAuth Google authentication
- AI image generation for blog posts
- Advanced search filters for patient records

### Changed

- Improved API response times by 40%
- Updated Material-UI to v5.15

### Deprecated

- Legacy authentication endpoints (will be removed in v2.0)

### Removed

- Unused legacy components

### Fixed

- JWT token refresh issue
- Mobile responsive layout bugs

### Security

- Enhanced rate limiting
- Updated dependencies with security patches
```

## 🏆 Recognition

Contributors will be recognized in:

- GitHub contributor graph
- README acknowledgments
- Release notes
- Community showcases

## 📞 Getting Help

- **GitHub Issues:** For bugs and feature requests
- **GitHub Discussions:** For questions and general discussion
- **Documentation:** Check existing docs first
- **Code Review:** Ask for help in PR comments

## 🚀 Advanced Contributing

### Becoming a Maintainer

Active contributors may be invited to become maintainers with:

- Commit access to the repository
- Ability to review and merge PRs
- Responsibility for project direction
- Access to project management tools

### Release Process

Maintainers follow this release process:

1. Update version numbers
2. Update CHANGELOG.md
3. Create release branch
4. Run full test suite
5. Deploy to staging
6. Create GitHub release
7. Deploy to production

---

Thank you for contributing to HepatoCAI! Together, we're building better healthcare through AI. 🔬✨
