# HepatoCAI Backend

<div align="center">
  <h3>🚀 Django REST API for AI-Powered Hepatitis C Detection</h3>
  <p>Scalable backend services with AI integration</p>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

The HepatoCAI backend is a robust Django REST API that powers the AI-driven Hepatitis C detection and information platform. It provides secure endpoints for user management, AI assistant functionality, diagnostic tools, and data management.

## ✨ Features

### 🔐 Authentication & Security

- JWT-based authentication with refresh tokens
- OAuth integration (Google, GitHub)
- Role-based access control
- Rate limiting and security middleware
- Comprehensive logging system

### 🤖 AI Integration

- **Gemini API**: Powers the HcvInfoBot assistant
- **Imagen API**: Generates dynamic illustrations
- Custom AI model integration framework
- Intelligent content generation

### 🏥 Diagnostic System

- Blood parameter analysis endpoints
- HCV stage detection framework
- Clinical data validation
- Secure patient data handling

### 📊 Data Management

- User profile management
- Medical history tracking
- Audit logging
- Data export capabilities

### 🔧 Developer Experience

- OpenAPI/Swagger documentation
- Comprehensive test suite
- Development utilities
- Performance monitoring

## 🛠 Tech Stack

| Category           | Technology            | Version  |
| ------------------ | --------------------- | -------- |
| **Framework**      | Django                | 5.2+     |
| **API**            | Django REST Framework | 3.16+    |
| **Database**       | PostgreSQL/SQLite     | Latest   |
| **Authentication** | SimpleJWT             | 5.5+     |
| **AI APIs**        | Google Gemini/Imagen  | Latest   |
| **Documentation**  | drf-spectacular       | 0.28+    |
| **Testing**        | Django Test Framework | Built-in |
| **CORS**           | django-cors-headers   | 4.7+     |

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- pip or pipenv
- PostgreSQL (optional, SQLite for development)

### 1. Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables - Required settings:
# - SECRET_KEY: Generate a new Django secret key
# - GOOGLE_API_KEY: Your Google AI API key
# - DATABASE_URL: PostgreSQL URL for production (optional for development)
```

**Important Environment Variables:**

```env
SECRET_KEY=your-secret-key-here
GOOGLE_API_KEY=your-google-api-key
CORS_ALLOWED_ORIGINS=http://localhost:5173
DEBUG=True
```

### 3. Database Setup

```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Load initial data (optional)
python manage.py loaddata fixtures/initial_data.json
```

### 4. Start Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

## ⚙️ Installation

### Development Environment

1. **Install Python Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

2. **Install Development Dependencies**

   ```bash
   pip install -r requirements-dev.txt
   ```

3. **Setup Pre-commit Hooks**
   ```bash
   pre-commit install
   ```

### Production Environment

1. **Use Production Requirements**

   ```bash
   pip install -r requirements-prod.txt
   ```

2. **Configure Production Settings**
   ```bash
   export DJANGO_SETTINGS_MODULE=backend.settings.production
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hepatocai_db

# AI API Keys
GOOGLE_API_KEY=your-google-api-key
GEMINI_API_KEY=your-gemini-api-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Security
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Logging
LOG_LEVEL=INFO
```

### Settings Modules

The project uses different settings for different environments:

- `backend.settings.base` - Base settings
- `backend.settings.development` - Development overrides
- `backend.settings.production` - Production configuration
- `backend.settings.testing` - Testing configuration

## 📖 API Documentation

### Interactive Documentation

- **Swagger UI**: `http://localhost:8000/api/docs/swagger/`
- **ReDoc**: `http://localhost:8000/api/docs/redoc/`
- **OpenAPI Schema**: `http://localhost:8000/api/schema/`

### Key Endpoints

#### Authentication

```http
POST /accounts/token/           # User login
POST /accounts/token/refresh/   # Token refresh
POST /users/register/           # User registration
GET  /users/profile/            # User profile
```

#### AI Assistant

```http
GET  /aiassistant/chats/                        # List chats
POST /aiassistant/chats/                        # Create new chat
GET  /aiassistant/chats/{chat_id}/              # Chat details
POST /aiassistant/chats/{chat_id}/messages/     # Send message
```

#### Diagnosis

