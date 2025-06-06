# HepatoCAI Frontend Deployment Guide

## Overview

The HepatoCAI frontend is now fully production-ready with environment-based configuration. All dependencies have been moved to environment variables, making deployment as simple as changing the `.env` file.

## Environment Files

### Available Environment Files

- `.env` - Default environment (currently development)
- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment
- `.env.example` - Template with all available variables

### Environment Variables Categories

#### 1. Application Configuration

- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version
- `VITE_APP_ENV` - Environment (development/staging/production)
- `VITE_DEBUG` - Enable/disable debug mode
- `VITE_LOG_LEVEL` - Logging level (debug/info/warn/error)

#### 2. API Configuration

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_FRONTEND_URL` - Frontend URL for CORS
- `VITE_API_TIMEOUT` - API request timeout
- `VITE_API_VERSION` - API version
- `VITE_API_RETRY_ATTEMPTS` - Retry attempts for failed requests
- `VITE_API_RETRY_DELAY` - Delay between retries

#### 3. Build Configuration

- `VITE_BUILD_OUTPUT_DIR` - Build output directory
- `VITE_BUILD_SOURCEMAP` - Generate source maps
- `VITE_BUILD_MINIFY` - Minification method
- `VITE_BUILD_TARGET` - Build target browsers
- `VITE_BASE_PATH` - Base path for deployment

#### 4. Performance Settings

- `VITE_CACHE_ENABLED` - Enable response caching
- `VITE_CACHE_TTL` - Cache time-to-live
- `VITE_LAZY_LOADING` - Enable lazy loading
- `VITE_IMAGE_OPTIMIZATION` - Enable image optimization
- `VITE_PERFORMANCE_MONITORING` - Enable performance monitoring

#### 5. Security Configuration

- `VITE_ENABLE_CSP` - Enable Content Security Policy
- `VITE_ENABLE_HSTS` - Enable HTTP Strict Transport Security
- `VITE_SECURITY_HEADERS` - Enable security headers

#### 6. Feature Flags

- `VITE_ENABLE_DEBUG_CONSOLE` - Debug console
- `VITE_ENABLE_DIAGNOSIS_DEBUG` - Diagnosis debugging
- `VITE_ENABLE_ANALYTICS` - Analytics tracking
- `VITE_ENABLE_SERVICE_WORKER` - Service worker for PWA
- `VITE_ENABLE_NOTIFICATIONS` - Push notifications
- `VITE_ENABLE_OFFLINE_MODE` - Offline functionality

## Deployment Instructions

### Development Deployment

1. Copy `.env.development` to `.env`
2. Update API URLs if needed
3. Run: `npm run dev`

### Staging Deployment

1. Copy `.env.staging` to `.env`
2. Update staging URLs:
   - `VITE_API_BASE_URL=https://staging-api.hepatocai.com`
   - `VITE_FRONTEND_URL=https://staging.hepatocai.com`
3. Set up OAuth credentials for staging
4. Run: `npm run build:staging`
5. Deploy the `dist` folder to staging server

### Production Deployment

1. Copy `.env.production` to `.env`
2. Update production URLs:
   - `VITE_API_BASE_URL=https://api.hepatocai.com`
   - `VITE_FRONTEND_URL=https://hepatocai.com`
3. Set up production OAuth credentials
4. Configure analytics IDs:
   - `VITE_GOOGLE_ANALYTICS_ID`
   - `VITE_SENTRY_DSN`
5. Set up CDN URLs if using CDN
6. Run: `npm run build:production`
7. Deploy the `dist` folder to production server

## Build Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run build:staging` - Staging build
- `npm run build:production` - Production build
- `npm run build:analyze` - Build with bundle analyzer
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run type-check` - TypeScript type checking

## Environment-Specific Configurations

### Development

- Debug mode enabled
- Source maps enabled
- No minification
- Local API URLs
- All debugging features enabled

### Staging

- Limited debug features
- Source maps enabled (for debugging)
- Minification enabled
- Staging API URLs
- Analytics disabled or limited

### Production

- All debug features disabled
- No source maps
- Full minification and optimization
- Production API URLs
- Full analytics and monitoring
- Security headers enabled
- Service worker enabled

## Security Considerations

### Content Security Policy (CSP)

Enable CSP in production by setting `VITE_ENABLE_CSP=true`. This helps prevent XSS attacks.

### HTTPS Configuration

Always use HTTPS in production:

- Set `VITE_PREVIEW_HTTPS=true` for preview
- Ensure all API URLs use HTTPS
- Configure proper SSL certificates

### Environment Variables Security

- Never commit `.env` files with sensitive data
- Use placeholder values in `.env.example`
- Store production secrets securely (CI/CD variables, etc.)

## Monitoring and Analytics

### Performance Monitoring

Enable performance monitoring in production:

- `VITE_PERFORMANCE_MONITORING=true`
- Configure Sentry for error tracking
- Set up proper analytics

### Bundle Analysis

Run `npm run build:analyze` to analyze bundle size and optimize imports.

## Troubleshooting

### Build Issues

1. Check environment variables are properly set
2. Verify API URLs are accessible
3. Check for TypeScript errors: `npm run type-check`
4. Lint code: `npm run lint`

### Runtime Issues

1. Check browser console for errors
2. Verify API endpoints are responding
3. Check OAuth configuration
4. Verify environment variables are loaded correctly

## CDN Configuration

For production deployments with CDN:

1. Set `VITE_CDN_URL` for static assets
2. Set `VITE_IMAGE_CDN_URL` for optimized images
3. Configure proper CORS headers on CDN
4. Update build configuration for CDN paths

## PWA Configuration

To enable PWA features:

1. Set `VITE_ENABLE_SERVICE_WORKER=true`
2. Configure notification settings
3. Set up proper manifest.json
4. Test offline functionality

## Deployment Checklist

### Pre-deployment

- [ ] Update environment variables
- [ ] Test build locally
- [ ] Run linting and type checking
- [ ] Verify API connectivity
- [ ] Test OAuth flow
- [ ] Check bundle size

### Post-deployment

- [ ] Verify site loads correctly
- [ ] Test all major functionality
- [ ] Check analytics tracking
- [ ] Verify error monitoring
- [ ] Test mobile responsiveness
- [ ] Check performance metrics

## Support

For deployment support or issues:

1. Check this documentation
2. Review environment variables in `.env.example`
3. Check build logs for errors
4. Verify API connectivity
5. Contact development team if needed
