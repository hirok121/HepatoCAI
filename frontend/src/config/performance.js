// Performance optimization configuration for React frontend
import React, { lazy } from 'react';

// Environment-based configuration
export const PERFORMANCE_CONFIG = {
  // API Configuration
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  API_RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
  API_RETRY_DELAY: parseInt(import.meta.env.VITE_API_RETRY_DELAY) || 1000,
  
  // Caching Configuration
  CACHE_ENABLED: import.meta.env.VITE_CACHE_ENABLED === 'true',
  CACHE_TTL: parseInt(import.meta.env.VITE_CACHE_TTL) || 300000, // 5 minutes
  
  // UI Performance
  DEBOUNCE_DELAY: parseInt(import.meta.env.VITE_DEBOUNCE_DELAY) || 300,
  THROTTLE_DELAY: parseInt(import.meta.env.VITE_THROTTLE_DELAY) || 100,
  
  // Bundle Optimization
  LAZY_LOADING_ENABLED: import.meta.env.VITE_LAZY_LOADING === 'true',
  IMAGE_OPTIMIZATION: import.meta.env.VITE_IMAGE_OPTIMIZATION === 'true',
  
  // Development vs Production
  IS_DEVELOPMENT: import.meta.env.DEV,
  ENABLE_PERFORMANCE_MONITORING: import.meta.env.VITE_PERFORMANCE_MONITORING === 'true',
};

// Lazy-loaded components for code splitting
export const LazyComponents = {
  // Admin Components
  AdminDashboard: lazy(() => import('../pages/admin/AdminDashboard')),
  AdminUserManagement: lazy(() => import('../pages/admin/UserManagement')),
  AdminAnalytics: lazy(() => import('../pages/admin/AdminAnalytics')),
  AdminSystem: lazy(() => import('../pages/admin/AdminSystem')),
  AdminDebugConsole: lazy(() => import('../pages/admin/AdminDebugConsole')),
  AdminDiagnosisManagement: lazy(() => import('../pages/admin/AdminDiagnosisManagement')),
    // Main Application Components
  Home: lazy(() => import('../pages/Home')),
  Diagnosis: lazy(() => import('../pages/diagnosis/Diagnosis')),
  Analytics: lazy(() => import('../pages/AnalyticsPage')),
  AIAssistant: lazy(() => import('../pages/AIAssistant')),
  PatientEducation: lazy(() => import('../pages/PatientEducation')),
  Research: lazy(() => import('../pages/Research')),
  ProfileDashboard: lazy(() => import('../pages/ProfileDashboard')),
  ProfilePage: lazy(() => import('../pages/ProfilePage')),
  CommunityForum: lazy(() => import('../pages/public/CommunityForum')),
  
  // Blog Pages
  UnderstandingHepatitisTypes: lazy(() => import('../pages/blogs/understanding-hepatitis-types')),
  PreventionGuidelines: lazy(() => import('../pages/blogs/prevention-guidelines')),
  TreatmentOptions: lazy(() => import('../pages/blogs/treatment-options')),
  LivingWithHepatitis: lazy(() => import('../pages/blogs/living-with-hepatitis')),
  NutritionGuide: lazy(() => import('../pages/blogs/nutrition-guide')),
  FaqsAboutHepatitis: lazy(() => import('../pages/blogs/faqs-about-hepatitis')),
  UnderstandingHcv: lazy(() => import('../pages/blogs/understanding-hcv')),
  MachineLearningLiverDisease: lazy(() => import('../pages/blogs/machine-learning-liver-disease')),
  BiomarkerAnalysis: lazy(() => import('../pages/blogs/biomarker-analysis')),
  
  // Public Pages
  About: lazy(() => import('../pages/public/About')),
  Contact: lazy(() => import('../pages/public/Contact')),
  Methodology: lazy(() => import('../pages/public/Methodology')),
  FAQ: lazy(() => import('../pages/public/FAQ')),
  NotFound: lazy(() => import('../pages/public/NotFound')),
    // Authentication Components (use existing pages/auth)
  SignIn: lazy(() => import('../pages/auth/SignIn')),
  SignUp: lazy(() => import('../pages/auth/SignUp')),
  ResetPassword: lazy(() => import('../pages/auth/ResetPassword')),
  ResetPasswordConfirm: lazy(() => import('../pages/auth/ResetPasswordConfirmation')),
};