```http
POST /diagnosis/analyze-hcv/            # Analyze HCV parameters
GET  /diagnosis/analyze-hcv/            # List user diagnoses
GET  /diagnosis/analytics/user/         # User analytics
POST /diagnosis/search/                 # Search diagnoses
```

#### User Management

```http
GET  /users/profile/            # User profile
PUT  /users/profile/            # Update profile
POST /users/contact/me/         # Contact form
```

### Example API Calls

#### AI Assistant Query

```bash
curl -X POST http://localhost:8000/aiassistant/chats/{chat_id}/messages/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "What are the symptoms of Hepatitis C?"}'
```

#### Diagnostic Analysis

```bash
curl -X POST http://localhost:8000/diagnosis/analyze-hcv/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "alt": 45,
    "ast": 38,
    "bilirubin": 1.2,
    "albumin": 4.0
  }'
```

## 🧪 Testing

### Run All Tests

```bash
python manage.py test
```

### Run Specific Test Modules

```bash
# Test AI assistant
python manage.py test aiassistant

# Test diagnosis system
python manage.py test diagnosis

# Test user management
python manage.py test users
```

### Coverage Report

```bash
coverage run --source='.' manage.py test
coverage report
coverage html  # Generates HTML report
```

### Performance Testing

```bash
python manage.py test tests.test_security_performance
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Configure production database
- [ ] Set up SSL certificates
- [ ] Configure static file serving
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

### Docker Deployment

```dockerfile
# Build image
docker build -t hepatocai-backend .

# Run container
docker run -p 8000:8000 hepatocai-backend
```

### Render Deployment

1. **Create Render Web Service**

   - Connect your GitHub repository
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `gunicorn backend.wsgi:application`

2. **Environment Variables**
   ```
   DJANGO_SETTINGS_MODULE=backend.settings
   SECRET_KEY=your-production-secret-key
   DEBUG=False
   DATABASE_URL=your-postgres-url
   ```

For detailed deployment instructions, refer to the render.yaml configuration in the backend directory.

## 📁 Project Structure

```
backend/
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
├── runtime.txt           # Python version for deployment
├── Procfile              # Process configuration
├── backend/              # Main Django app
│   ├── settings/         # Settings modules
│   ├── urls.py          # URL routing
│   └── wsgi.py          # WSGI configuration
├── aiassistant/         # AI assistant module
│   ├── models.py        # Data models
│   ├── views.py         # API views
│   ├── serializers.py   # Data serializers
│   └── urls.py          # URL patterns
├── diagnosis/           # Diagnostic tools
├── users/              # User management
├── utils/              # Shared utilities
├── tests/              # Test modules
└── logs/               # Application logs
```

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Run test suite
5. Submit pull request

### Code Standards

- Follow PEP 8 style guide
- Use type hints where applicable
- Write comprehensive docstrings
- Maintain test coverage above 80%

### Commit Convention

```
feat: add new AI diagnostic endpoint
fix: resolve authentication token issue
docs: update API documentation
test: add unit tests for diagnosis module
```

## 📊 Monitoring & Logging

### Log Files

- `logs/django.log` - General application logs
- `logs/security.log` - Security-related events
- `logs/diagnosis.log` - Diagnostic operations
- `logs/users.log` - User management events

### Performance Monitoring

The application includes built-in performance monitoring:

```python
# View performance metrics
python manage.py shell
>>> from utils.performance import get_performance_stats
>>> get_performance_stats()
```

## ⚠️ Security Considerations

- Never commit API keys or sensitive data
- Use environment variables for configuration
- Regularly update dependencies
- Monitor security logs
- Implement proper rate limiting
- Validate all user inputs

## 🐛 Troubleshooting

### Common Issues

**Database Issues:**

```bash
# Reset database
python manage.py flush
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

**API Key Issues:**

- Ensure `GOOGLE_API_KEY` is set in .env file
- Verify API key has proper permissions
- Test with: `python manage.py shell` then `import os; print(os.getenv('GOOGLE_API_KEY'))`

**CORS Issues:**

- Add frontend URL to `CORS_ALLOWED_ORIGINS` in .env
- Check if frontend and backend ports match your configuration

**Performance Issues:**

```bash
# Check logs
tail -f logs/django.log

# View performance metrics
python manage.py shell
>>> from utils.performance import get_performance_stats
>>> get_performance_stats()
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

<div align="center">
  <p>🔬 Built with Django for scalable healthcare AI solutions</p>
</div>
