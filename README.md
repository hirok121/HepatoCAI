# HepatoCAI

<div align="center">
  <h3>🔬 AI-Powered Hepatitis C Detection & Information Hub</h3>
  <p>Advanced HCV stage detection powered by artificial intelligence</p>
  
  <p>
    <img src="https://img.shields.io/badge/Django-5.2+-092E20?style=flat-square&logo=django" alt="Django" />
    <img src="https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python" alt="Python" />
    <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/Material--UI-5+-007FFF?style=flat-square&logo=mui" alt="MUI" />
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License" />
  </p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#contributing">Contributing</a> •
    <a href="#license">License</a>
  </p>
</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)
- [Disclaimer](#disclaimer)

## 🎯 About

HepatoCAI is a comprehensive web-based platform designed to provide accessible and informative resources related to Hepatitis C (HCV). The platform leverages artificial intelligence to offer educational content, AI-assisted information, and showcases the potential of AI-powered diagnostic tools.

### Target Audience

- **Individuals** seeking general information about Hepatitis C
- **Patients or those at risk** looking for resources and understanding
- **Healthcare professionals** interested in AI applications in HCV diagnostics
- **Researchers** exploring AI-driven healthcare solutions

## ✨ Features

### 🤖 AI-Powered Assistant (HcvInfoBot)

- Interactive AI assistant powered by Google's Gemini API
- Provides educational information about Hepatitis C
- Real-time Q&A with safety disclaimers
- Multilingual support capabilities

### 🔬 Diagnostic Tool Concept

- Conceptual AI diagnostic tool for HCV stage detection
- Blood sample parameter analysis framework
- Clinical decision support interface
- Future ML model integration ready

### 🎨 Dynamic Visual Experience

- AI-generated illustrations using Google's Imagen API
- Modern, responsive Material-UI design
- Professional healthcare-focused aesthetics
- Interactive animations and transitions

### 📚 Information Hub

- Comprehensive HCV educational resources
- Blog system for articles and research updates
- Patient stories and expert opinions
- Up-to-date medical information

### 🔐 Security & Compliance

- JWT-based authentication
- Secure API endpoints
- Medical data protection measures
- GDPR compliance ready

## 🏗 Architecture

```
HepatoCAI/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API integration
│   │   └── hooks/         # Custom React hooks
│   └── public/            # Static assets
├── backend/           # Django REST API
│   ├── aiassistant/       # AI assistant module
│   ├── diagnosis/         # Diagnostic tools
│   ├── users/             # User management
│   ├── utils/             # Shared utilities
│   └── tests/             # Test modules
└── docs/              # Project documentation
```

### Technology Stack

**Frontend:**

- React.js 18+ with Vite
- Material-UI (MUI) for component library
- TanStack Query for state management
- Axios for API communication
- TypeScript support

**Backend:**

- Django 5.2+ with Django REST Framework
- JWT authentication
- Google AI APIs (Gemini & Imagen)
- PostgreSQL/SQLite database
- Comprehensive logging system

**AI Integration:**

- Google Gemini API for text generation
- Google Imagen API for image generation
- Custom AI model integration framework

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/hirok121/HepatoCAI.git
cd HepatoCAI
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to see the application running.

## 🔧 Troubleshooting

### Common Issues

**Backend Issues:**

- **Database errors**: Run `python manage.py migrate` to apply migrations
- **Missing API keys**: Ensure `GOOGLE_API_KEY` is set in backend/.env
- **CORS errors**: Add your frontend URL to `CORS_ALLOWED_ORIGINS`

**Frontend Issues:**

- **API connection failed**: Check `VITE_API_BASE_URL` in frontend/.env.local
- **Build failures**: Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- **Port conflicts**: Change port in vite.config.js or use `npm run dev -- --port 3000`

**Development Tips:**

- Backend logs are in `backend/logs/`
- Use `python manage.py shell` for Django debugging
- Check browser console for frontend errors
- API documentation available at `http://localhost:8000/api/docs/swagger/`

## 📦 Installation

For detailed installation instructions, see:

- [Backend Setup Guide](./backend/README.md)
- [Frontend Setup Guide](./frontend/README.md)

## 🎮 Usage

### AI Assistant

```javascript
// Example AI assistant usage
const response = await fetch("/aiassistant/chats/{chat_id}/messages/", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: "What are the symptoms of Hepatitis C?",
  }),
});
```

### Diagnostic Tool

```bash
# Example diagnostic API usage
curl -X POST http://localhost:8000/diagnosis/analyze-hcv/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "alt": 45,
    "ast": 38,
    "bilirubin": 1.2,
    "albumin": 4.0
  }'
```

## 📚 Documentation

📖 **[Complete Documentation Hub](docs/README.md)** - Your one-stop guide to all HepatoCAI documentation

### 🚀 Quick Links

| Get Started                                 | Learn More                                  | Deploy                                  |
| ------------------------------------------- | ------------------------------------------- | --------------------------------------- |
| **[📋 Installation](docs/INSTALLATION.md)** | **[📖 User Guide](docs/USER_GUIDE.md)**     | **[🚀 Deployment](docs/DEPLOYMENT.md)** |
| **[❓ FAQ](docs/FAQ.md)**                   | **[🏗️ Architecture](docs/ARCHITECTURE.md)** | **[🧪 Testing](docs/TESTING.md)**       |
| **[🔌 API Docs](docs/API.md)**              | **[🤝 Contributing](CONTRIBUTING.md)**      | **[🔒 Security](SECURITY.md)**          |

### 📋 Project Information

| Document                               | Description                                 |
| -------------------------------------- | ------------------------------------------- |
| **[🤝 Contributing](CONTRIBUTING.md)** | Developer contribution guidelines           |
| **[🔒 Security](SECURITY.md)**         | Security policy and vulnerability reporting |
| **[📝 Changelog](CHANGELOG.md)**       | Version history and release notes           |

### 🔗 Quick Access

- **API Documentation**:
  - Swagger UI: `http://localhost:8000/api/docs/swagger/`
  - ReDoc: `http://localhost:8000/api/docs/redoc/`
  - Schema: `http://localhost:8000/api/schema/`

### Key API Endpoints

| Endpoint                                 | Method   | Description                  |
| ---------------------------------------- | -------- | ---------------------------- |
| `/aiassistant/chats/`                    | GET/POST | List/create AI chat sessions |
| `/aiassistant/chats/{chat_id}/messages/` | POST     | Send message to AI assistant |
| `/diagnosis/analyze-hcv/`                | POST     | HCV diagnostic analysis      |
| `/users/profile/`                        | GET/PUT  | User profile management      |
| `/accounts/token/`                       | POST     | User authentication          |
| `/accounts/token/refresh/`               | POST     | Token refresh                |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript/React
- Write comprehensive tests
- Document all public APIs

## 🧪 Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

### Integration Tests

```bash
# Run full test suite
npm run test:integration
```

## 🚀 Deployment

### Production Deployment

The application is configured for deployment on **Render** for both frontend and backend:

- **Backend**: Django REST API as Render Web Service
- **Frontend**: React application as Render Static Site
- **Database**: PostgreSQL managed database on Render

### Live Demo

- **Frontend**: [https://hepatocai.onrender.com](https://hepatocai.onrender.com)
- **Backend API**: [https://hepatocai-backend.onrender.com](https://hepatocai-backend.onrender.com)
- **API Documentation**: [https://hepatocai-backend.onrender.com/api/docs/swagger/](https://hepatocai-backend.onrender.com/api/docs/swagger/)

### Deployment Configuration

Both services use `render.yaml` configuration files:

- `backend/render.yaml` - Backend web service configuration
- `frontend/render.yaml` - Frontend static site configuration

For detailed deployment instructions, see [DEPLOYMENT.md](./docs/DEPLOYMENT.md).

### Environment Variables

Both frontend and backend require environment configuration:

**Backend (.env):**

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys and database settings
```

**Frontend (.env.local):**

```bash
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your API URLs and configuration
```

Key environment variables:

- `GOOGLE_API_KEY` - Required for AI features
- `SECRET_KEY` - Django secret key
- `VITE_API_BASE_URL` - Backend API URL for frontend

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

**Important Medical Disclaimer:**

This application provides general information about Hepatitis C for educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

The AI diagnostic tool is conceptual and should not be used for actual medical diagnosis. Any implementation would require proper medical validation, regulatory approval, and compliance with healthcare standards.

---

<div align="center">
  <p>Made with ❤️ for better healthcare through AI</p>
  <p>© 2025 HepatoCAI. All rights reserved.</p>
</div>
