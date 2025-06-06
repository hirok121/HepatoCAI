// Frontend Configuration Constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
  RETRY_DELAY: parseInt(import.meta.env.VITE_API_RETRY_DELAY) || 1000,
};

// Authentication
export const AUTH_CONFIG = {
  ACCESS_TOKEN_KEY: 'access',
  REFRESH_TOKEN_KEY: 'refresh',
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes in milliseconds
};

// Application Constants
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'HepatoCAI',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENVIRONMENT: import.meta.env.VITE_APP_ENV || 'development',
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'error',
  TITLE: import.meta.env.VITE_APP_TITLE || 'HepatoC AI - Advanced Liver Health Diagnosis',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Advanced AI-powered hepatitis diagnosis and liver health monitoring platform',
  KEYWORDS: import.meta.env.VITE_APP_KEYWORDS || 'hepatitis,liver health,AI diagnosis,medical,healthcare',
  AUTHOR: import.meta.env.VITE_APP_AUTHOR || 'HepatoCAI Team',
  THEME_COLOR: import.meta.env.VITE_APP_THEME_COLOR || '#2563EB',
  BACKGROUND_COLOR: import.meta.env.VITE_APP_BACKGROUND_COLOR || '#ffffff',
};

// Feature Flags
export const FEATURES = {
  ENABLE_DEBUG_CONSOLE: import.meta.env.VITE_ENABLE_DEBUG_CONSOLE === 'true',
  ENABLE_DIAGNOSIS_DEBUG: import.meta.env.VITE_ENABLE_DIAGNOSIS_DEBUG === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_SERVICE_WORKER: import.meta.env.VITE_ENABLE_SERVICE_WORKER === 'true',
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  ENABLE_OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
};

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  CACHE_ENABLED: import.meta.env.VITE_CACHE_ENABLED === 'true',
  CACHE_TTL: parseInt(import.meta.env.VITE_CACHE_TTL) || 300000, // 5 minutes
  LAZY_LOADING: import.meta.env.VITE_LAZY_LOADING !== 'false', // Default true
  IMAGE_OPTIMIZATION: import.meta.env.VITE_IMAGE_OPTIMIZATION !== 'false', // Default true
  ENABLE_PERFORMANCE_MONITORING: import.meta.env.VITE_PERFORMANCE_MONITORING === 'true',
  DEBOUNCE_DELAY: parseInt(import.meta.env.VITE_DEBOUNCE_DELAY) || 300,
  THROTTLE_DELAY: parseInt(import.meta.env.VITE_THROTTLE_DELAY) || 100,
  API_RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || API_CONFIG.RETRY_ATTEMPTS,
  API_RETRY_DELAY: parseInt(import.meta.env.VITE_API_RETRY_DELAY) || API_CONFIG.RETRY_DELAY,
};

// UI Constants
export const UI_CONFIG = {
  DRAWER_WIDTH: 240,
  HEADER_HEIGHT: 64,
  FOOTER_HEIGHT: 48,
};

// Routes
export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  DASHBOARD: '/my-health-dashboard',
  DIAGNOSIS: '/diagnosis',
  AI_ASSISTANT: '/ai-assistant',
  ADMIN: '/admin',
  PROFILE: '/profile',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/accounts/token/',
    REGISTER: '/users/register/',
    REFRESH: '/accounts/token/refresh/',
    LOGOUT: '/users/logout/',
    VERIFY_EMAIL: '/users/verify-email/',
    RESET_PASSWORD: '/users/reset-password/',
    CHECK_EMAIL: '/users/check-email/',
    GOOGLE_LOGIN: '/accounts/google/login/',
  },
  USER: {
    PROFILE: '/users/profile/me/',
    ADMIN_USERS: '/users/admin/users/',
    STAFF_USERS: '/users/staff/users/',
  },
  DIAGNOSIS: {
    ANALYZE: '/diagnosis/analyze-hcv/',
    MY_DIAGNOSES: '/diagnosis/my-diagnoses/',
    ANALYTICS: '/diagnosis/analytics/',
    EXPORT_CSV: '/diagnosis/export/csv/',
    EXPORT_EXCEL: '/diagnosis/export/excel/',  },
};
