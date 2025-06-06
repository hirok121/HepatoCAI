// Configuration validation utility
import { 
  API_CONFIG, 
  APP_CONFIG, 
  FEATURES, 
  PERFORMANCE_CONFIG,
  SECURITY_CONFIG,
  ANALYTICS_CONFIG 
} from './constants.js';

/**
 * Validates essential configuration values
 * @returns {Object} Validation result with errors and warnings
 */
export function validateConfiguration() {
  const errors = [];
  const warnings = [];

  // Required configurations
  if (!API_CONFIG.BASE_URL) {
    errors.push('VITE_API_BASE_URL is required');
  }

  if (!API_CONFIG.FRONTEND_URL) {
    errors.push('VITE_FRONTEND_URL is required');
  }

  if (!APP_CONFIG.NAME) {
    warnings.push('VITE_APP_NAME is not set, using default');
  }

  // Production-specific validations
  if (APP_CONFIG.ENVIRONMENT === 'production') {
    if (APP_CONFIG.DEBUG) {
      warnings.push('Debug mode is enabled in production');
    }

    if (FEATURES.ENABLE_DEBUG_CONSOLE) {
      warnings.push('Debug console is enabled in production');
    }

    if (!ANALYTICS_CONFIG.GOOGLE_ANALYTICS_ID && FEATURES.ENABLE_ANALYTICS) {
      warnings.push('Analytics is enabled but Google Analytics ID is not set');
    }

    if (!SECURITY_CONFIG.ENABLE_CSP) {
      warnings.push('Content Security Policy is disabled in production');
    }

    if (import.meta.env.VITE_BUILD_SOURCEMAP === 'true') {
      warnings.push('Source maps are enabled in production build');
    }
  }

  // Development-specific validations
  if (APP_CONFIG.ENVIRONMENT === 'development') {
    if (!APP_CONFIG.DEBUG) {
      warnings.push('Debug mode is disabled in development');
    }
  }

  // Performance validations
  if (PERFORMANCE_CONFIG.CACHE_TTL < 60000) {
    warnings.push('Cache TTL is very low, may impact performance');
  }

  // API configuration validations
  if (API_CONFIG.TIMEOUT < 5000) {
    warnings.push('API timeout is very low, may cause failed requests');
  }

  if (API_CONFIG.RETRY_ATTEMPTS > 5) {
    warnings.push('API retry attempts are very high, may cause delays');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      environment: APP_CONFIG.ENVIRONMENT,
      debugMode: APP_CONFIG.DEBUG,
      apiUrl: API_CONFIG.BASE_URL,
      featuresEnabled: Object.entries(FEATURES)
        .filter(([_, enabled]) => enabled)
        .map(([feature, _]) => feature)
    }
  };
}

/**
 * Logs configuration validation results
 */
export function logConfigurationStatus() {
  const validation = validateConfiguration();
  
  console.group('🔧 Configuration Validation');
  
  console.log('Environment:', validation.summary.environment);
  console.log('Debug Mode:', validation.summary.debugMode ? '✅ Enabled' : '❌ Disabled');
  console.log('API URL:', validation.summary.apiUrl);
  
  if (validation.summary.featuresEnabled.length > 0) {
    console.log('Features Enabled:', validation.summary.featuresEnabled.join(', '));
  }

  if (validation.errors.length > 0) {
    console.group('❌ Errors');
    validation.errors.forEach(error => console.error(error));
    console.groupEnd();
  }

  if (validation.warnings.length > 0) {
    console.group('⚠️ Warnings');
    validation.warnings.forEach(warning => console.warn(warning));
    console.groupEnd();
  }

  if (validation.isValid) {
    console.log('✅ Configuration is valid');
  } else {
    console.log('❌ Configuration has errors');
  }

  console.groupEnd();
  
  return validation;
}

/**
 * Exports current configuration for debugging
 */
export function exportConfiguration() {
  return {
    api: API_CONFIG,
    app: APP_CONFIG,
    features: FEATURES,
    performance: PERFORMANCE_CONFIG,
    security: SECURITY_CONFIG,
    analytics: ANALYTICS_CONFIG,
    environment: {
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
      mode: import.meta.env.MODE
    }
  };
}

// Auto-validate configuration in development
if (import.meta.env.DEV && APP_CONFIG.DEBUG) {
  logConfigurationStatus();
}
