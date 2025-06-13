# HepatoCAI Frontend

<div align="center">
  <h3>⚛️ Modern React Application for AI-Powered Hepatitis C Detection</h3>
  <p>Beautiful, responsive, and accessible healthcare interface</p>
  
  <p>
    <img src="https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-5+-646CFF?style=flat-square&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Material--UI-5+-007FFF?style=flat-square&logo=mui" alt="MUI" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  </p>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

The HepatoCAI frontend is a modern React application built with Vite that provides an intuitive and accessible interface for the AI-powered Hepatitis C detection platform. It features a responsive design, AI-generated visuals, and seamless integration with the backend API.

## ✨ Features

### 🎨 Modern User Interface

- **Material-UI Components**: Consistent and accessible design system
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Custom Theming**: Healthcare-focused color palette and typography
- **Smooth Animations**: Subtle transitions and micro-interactions

### 🤖 AI Integration

- **Interactive AI Assistant**: Real-time chat with HcvInfoBot
- **Dynamic Image Generation**: AI-generated illustrations for content
- **Intelligent Content**: Context-aware recommendations
- **Voice Interaction**: Speech-to-text capabilities (planned)

### 🏥 Healthcare Features

- **Diagnostic Interface**: User-friendly blood parameter input
- **Educational Resources**: Comprehensive HCV information hub
- **Patient Dashboard**: Personal health tracking
- **Medical Disclaimers**: Prominent safety information

### 🔐 Security & Privacy

- **JWT Authentication**: Secure token-based authentication
- **OAuth Integration**: Google and GitHub sign-in
- **Data Protection**: GDPR-compliant data handling
- **Session Management**: Automatic logout and refresh

### 🚀 Performance

- **Fast Refresh**: Instant development feedback with Vite
- **Code Splitting**: Optimized bundle loading
- **Lazy Loading**: Component and route-based splitting
- **Caching Strategy**: Efficient API response caching

## 🛠 Tech Stack

| Category             | Technology     | Version | Purpose                 |
| -------------------- | -------------- | ------- | ----------------------- |
| **Framework**        | React          | 18+     | UI library              |
| **Build Tool**       | Vite           | 5+      | Development and build   |
| **UI Library**       | Material-UI    | 5+      | Component library       |
| **State Management** | TanStack Query | 5+      | Server state management |
| **HTTP Client**      | Axios          | 1.9+    | API communication       |
| **Routing**          | React Router   | 6+      | Client-side routing     |
| **Styling**          | Emotion        | Latest  | CSS-in-JS               |
| **Date Handling**    | date-fns       | 4+      | Date utilities          |
| **Authentication**   | JWT Decode     | 4+      | Token handling          |
| **Development**      | ESLint         | Latest  | Code linting            |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### 1. Clone and Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
# Add your API URLs and configuration
```

### 3. Access the Application

Open your browser and navigate to:

- Development: `http://localhost:5173`
- Network: `http://192.168.1.x:5173` (for mobile testing)

## ⚙️ Installation

### Development Environment

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Install Development Tools**

   ```bash
   npm install --save-dev
   ```

3. **Setup Git Hooks**
   ```bash
   npx husky install
   ```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Development

### Available Scripts

| Script                     | Description              |
| -------------------------- | ------------------------ |
| `npm run dev`              | Start development server |
| `npm run build`            | Build for production     |
| `npm run build:dev`        | Build for development    |
| `npm run build:staging`    | Build for staging        |
| `npm run build:production` | Build for production     |
| `npm run preview`          | Preview production build |
| `npm run lint`             | Run ESLint               |
| `npm run lint:fix`         | Fix ESLint issues        |
| `npm run type-check`       | Run TypeScript checks    |
| `npm run clean`            | Clean build directory    |

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000

# Authentication
VITE_JWT_SECRET=your-jwt-secret
VITE_OAUTH_GOOGLE_CLIENT_ID=your-google-client-id
VITE_OAUTH_GITHUB_CLIENT_ID=your-github-client-id

# AI Services
VITE_GEMINI_API_URL=https://generativelanguage.googleapis.com
VITE_IMAGEN_API_URL=https://aiplatform.googleapis.com

# App Configuration
VITE_APP_NAME=HepatoCAI
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false

# Development
VITE_DEBUG_MODE=true
VITE_BUNDLE_ANALYZER=false
```

### Development Tools

#### Hot Module Replacement (HMR)

Vite provides instant feedback for code changes:

```javascript
// Supports React Fast Refresh
export default function MyComponent() {
  return <div>Changes reflect instantly!</div>;
}
```

#### TypeScript Support

The project is TypeScript-ready:

```bash
# Run type checking
npm run type-check

