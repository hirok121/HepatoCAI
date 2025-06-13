# Installation Guide

<div align="center">
  <h2>⚙️ HepatoCAI Installation Guide</h2>
  <p>Complete step-by-step installation instructions for development and production</p>
</div>

---

## 📋 Table of Contents

- [System Requirements](#system-requirements)
- [Prerequisites](#prerequisites)
- [Development Installation](#development-installation)
- [Production Installation](#production-installation)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [External Service Setup](#external-service-setup)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## 💻 System Requirements

### Minimum Requirements

**Development Environment:**

- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Internet**: Stable connection for API services

**Production Environment:**

- **OS**: Linux (Ubuntu 20.04+ recommended)
- **RAM**: 2GB minimum, 4GB+ recommended
- **Storage**: 10GB+ free space
- **Network**: Stable internet connection

### Software Dependencies

**Required:**

- Node.js 18.0+ and npm 8.0+
- Python 3.11+ and pip
- Git 2.30+

**Recommended:**

- Docker and Docker Compose
- PostgreSQL 13+ (for production)
- Redis 6.0+ (for caching, optional)

---

## 📋 Prerequisites

### 1. Install Node.js and npm

**Windows:**

```powershell
# Download from https://nodejs.org/
# Or using Chocolatey
choco install nodejs

# Verify installation
node --version
npm --version
```

**macOS:**

```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
# Verify installation
node --version
npm --version
```

**Linux (Ubuntu/Debian):**

```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install Python

**Windows:**

```powershell
# Download from https://python.org/
# Or using Chocolatey
choco install python

# Verify installation
python --version
pip --version
```

**macOS:**

```bash
# Using Homebrew
brew install python@3.11

# Verify installation
python3 --version
pip3 --version
```

**Linux (Ubuntu/Debian):**

```bash
# Install Python 3.11
sudo apt update
sudo apt install python3.11 python3.11-pip python3.11-venv

# Verify installation
python3.11 --version
pip3 --version
```

### 3. Install Git

**Windows:**

```powershell
# Download from https://git-scm.com/
# Or using Chocolatey
choco install git

# Verify installation
git --version
```

**macOS:**

```bash
# Usually pre-installed, or use Homebrew
brew install git

# Verify installation
git --version
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt install git

# Verify installation
git --version
```

---

## 🚀 Development Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/HepatoCAI.git
cd HepatoCAI

# Verify project structure
ls -la
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your configuration (see Environment Configuration section)

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Test the installation
python manage.py runserver
```

### Step 3: Frontend Setup

```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Step 4: Verify Installation

1. **Backend**: Visit `http://localhost:8000`
2. **Frontend**: Visit `http://localhost:5173`
3. **Admin**: Visit `http://localhost:8000/admin`

---

## 🏭 Production Installation

### Option 1: Manual Production Setup

#### 1. Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install system dependencies
sudo apt install -y python3.11 python3.11-pip python3.11-venv nginx postgresql redis-server

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Create application user
sudo useradd -m -s /bin/bash hepatocai
sudo su - hepatocai
```

#### 2. Application Setup

```bash
# Clone repository
git clone https://github.com/yourusername/HepatoCAI.git
cd HepatoCAI

# Backend setup
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# Frontend setup
cd ../frontend
npm install
npm run build
```

#### 3. Configure Environment

```bash
# Backend environment
cd backend
cp .env.example .env
nano .env  # Configure production settings
```

#### 4. Database Setup

```bash
# Configure PostgreSQL
sudo -u postgres createdb hepatocai
sudo -u postgres createuser --interactive hepatocai

# Run migrations
cd backend
source venv/bin/activate
python manage.py migrate
python manage.py collectstatic --noinput
```

#### 5. Web Server Configuration

**Nginx Configuration (`/etc/nginx/sites-available/hepatocai`):**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /home/hepatocai/HepatoCAI/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /static/ {
        alias /home/hepatocai/HepatoCAI/backend/staticfiles/;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/hepatocai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Service Configuration

**Systemd Service (`/etc/systemd/system/hepatocai.service`):**

```ini
[Unit]
Description=HepatoCAI Backend
After=network.target

[Service]
User=hepatocai
Group=hepatocai
WorkingDirectory=/home/hepatocai/HepatoCAI/backend
Environment=PATH=/home/hepatocai/HepatoCAI/backend/venv/bin
ExecStart=/home/hepatocai/HepatoCAI/backend/venv/bin/gunicorn --bind 127.0.0.1:8000 backend.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable hepatocai
sudo systemctl start hepatocai
```

### Option 2: Docker Installation

#### 1. Create Docker Files

**`Dockerfile.backend`:**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]
```

**`Dockerfile.frontend`:**

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

**`docker-compose.yml`:**

```yaml
version: "3.8"

services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: hepatocai
      POSTGRES_USER: hepatocai
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    environment:
      - DATABASE_URL=postgresql://hepatocai:your_password@db:5432/hepatocai
      - REDIS_URL=redis://redis:6379
      - DEBUG=False
    depends_on:
      - db
      - redis

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### 2. Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput
```

---

## 🔧 Environment Configuration

### Backend Environment Variables

Create `backend/.env`:

```bash
# Django Settings
DEBUG=False
SECRET_KEY=your-super-secure-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/hepatocai

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.com

# Google AI APIs
GOOGLE_API_KEY=your-google-gemini-api-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Security
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379

# Optional: Sentry for monitoring
SENTRY_DSN=your-sentry-dsn-url

# Site Configuration
SITE_ID=1
```

### Frontend Environment Variables

Create `frontend/.env.local` (development) or `frontend/.env.production`:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=10000

# Authentication
VITE_JWT_SECRET=your-jwt-secret
VITE_OAUTH_GOOGLE_CLIENT_ID=your-google-client-id
VITE_OAUTH_GITHUB_CLIENT_ID=your-github-client-id

# App Configuration
VITE_APP_NAME=HepatoCAI
VITE_APP_TITLE=HepatoCAI - AI-Powered Hepatitis C Detection
VITE_APP_DESCRIPTION=Advanced HCV stage detection powered by artificial intelligence
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_CONSOLE=true

# Development
VITE_DEBUG_MODE=true
```

---

## 🗄️ Database Setup

### PostgreSQL Installation and Setup

#### 1. Install PostgreSQL

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**

```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download and install from [PostgreSQL official site](https://www.postgresql.org/download/windows/).

#### 2. Create Database and User

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE hepatocai;
CREATE USER hepatocai WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE hepatocai TO hepatocai;

# Exit PostgreSQL
\q
```

#### 3. Configure Database Connection

Update `backend/.env`:

```bash
DATABASE_URL=postgresql://hepatocai:your_secure_password@localhost:5432/hepatocai
```

#### 4. Run Migrations

```bash
cd backend
source venv/bin/activate
python manage.py migrate
```

### SQLite Setup (Development Only)

For development, you can use SQLite:

```bash
# In backend/.env
DATABASE_URL=sqlite:///db.sqlite3

# Run migrations
python manage.py migrate
```

---

## 🔌 External Service Setup

### Google AI APIs Setup

#### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Generative AI API
   - Vertex AI API (for Imagen)

#### 2. Generate API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key
4. Restrict the key to your specific APIs

#### 3. Configure in Environment

Add to `backend/.env`:

```bash
GOOGLE_API_KEY=your-google-api-key-here
```

### OAuth Setup

#### Google OAuth

1. Go to [Google Developers Console](https://console.developers.google.com/)
2. Create OAuth 2.0 credentials
3. Add your domains to authorized origins
4. Copy Client ID

#### GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL
4. Copy Client ID and Secret

Add to environment files:

```bash
# Backend .env
GOOGLE_OAUTH_CLIENT_ID=your-google-client-id
GITHUB_OAUTH_CLIENT_ID=your-github-client-id
GITHUB_OAUTH_CLIENT_SECRET=your-github-client-secret

# Frontend .env.local
VITE_OAUTH_GOOGLE_CLIENT_ID=your-google-client-id
VITE_OAUTH_GITHUB_CLIENT_ID=your-github-client-id
```

---

## ✅ Verification

### Development Verification

1. **Backend Health Check:**

   ```bash
   curl http://localhost:8000/api/health/
   ```

2. **Frontend Access:**

   - Visit `http://localhost:5173`
   - Check all pages load correctly
   - Test AI Assistant functionality

3. **Admin Panel:**
   - Visit `http://localhost:8000/admin`
   - Login with superuser credentials
   - Verify admin functionality

### Production Verification

1. **SSL Certificate:**

   ```bash
   curl -I https://your-domain.com
   ```

2. **API Endpoints:**

   ```bash
   curl https://your-domain.com/api/health/
   ```

3. **Performance Test:**
   ```bash
   # Test response times
   curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com
   ```

---

## 🚨 Troubleshooting

### Common Installation Issues

#### Python Virtual Environment Issues

**Problem**: `venv` command not found

```bash
# Install python3-venv
sudo apt install python3-venv

# Or use virtualenv
pip install virtualenv
virtualenv venv
```

#### Node.js Installation Issues

**Problem**: Permission errors with npm

```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

#### Database Connection Issues

**Problem**: Database connection refused

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Check connection
psql -h localhost -U hepatocai -d hepatocai
```

#### Port Conflicts

**Problem**: Port already in use

```bash
# Find process using port
sudo lsof -i :8000
sudo lsof -i :5173

# Kill process
sudo kill -9 <PID>
```

### Environment Variable Issues

**Problem**: Environment variables not loading

```bash
# Check if file exists
ls -la .env

# Check file contents
cat .env

# Verify loading in Python
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('SECRET_KEY'))"
```

### Permission Issues

**Problem**: Permission denied errors

```bash
# Fix file permissions
chmod +x manage.py
chown -R $USER:$USER .

# For production
sudo chown -R hepatocai:hepatocai /home/hepatocai/HepatoCAI
```

### Getting Help

If you encounter issues not covered here:

1. **Check Logs:**

   ```bash
   # Django logs
   tail -f backend/debug.log

   # Nginx logs
   sudo tail -f /var/log/nginx/error.log

   # System logs
   journalctl -u hepatocai -f
   ```

2. **Contact Support:**

   - Email: support@hepatocai.com
   - Include system information and error logs
   - Specify development or production environment

3. **Community Resources:**
   - GitHub Issues
   - Documentation
   - Stack Overflow with `hepatocai` tag

---

**Last Updated**: January 13, 2025

**Version**: 1.0.0

This installation guide covers the most common installation scenarios. For specific environments or custom requirements, please consult the platform documentation or contact support.
