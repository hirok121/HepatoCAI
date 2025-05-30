// Frontend Configuration Constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  VERSION: import.meta.env.VITE_API_VERSION || 'v1',
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
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'error',
};

// Google OAuth
export const OAUTH_CONFIG = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

// Feature Flags
export const FEATURES = {
  ENABLE_DEBUG_CONSOLE: import.meta.env.VITE_ENABLE_DEBUG_CONSOLE === 'true' || 'false',
  ENABLE_DIAGNOSIS_DEBUG: import.meta.env.VITE_ENABLE_DIAGNOSIS_DEBUG === 'true' || false,
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true' || 'true',
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
  DASHBOARD: '/dashboard',
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
    EXPORT_EXCEL: '/diagnosis/export/excel/',
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please sign in again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully signed in!',
  REGISTER_SUCCESS: 'Account created successfully! Please check your email for verification.',
  LOGOUT_SUCCESS: 'Successfully signed out!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_RESET: 'Password reset email sent!',
  EMAIL_VERIFIED: 'Email verified successfully!',
};

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

// Diagnosis Constants
export const DIAGNOSIS_CONFIG = {
  RISK_LEVELS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
  },
  FIBROSIS_STAGES: {
    F0: 'No fibrosis',
    F1: 'Mild fibrosis',
    F2: 'Moderate fibrosis',
    F3: 'Severe fibrosis',
    F4: 'Cirrhosis',
  },
};

// Theme Constants
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: '#2563EB',
    SECONDARY: '#4F46E5',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6',
  },
  BREAKPOINTS: {
    XS: 0,
    SM: 600,
    MD: 960,
    LG: 1280,
    XL: 1920,
  },
};

// Legacy constants for backward compatibility (to be removed)
export const ACCESS_TOKEN = AUTH_CONFIG.ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN = AUTH_CONFIG.REFRESH_TOKEN_KEY;