# Add TypeScript files
touch src/components/NewComponent.tsx
```

#### ESLint Configuration

Code quality is enforced with ESLint:

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

## 📁 Project Structure

```
frontend/
├── public/                   # Static assets
│   ├── _redirects           # Netlify redirects
│   ├── vercel.json          # Vercel configuration
│   └── auth/                # OAuth configuration
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Common components
│   │   ├── forms/           # Form components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # UI primitives
│   ├── pages/               # Application pages
│   │   ├── Home/            # Landing page
│   │   ├── Dashboard/       # User dashboard
│   │   ├── Diagnosis/       # Diagnostic tools
│   │   └── Auth/            # Authentication pages
│   ├── services/            # API integration
│   │   ├── api.js           # API client configuration
│   │   ├── auth.js          # Authentication service
│   │   ├── ai.js            # AI service integration
│   │   └── diagnosis.js     # Diagnostic API calls
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js       # Authentication hook
│   │   ├── useAI.js         # AI integration hook
│   │   └── useLocalStorage.js # Local storage hook
│   ├── config/              # Configuration files
│   │   ├── theme.js         # MUI theme configuration
│   │   ├── constants.js     # Application constants
│   │   └── routes.js        # Route definitions
│   ├── assets/              # Static assets
│   │   ├── images/          # Image files
│   │   ├── icons/           # Icon components
│   │   └── styles/          # Global styles
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global CSS
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── tsconfig.json            # TypeScript configuration
```

## 🎨 Styling and Theming

### Material-UI Theme

The application uses a custom MUI theme:

```javascript
// src/config/theme.js
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Healthcare blue
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e", // Medical red
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 300,
    },
  },
});
```

### Responsive Design

Breakpoints follow MUI standards:

```javascript
const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(3),
    },
  },
}));
```

## 🔌 API Integration

### API Client Configuration

```javascript
// src/services/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### TanStack Query Integration

```javascript
// src/hooks/useAI.js
import { useQuery, useMutation } from "@tanstack/react-query";
import { sendMessage } from "../services/ai";

export const useSendMessage = (chatId) => {
  return useMutation({
    mutationFn: (message) => sendMessage(chatId, message),
    onSuccess: (data) => {
      console.log("AI response received:", data);
    },
  });
};
```

## 🧪 Testing

### Unit Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Component Testing

```javascript
// Example component test
import { render, screen } from "@testing-library/react";
import { AIAssistant } from "./AIAssistant";

test("renders AI assistant interface", () => {
  render(<AIAssistant />);
  expect(screen.getByText("Ask AI ✨")).toBeInTheDocument();
});
```

### End-to-End Testing

```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npm run test:e2e
```

## 🚀 Building and Deployment

### Production Build

```bash
# Build for production
npm run build

# Analyze bundle size
npm run build:analyze
```

### Deployment Platforms

#### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify Deployment

```bash
# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Manual Deployment

```bash
# Build the application
npm run build

# Upload the dist/ directory to your server
# Configure your server to serve index.html for all routes
```

### Environment-Specific Builds

```bash
# Development build
npm run build:dev

# Staging build
npm run build:staging

# Production build
npm run build:production
```

## 🔧 Configuration

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Allow external connections
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
        },
      },
    },
  },
});
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Standards

- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries
- Maintain accessibility standards (WCAG 2.1)
- Write comprehensive tests

### Component Guidelines

```javascript
// Good component structure
import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

export const MyComponent = ({ title, children, ...props }) => {
  return (
    <Box {...props}>
      <Typography variant="h6">{title}</Typography>
      {children}
    </Box>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
```

## 📊 Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build:analyze
```

### Code Splitting

```javascript
// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Diagnosis = lazy(() => import('./pages/Diagnosis'))

// Use Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/diagnosis" element={<Diagnosis />} />
  </Routes>
</Suspense>
```

### Image Optimization

```javascript
// Lazy load images
import { LazyImage } from "./components/LazyImage";

<LazyImage
  src="/aiassistant/generate-image"
  alt="AI generated illustration"
  loading="lazy"
/>;
```

## 🔒 Security Considerations

- Sanitize all user inputs
- Validate data on both client and server
- Use HTTPS in production
- Implement proper CORS policies
- Store sensitive data securely
- Regular dependency updates

## 🐛 Troubleshooting

### Common Development Issues

**Build Issues:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf dist .vite
npm run build
```

**API Connection Issues:**

- Verify `VITE_API_BASE_URL` in .env.local
- Ensure backend is running on correct port
- Check browser network tab for CORS errors

**Hot Reload Issues:**

```bash
# Restart dev server
npm run dev

# Check if port is already in use
netstat -ano | findstr :5173
```

**TypeScript Issues:**

```bash
# Run type checking
npm run type-check

# Generate TypeScript definitions
npm run build
```

**Performance Issues:**

```bash
# Analyze bundle size
npm run build:analyze

# Check for memory leaks
npm run dev -- --host
```

### Production Issues

**Build Failures:**

- Check environment variables are set
- Verify all dependencies are installed
- Ensure TypeScript types are correct

**Deployment Issues:**

- Verify build artifacts in `dist/` directory
- Check deployment platform logs
- Ensure environment variables are set in production

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

<div align="center">
  <p>⚛️ Built with React and Vite for modern healthcare experiences</p>
</div>
