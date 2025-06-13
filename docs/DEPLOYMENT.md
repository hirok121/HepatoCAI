# Deployment Guide

<div align="center">
  <h2>🚀 HepatoCAI Deployment Guide</h2>
  <p>Complete guide for deploying HepatoCAI to production</p>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Database Setup](#database-setup)
- [Domain and SSL](#domain-and-ssl)
- [Monitoring](#monitoring)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This guide covers deploying HepatoCAI to production environments. The project is configured for deployment on Render for both frontend and backend components.

### Current Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Render)      │────│   (Render)      │────│  (PostgreSQL)   │
│   React + Vite  │    │   Django + DRF  │    │   on Render     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Files  │    │   File Storage  │    │   Monitoring    │
│   (Render CDN)  │    │   (Local/S3)    │    │   (Logs)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Deployment Features

- **Backend**: Django REST API deployed as Render Web Service
- **Frontend**: React application deployed as Render Static Site
- **Database**: PostgreSQL managed database on Render
- **Build Process**: Automated builds from GitHub repository
- **SSL**: Automatic HTTPS certificates
- **Custom Domains**: Support for custom domain configuration

## ✅ Prerequisites

### Required Accounts

- **Render** (Full-stack hosting) - Free tier available
- **GitHub** (Code repository and automated deployments)
- **Google Cloud** (AI APIs) - Pay-as-you-go
- **Domain Registrar** (Optional for custom domain)

### Development Tools

- Git
- Node.js 18+
- Python 3.13+
- GitHub account with repository access

### Repository Setup

- Fork or clone the HepatoCAI repository
- Ensure both `backend/render.yaml` and `frontend/render.yaml` are present
- Configure environment variables for production

## 🔧 Environment Setup

### Environment Variables

Create production environment files:

#### Backend (.env)

```bash
# Production Settings
DEBUG=False
SECRET_KEY=your-super-secure-secret-key-here
ALLOWED_HOSTS=your-backend-domain.com,localhost

# Database (PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://your-backend-domain.com

# Email Configuration
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Google AI APIs
GOOGLE_API_KEY=your-google-api-key

# Security
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# Caching (Redis - optional)
REDIS_URL=redis://username:password@host:port

# Monitoring
SENTRY_DSN=your-sentry-dsn-url

# Site Configuration
SITE_ID=1
```

#### Frontend (.env.production)

```bash
# API Configuration
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_API_TIMEOUT=10000

# Authentication
VITE_JWT_SECRET=your-jwt-secret
VITE_OAUTH_GOOGLE_CLIENT_ID=your-google-client-id

# App Configuration
VITE_APP_NAME=HepatoCAI
VITE_APP_TITLE=HepatoCAI - AI-Powered Hepatitis C Detection
VITE_APP_DESCRIPTION=Advanced HCV stage detection powered by artificial intelligence
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_CONSOLE=false

# Social Media
VITE_APP_KEYWORDS=hepatitis c, ai diagnosis, healthcare, machine learning
VITE_APP_AUTHOR=HepatoCAI Team
VITE_APP_THEME_COLOR=#2563EB
```

## 🔧 Backend Deployment

### Render Backend Deployment

The backend is configured to deploy automatically to Render using the `backend/render.yaml` configuration.

#### 1. Repository Setup

Ensure your repository has the correct structure:

```
backend/
├── render.yaml          # Render deployment configuration
├── build.sh            # Build script for deployment
├── requirements.txt     # Python dependencies
├── runtime.txt         # Python version specification
└── manage.py           # Django management script
```

#### 2. Render Configuration

The `backend/render.yaml` file contains:

```yaml
services:
  - type: web
    name: hepatocai-backend
    env: python
    buildCommand: "./build.sh"
    startCommand: "gunicorn backend.wsgi:application"
    envVars:
      - key: PYTHON_VERSION
        value: 3.13.3
      - key: DEBUG
        value: False
      - key: SECRET_KEY
        generateValue: true
      - key: ALLOWED_HOSTS
        sync: false
      - key: BACKEND_URL
        sync: false
      - key: FRONTEND_URL
        sync: false
```

#### 3. Build Script

The `backend/build.sh` script handles:

```bash
#!/usr/bin/env bash
# Build script for Render deployment

set -o errexit  # Exit on error

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run database migrations
python manage.py migrate
```

#### 4. Deploy to Render

1. **Connect Repository**:

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your backend code

2. **Configure Service**:

   - **Name**: `hepatocai-backend`
   - **Environment**: `Python`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn backend.wsgi:application`
   - **Branch**: `main`

3. **Environment Variables**:
   Set the following in Render dashboard:

   ```
   DEBUG=False
   SECRET_KEY=[Generate secure key]
   ALLOWED_HOSTS=hepatocai-backend.onrender.com
   BACKEND_URL=https://hepatocai-backend.onrender.com
   FRONTEND_URL=https://hepatocai-frontend.onrender.com
   GOOGLE_API_KEY=[Your Google API key]
   EMAIL_HOST_USER=[Your Gmail]
   EMAIL_HOST_PASSWORD=[Your app password]
   ```

4. **Database Setup**:
   - Render will automatically provide a PostgreSQL database
   - The `DATABASE_URL` environment variable is set automatically

#### 5. Custom Domain (Optional)

To use a custom domain:

1. In Render dashboard → Service → Settings
2. Add custom domain under "Custom Domains"
3. Configure DNS records as instructed
4. Update `ALLOWED_HOSTS` environment variable

#### 4. Post-Deployment Setup

```bash
# Create superuser (via Render shell)
python manage.py createsuperuser

# Load initial data (if any)
python manage.py loaddata initial_data.json
```

### Option 2: Railway Deployment

Railway offers simple deployment with automatic scaling.

#### 1. Install Railway CLI

```bash
npm install -g @railway/cli
railway login
```

#### 2. Deploy

```bash
cd backend
railway init
railway add --name hepatocai-backend
railway deploy
```

#### 3. Environment Variables

Set via Railway dashboard or CLI:

```bash
railway variables set DEBUG=False
railway variables set SECRET_KEY=your-secret-key
railway variables set FRONTEND_URL=https://your-frontend-domain.com
```

### Option 3: AWS Deployment

For enterprise deployments using AWS Elastic Beanstalk.

#### 1. Install EB CLI

```bash
pip install awsebcli
```

#### 2. Initialize Application

```bash
cd backend
eb init hepatocai-backend
eb create production
```

#### 3. Configuration

Create `.ebextensions/django.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:container:python:
    WSGIPath: backend.wsgi:application
  aws:elasticbeanstalk:environment:proxy:staticfiles:
    /static: staticfiles
```

## 🎨 Frontend Deployment

### Render Frontend Deployment

The frontend is configured as a static site deployment on Render using the `frontend/render.yaml` configuration.

#### 1. Frontend Structure

Ensure your frontend has the correct structure:

```
frontend/
├── render.yaml          # Render static site configuration
├── package.json         # Node.js dependencies and scripts
├── vite.config.js      # Vite build configuration
├── src/                # React source code
└── public/             # Static assets
```

#### 2. Render Configuration

The `frontend/render.yaml` file contains:

```yaml
services:
  - type: web
    name: hepatocai-frontend
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    headers:
      - key: Cache-Control
        value: public, max-age=0, must-revalidate
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
      - type: rewrite
        source: /auth/callback
        destination: /index.html
      - type: rewrite
        source: /signin
        destination: /index.html
      - type: rewrite
        source: /signup
        destination: /index.html
```

#### 3. Build Configuration

Ensure your `package.json` has the correct build script:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "dev": "vite --host"
  }
}
```

#### 4. Environment Variables

Create environment configuration for production. Set these in your Render dashboard:

```
VITE_API_BASE_URL=https://hepatocai-backend.onrender.com
VITE_APP_TITLE=HepatoCAI - AI-Powered Hepatitis C Detection
VITE_APP_DESCRIPTION=Advanced HCV stage detection powered by artificial intelligence
VITE_GOOGLE_CLIENT_ID=[Your Google OAuth Client ID]
```

#### 5. Deploy to Render

1. **Connect Repository**:

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select the repository containing your frontend code

2. **Configure Static Site**:

   - **Name**: `hepatocai-frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Branch**: `main`

3. **Auto-Deploy**:
   - Enable auto-deploy from GitHub
   - Render will automatically rebuild when you push changes

#### 6. Custom Domain (Optional)

To use a custom domain:

1. In Render dashboard → Static Site → Settings
2. Add custom domain under "Custom Domains"
3. Configure DNS records as instructed
4. Update CORS settings in backend to include new domain
   },
   "routes": [
   {
   "src": "/api/(.*)",
   "dest": "https://your-backend-domain.com/api/$1"
   },
   {
   "src": "/(.*)",
   "dest": "/index.html"
   }
   ]
   }

````

#### 4. Custom Domain

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Option 2: Netlify Deployment

#### 1. Build Configuration

Create `netlify.toml`:

```toml
[build]
  base = "frontend/"
  publish = "frontend/dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-domain.com/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
````

#### 2. Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod
```

### Option 3: GitHub Pages

For static hosting without backend proxy.

#### 1. GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: |
          cd frontend
          npm install

      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

## 🗄️ Database Setup

### PostgreSQL on Render

Render provides managed PostgreSQL databases that integrate seamlessly with your web services.

#### 1. Create Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure your database:
   - **Name**: `hepatocai-database`
   - **Database**: `hepatocai`
   - **User**: `hepatocai_user`
   - **Region**: Same as your web services
   - **Plan**: Free tier available

#### 2. Environment Variables

Render automatically provides the `DATABASE_URL` environment variable to connected services. Your Django settings should include:

```python
import dj_database_url
import os

DATABASES = {
    'default': dj_database_url.parse(
        os.environ.get('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}
```

#### 3. Connect to Web Service

1. In your web service settings on Render
2. Go to "Environment" tab
3. The `DATABASE_URL` will be automatically available
4. Render handles the connection securely

#### 4. Initial Setup

Run these commands via Render shell or include in your build script:

```bash
# Run migrations
python manage.py migrate

# Create superuser (interactive)
python manage.py createsuperuser

# Load any initial data
python manage.py loaddata initial_data.json
```

### Database Backups

Render automatically handles database backups for PostgreSQL instances:

- **Automatic Backups**: Daily backups for 7 days (Free tier)
- **Manual Backups**: Available through dashboard
- **Point-in-time Recovery**: Available on paid plans

### Local Development Database

For local development, you can use SQLite (default) or set up PostgreSQL:

```bash
# Option 1: Use SQLite (default)
# No additional setup required

# Option 2: Install PostgreSQL locally
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

# Create local database
createdb hepatocai_dev

# Update .env for local development
DATABASE_URL=postgresql://username:password@localhost:5432/hepatocai_dev
```

## 🌐 Domain and SSL

### Custom Domain Setup

Both Render services support custom domains with automatic SSL certificates.

#### 1. Backend Custom Domain

1. In Render Dashboard → Web Service → Settings
2. Click "Custom Domains"
3. Add your backend domain (e.g., `api.hepatocai.com`)
4. Configure DNS records as instructed:
   ```
   CNAME api your-backend-service.onrender.com
   ```

#### 2. Frontend Custom Domain

1. In Render Dashboard → Static Site → Settings
2. Click "Custom Domains"
3. Add your frontend domain (e.g., `hepatocai.com`)
4. Configure DNS records as instructed:
   ```
   CNAME www your-frontend-site.onrender.com
   A @ [IP provided by Render]
   ```

#### 3. SSL Certificates

Render automatically provides SSL certificates via Let's Encrypt for all custom domains. No additional configuration required.

#### 4. Update Environment Variables

After setting up custom domains, update your environment variables:

**Backend:**

```
ALLOWED_HOSTS=api.hepatocai.com,hepatocai-backend.onrender.com
FRONTEND_URL=https://hepatocai.com
```

**Frontend:**

```
VITE_API_BASE_URL=https://api.hepatocai.com
```

### Environment-Specific URLs

#### Production

```
Frontend: https://hepatocai.com (or your custom domain)
Backend: https://api.hepatocai.com (or your custom domain)
Database: Managed by Render
```

#### Development

```
Frontend: http://localhost:5173
Backend: http://localhost:8000
Database: SQLite or local PostgreSQL
```

## 📊 Monitoring

### Application Monitoring

#### Render Logs

Render provides built-in logging for both web services and static sites:

1. **Real-time Logs**: View live logs in the Render dashboard
2. **Build Logs**: Monitor deployment and build processes
3. **Application Logs**: Track runtime errors and performance
4. **Database Logs**: Monitor database connections and queries

#### Health Checks

Render automatically monitors your services:

- **Health Check Endpoint**: Configure in service settings
- **Uptime Monitoring**: Automatic service restart on failures
- **Performance Metrics**: CPU, memory, and response time tracking

#### Error Tracking with Sentry (Optional)

For advanced error tracking, integrate Sentry:

1. Create a Sentry project at [sentry.io](https://sentry.io)
2. Install Sentry SDK:

```bash
# Backend
pip install sentry-sdk[django]
```

3. Configure in `backend/settings.py`:

```python
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

if not DEBUG:
    sentry_sdk.init(
        dsn=os.environ.get('SENTRY_DSN'),
        integrations=[DjangoIntegration()],
        traces_sample_rate=0.1,
        send_default_pii=False,
        environment='production'
    )
```

4. Add to Render environment variables:

```
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Performance Monitoring

#### Backend Metrics

```python
# Custom middleware for performance tracking
class PerformanceMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        response = self.get_response(request)
        duration = time.time() - start_time

        # Log performance metrics
        logger.info(f"Request {request.path} took {duration:.2f}s")

        return response
```

#### Frontend Metrics

```javascript
// Performance tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Health Checks

#### Backend Health Check

```python
# views.py
from django.http import JsonResponse
from django.db import connection

def health_check(request):
    try:
        # Check database
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")

        return JsonResponse({
            'status': 'healthy',
            'database': 'connected',
            'timestamp': timezone.now().isoformat()
        })
    except Exception as e:
        return JsonResponse({
            'status': 'unhealthy',
            'error': str(e)
        }, status=500)
```

#### Frontend Health Check

```javascript
// Service to check API health
export const checkHealth = async () => {
  try {
    const response = await fetch("/api/health/");
    return await response.json();
  } catch (error) {
    return { status: "unhealthy", error: error.message };
  }
};
```

## 🔧 Maintenance

### Regular Updates

#### 1. Dependency Updates

Keep your dependencies updated for security and performance:

```powershell
# Backend dependencies
cd backend
pip list --outdated
pip install -U package_name

# Frontend dependencies
cd frontend
npm outdated
npm update
```

#### 2. Security Updates

Regularly check for security vulnerabilities:

```powershell
# Check for vulnerabilities
cd frontend
npm audit

cd backend
pip-audit

# Fix vulnerabilities
npm audit fix
pip install --upgrade package_name
```

### Backup Strategy

#### Database Backups

Render provides automatic backups for PostgreSQL databases:

- **Automatic Backups**: Daily backups retained for 7 days (Free tier)
- **Manual Backups**: Create backups on-demand via dashboard
- **Point-in-time Recovery**: Available on paid plans

#### Manual Database Backup

You can also create manual backups:

```powershell
# Using pg_dump with Render database URL
pg_dump $env:DATABASE_URL > backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
```

### Deployment Pipeline

#### Automatic Deployments

Render automatically deploys when you push to your connected GitHub repository:

1. **Push to Repository**:

   ```powershell
   git add .
   git commit -m "Update application"
   git push origin main
   ```

2. **Automatic Build**: Render detects changes and starts build process
3. **Automatic Deploy**: After successful build, new version goes live
4. **Health Check**: Render monitors the deployment for issues

#### Manual Deployment

You can also trigger manual deployments:

1. Go to Render Dashboard
2. Select your service
3. Click "Manual Deploy" → "Deploy latest commit"
   name: Deploy to Production

on:
push:
branches: [main]

jobs:
test:
runs-on: ubuntu-latest
steps: - uses: actions/checkout@v3 - name: Run tests
run: |
cd backend
python manage.py test
cd ../frontend
npm test

deploy-backend:
needs: test
runs-on: ubuntu-latest
steps: - name: Deploy to Render
run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}

deploy-frontend:
needs: test
runs-on: ubuntu-latest
steps: - name: Deploy to Vercel
run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}

````

## 🚨 Troubleshooting

### Common Deployment Issues

#### Backend Issues

**Build Failures:**

1. **Check Build Logs**: View detailed logs in Render dashboard
2. **Python Version**: Ensure `runtime.txt` specifies correct Python version
3. **Dependencies**: Check `requirements.txt` for version conflicts

```powershell
# Check Python version locally
python --version

# Test build locally
cd backend
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate --check
````

**Database Connection Errors:**

1. **Check Database Status**: Ensure PostgreSQL database is running in Render
2. **Connection String**: Verify `DATABASE_URL` is correctly set

```powershell
# Test database connection locally
python manage.py dbshell

# Check migrations
python manage.py showmigrations
```

**Static Files Not Loading:**

```python
# Ensure settings.py has correct static file configuration
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# WhiteNoise for serving static files
MIDDLEWARE = [
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # ... other middleware
]
```

**Environment Variables:**

Check environment variables in Render dashboard:

```
DEBUG=False
SECRET_KEY=[Generated]
ALLOWED_HOSTS=your-app.onrender.com
DATABASE_URL=[Auto-generated]
```

#### Frontend Issues

**Build Failures:**

1. **Check Build Logs**: View build process in Render dashboard
2. **Node Version**: Ensure compatible Node.js version
3. **Dependencies**: Check for package conflicts

```powershell
# Test build locally
cd frontend
npm install
npm run build
```

**API Connection Issues:**

1. **CORS Configuration**: Ensure backend allows frontend domain
2. **Environment Variables**: Check `VITE_API_BASE_URL` is correct

```javascript
// Check API URL in browser console
console.log(import.meta.env.VITE_API_BASE_URL);
```

**Routing Issues:**

Ensure `render.yaml` includes proper routing configuration:

```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

### Performance Issues

**Slow Response Times:**

1. **Database Queries**: Optimize slow queries using Django Debug Toolbar
2. **Static Files**: Ensure proper caching headers
3. **Database Connections**: Use connection pooling

**Memory Issues:**

1. **Monitor Usage**: Check Render dashboard for memory usage
2. **Optimize Queries**: Use `select_related()` and `prefetch_related()`
3. **Upgrade Plan**: Consider upgrading to higher memory tier

### Getting Help

**Render Support:**

1. **Documentation**: [Render Docs](https://render.com/docs)
2. **Community**: [Render Community Forum](https://community.render.com)
3. **Support**: Contact support through Render dashboard

**Django/React Issues:**

1. **Django Documentation**: [docs.djangoproject.com](https://docs.djangoproject.com)
2. **React Documentation**: [react.dev](https://react.dev)
3. **Stack Overflow**: Tag questions with `django`, `react`, `render`

````

#### Frontend Issues

**API Connection Errors:**

```javascript
// Check environment variables
console.log(import.meta.env.VITE_API_BASE_URL);

// Test API connectivity
fetch(import.meta.env.VITE_API_BASE_URL + "/api/health/")
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
````

**Build Errors:**

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build

# Check for TypeScript errors
npm run type-check
```

**Routing Issues:**

```javascript
// Ensure _redirects file for SPA routing
/* /index.html 200
```

### Performance Issues

#### Slow API Responses

```python
# Add database indexing
class Migration(migrations.Migration):
    operations = [
        migrations.RunSQL(
            "CREATE INDEX idx_hcv_patient_created_at ON diagnosis_hcvpatient(created_at);"
        ),
    ]
```

#### Large Bundle Size

```javascript
// Analyze bundle
npm run build:analyze

// Implement code splitting
const LazyComponent = lazy(() => import('./Component'));
```

### Security Issues

#### CORS Errors

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
    "https://your-staging-domain.com",
]

CORS_ALLOW_CREDENTIALS = True
```

#### SSL Certificate Issues

```bash
# Check SSL certificate
openssl s_client -connect your-domain.com:443

# Force HTTPS redirect
SECURE_SSL_REDIRECT = True
```

## 📞 Support

### Deployment Support

- **Platform Documentation**:

  - [Render Docs](https://render.com/docs)
  - [Vercel Docs](https://vercel.com/docs)
  - [Netlify Docs](https://docs.netlify.com)

- **Community Support**:
  - GitHub Issues
  - Discord Community
  - Stack Overflow

### Professional Support

For enterprise deployments:

- Email: deploy-support@hepatocai.com
- Professional services available
- Custom deployment consulting

---

**Last Updated**: January 13, 2025

**Version**: 1.0.0

This deployment guide covers the most common deployment scenarios. For specific requirements or custom deployments, please consult the platform documentation or contact support.
