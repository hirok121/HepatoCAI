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

// Google OAuth
export const OAUTH_CONFIG = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
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
  CACHE_TTL: parseInt(import.meta.env.VITE_CACHE_TTL) || 300000,
  DEBOUNCE_DELAY: parseInt(import.meta.env.VITE_DEBOUNCE_DELAY) || 300,
  THROTTLE_DELAY: parseInt(import.meta.env.VITE_THROTTLE_DELAY) || 100,
  LAZY_LOADING: import.meta.env.VITE_LAZY_LOADING === 'true',
  IMAGE_OPTIMIZATION: import.meta.env.VITE_IMAGE_OPTIMIZATION === 'true',
  PERFORMANCE_MONITORING: import.meta.env.VITE_PERFORMANCE_MONITORING === 'true',
  BUNDLE_ANALYZER: import.meta.env.VITE_BUNDLE_ANALYZER === 'true',
};

// Security Configuration
export const SECURITY_CONFIG = {
  ENABLE_CSP: import.meta.env.VITE_ENABLE_CSP === 'true',
  CSP_REPORT_URI: import.meta.env.VITE_CSP_REPORT_URI || '',
  ENABLE_HSTS: import.meta.env.VITE_ENABLE_HSTS === 'true',
  SECURITY_HEADERS: import.meta.env.VITE_SECURITY_HEADERS === 'true',
};

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
  HOTJAR_ID: import.meta.env.VITE_HOTJAR_ID || '',
  MIXPANEL_TOKEN: import.meta.env.VITE_MIXPANEL_TOKEN || '',
};

// CDN Configuration
export const CDN_CONFIG = {
  CDN_URL: import.meta.env.VITE_CDN_URL || '',
  IMAGE_CDN_URL: import.meta.env.VITE_IMAGE_CDN_URL || '',
  STATIC_ASSETS_URL: import.meta.env.VITE_STATIC_ASSETS_URL || '',
};

// Deployment Configuration
export const DEPLOYMENT_CONFIG = {
  ENVIRONMENT: import.meta.env.VITE_DEPLOYMENT_ENVIRONMENT || 'development',
  VERSION: import.meta.env.VITE_DEPLOYMENT_VERSION || '',
  BUILD_TIMESTAMP: import.meta.env.VITE_BUILD_TIMESTAMP || '',
  GIT_COMMIT_HASH: import.meta.env.VITE_GIT_COMMIT_HASH || '',
  CI_BUILD_NUMBER: import.meta.env.VITE_CI_BUILD_NUMBER || '',
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