// Performance monitoring utilities
export class PerformanceMonitor {
  static startTime = null;
  static metrics = {};

  static init() {
    if (PERFORMANCE_CONFIG.ENABLE_PERFORMANCE_MONITORING) {
      console.log('HepatoCAI Performance Monitoring initialized');
      this.startMeasurement('app-initialization');
    }
  }

  static startMeasurement(name) {
    this.startTime = performance.now();
    this.metrics[name] = { start: this.startTime };
  }

  static endMeasurement(name) {
    if (this.metrics[name]) {
      const endTime = performance.now();
      this.metrics[name].duration = endTime - this.metrics[name].start;
      
      if (PERFORMANCE_CONFIG.ENABLE_PERFORMANCE_MONITORING) {
        console.log(`Performance: ${name} took ${this.metrics[name].duration.toFixed(2)}ms`);
      }
      
      return this.metrics[name].duration;
    }
  }

  static measureComponent(WrappedComponent, componentName) {
    return function MeasuredComponent(props) {
      React.useEffect(() => {
        PerformanceMonitor.startMeasurement(componentName);
        return () => {
          PerformanceMonitor.endMeasurement(componentName);
        };
      }, []);

      return React.createElement(WrappedComponent, props);
    };
  }
}

// API optimization utilities
export class APIOptimizer {
  static cache = new Map();

  static async cachedRequest(key, requestFn, ttl = PERFORMANCE_CONFIG.CACHE_TTL) {
    if (!PERFORMANCE_CONFIG.CACHE_ENABLED) {
      return await requestFn();
    }

    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    const data = await requestFn();
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  static clearCache(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  static async retryRequest(requestFn, maxAttempts = PERFORMANCE_CONFIG.API_RETRY_ATTEMPTS) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxAttempts) {
          // Exponential backoff
          const delay = PERFORMANCE_CONFIG.API_RETRY_DELAY * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
}

// Debounce and throttle utilities
export const debounce = (func, delay = PERFORMANCE_CONFIG.DEBOUNCE_DELAY) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const throttle = (func, delay = PERFORMANCE_CONFIG.THROTTLE_DELAY) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func.apply(null, args);
    }
  };
};

// Image optimization utilities
export const optimizeImage = (src, width, height) => {
  if (!PERFORMANCE_CONFIG.IMAGE_OPTIMIZATION) {
    return src;
  }
  
  // Add image optimization parameters (if using a service like Cloudinary)
  // This is a placeholder - implement based on your image service
  return `${src}?w=${width}&h=${height}&f=auto&q=auto`;
};

// Bundle analysis utility (development only)
export const analyzeBundle = () => {
  if (PERFORMANCE_CONFIG.IS_DEVELOPMENT && window.performance) {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paintEntries = performance.getEntriesByType('paint');
    
    console.group('Bundle Performance Analysis');
    console.log('DOM Content Loaded:', `${navigation.domContentLoadedEventEnd}ms`);
    console.log('Load Complete:', `${navigation.loadEventEnd}ms`);
    
    paintEntries.forEach(entry => {
      console.log(`${entry.name}:`, `${entry.startTime}ms`);
    });
    
    console.groupEnd();
  }
};

// React performance hooks
export const usePerformanceMonitoring = (componentName) => {
  React.useEffect(() => {
    if (PERFORMANCE_CONFIG.ENABLE_PERFORMANCE_MONITORING) {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        console.log(`${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
      };
    }
  });
};

export const useDebouncedValue = (value, delay = PERFORMANCE_CONFIG.DEBOUNCE_DELAY) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
