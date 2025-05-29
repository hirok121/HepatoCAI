# Production Deployment and Infrastructure Improvements

## 1. Container Deployment

### Docker Configuration

**Create `backend/Dockerfile`:**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python manage.py check --deploy || exit 1

# Start command
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "backend.wsgi:application"]
```

**Create `frontend/Dockerfile`:**

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Create `docker-compose.yml`:**

```yaml
version: "3.8"

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: hepatocai
      POSTGRES_USER: hepatocai
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hepatocai"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    environment:
      - DEBUG=False
      - DB_HOST=db
      - REDIS_URL=redis://redis:6379/0
    volumes:
      - ./backend/logs:/app/logs
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

## 2. Production Settings

### Environment-Specific Settings

**Create `backend/backend/settings/production.py`:**

```python
from .base import *
import os

DEBUG = False

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# Security settings for production
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

# Session security
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'

# CSRF security
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'
CSRF_TRUSTED_ORIGINS = os.getenv('CSRF_TRUSTED_ORIGINS', '').split(',')

# Database with connection pooling
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT', '5432'),
        'CONN_MAX_AGE': 60,
        'OPTIONS': {
            'MAX_CONNS': 20,
        }
    }
}

# Redis for caching and sessions
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.getenv('REDIS_URL'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

# Use Redis for sessions
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'

# Static files (use CDN in production)
STATIC_URL = os.getenv('STATIC_URL', '/static/')
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files (use cloud storage in production)
MEDIA_URL = os.getenv('MEDIA_URL', '/media/')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Email configuration for production
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')

# Logging for production
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'json': {
            'format': '{"level": "%(levelname)s", "time": "%(asctime)s", "module": "%(module)s", "message": "%(message)s"}',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/app/logs/production.log',
            'maxBytes': 1024*1024*15,  # 15MB
            'backupCount': 10,
            'formatter': 'json',
        },
        'error_file': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/app/logs/error.log',
            'maxBytes': 1024*1024*15,
            'backupCount': 10,
            'formatter': 'json',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'error_file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

## 3. Load Balancing and Scaling

### Nginx Configuration

**Create `frontend/nginx.conf`:**

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    upstream backend {
        server backend:8000;
        # Add more backend servers for load balancing
        # server backend-2:8000;
        # server backend-3:8000;
    }

    server {
        listen 80;
        server_name _;

        # Frontend static files
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;

            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # API proxy
        location /api/ {
            limit_req zone=api burst=20 nodelay;

            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Special rate limiting for login endpoints
        location /api/v1/accounts/token/ {
            limit_req zone=login burst=5 nodelay;

            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## 4. Database Optimization

### Database Migrations and Indexing

**Create `backend/diagnosis/migrations/0002_add_indexes.py`:**

```python
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('diagnosis', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hcvpatient_created_at ON diagnosis_hcvpatient(created_at);",
            reverse_sql="DROP INDEX IF EXISTS idx_hcvpatient_created_at;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hcvpatient_user_id ON diagnosis_hcvpatient(user_id);",
            reverse_sql="DROP INDEX IF EXISTS idx_hcvpatient_user_id;"
        ),
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hcvpatient_status ON diagnosis_hcvpatient(status);",
            reverse_sql="DROP INDEX IF EXISTS idx_hcvpatient_status;"
        ),
    ]
```

### Database Connection Pooling

**Add to requirements.txt:**

```
psycopg2-binary
django-redis
pgbouncer  # for connection pooling
```

## 5. Monitoring and Alerting

### Health Check Endpoints

**Create `backend/utils/health.py`:**

```python
from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache
from django.conf import settings
import time
import psutil
import os

def health_check(request):
    """Comprehensive health check endpoint"""
    health_data = {
        'status': 'healthy',
        'timestamp': time.time(),
        'checks': {}
    }

    # Database check
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        health_data['checks']['database'] = 'healthy'
    except Exception as e:
        health_data['checks']['database'] = f'unhealthy: {str(e)}'
        health_data['status'] = 'unhealthy'

    # Cache check
    try:
        cache.set('health_check', 'test', 30)
        cache.get('health_check')
        health_data['checks']['cache'] = 'healthy'
    except Exception as e:
        health_data['checks']['cache'] = f'unhealthy: {str(e)}'
        health_data['status'] = 'unhealthy'

    # System resources
    try:
        health_data['checks']['memory_usage'] = f"{psutil.virtual_memory().percent}%"
        health_data['checks']['cpu_usage'] = f"{psutil.cpu_percent(interval=1)}%"
        health_data['checks']['disk_usage'] = f"{psutil.disk_usage('/').percent}%"
    except Exception as e:
        health_data['checks']['system'] = f'error: {str(e)}'

    # Log file sizes (prevent disk space issues)
    try:
        log_dir = os.path.join(settings.BASE_DIR, 'logs')
        if os.path.exists(log_dir):
            total_log_size = sum(
                os.path.getsize(os.path.join(log_dir, f))
                for f in os.listdir(log_dir)
                if os.path.isfile(os.path.join(log_dir, f))
            )
            health_data['checks']['log_size_mb'] = round(total_log_size / (1024 * 1024), 2)
    except Exception:
        pass

    status_code = 200 if health_data['status'] == 'healthy' else 503
    return JsonResponse(health_data, status=status_code)

def readiness_check(request):
    """Kubernetes readiness probe"""
    try:
        # Check if migrations are up to date
        from django.core.management import execute_from_command_line
        from io import StringIO
        import sys

        old_stdout = sys.stdout
        sys.stdout = buffer = StringIO()

        try:
            execute_from_command_line(['manage.py', 'migrate', '--check'])
            ready = True
        except SystemExit as e:
            ready = e.code == 0
        finally:
            sys.stdout = old_stdout

        if ready:
            return JsonResponse({'status': 'ready'})
        else:
            return JsonResponse({'status': 'not ready'}, status=503)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=503)
```

## 6. Security Enhancements

### Rate Limiting with Redis

**Create `backend/utils/advanced_rate_limiting.py`:**

```python
import redis
import time
import json
from django.conf import settings
from functools import wraps

redis_client = redis.from_url(settings.CACHES['default']['LOCATION'])

class AdvancedRateLimiter:
    """Redis-based rate limiter with sliding window"""

    @staticmethod
    def sliding_window_rate_limit(key, limit, window, identifier=None):
        """
        Sliding window rate limiter
        """
        now = time.time()
        pipeline = redis_client.pipeline()

        # Remove old entries
        pipeline.zremrangebyscore(key, 0, now - window)

        # Count current entries
        pipeline.zcard(key)

        # Add current request
        pipeline.zadd(key, {f"{identifier or now}": now})

        # Set expiry
        pipeline.expire(key, int(window))

        results = pipeline.execute()
        current_requests = results[1]

        return current_requests < limit

def advanced_rate_limit(limit, window, key_func=None):
    """
    Advanced rate limiting decorator
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if key_func:
                key = key_func(request)
            else:
                key = f"rate_limit:{request.META.get('REMOTE_ADDR')}:{view_func.__name__}"

            if not AdvancedRateLimiter.sliding_window_rate_limit(
                key, limit, window, request.META.get('HTTP_X_REQUEST_ID')
            ):
                return JsonResponse(
                    {'error': 'Rate limit exceeded'},
                    status=429
                )

            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
```

## 7. Deployment Scripts

### Automated Deployment

**Create `scripts/deploy.sh`:**

```bash
#!/bin/bash
set -e

echo "Starting deployment..."

# Build and tag images
docker-compose build

# Run database migrations
docker-compose run --rm backend python manage.py migrate

# Collect static files
docker-compose run --rm backend python manage.py collectstatic --noinput

# Run tests
docker-compose run --rm backend python manage.py test

# Deploy with zero downtime
docker-compose up -d --remove-orphans

echo "Deployment completed successfully!"
```

**Create `scripts/backup.sh`:**

```bash
#!/bin/bash
set -e

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
docker-compose exec -T db pg_dump -U hepatocai hepatocai > "${BACKUP_DIR}/db_backup_${DATE}.sql"

# Media files backup
tar -czf "${BACKUP_DIR}/media_backup_${DATE}.tar.gz" -C /app/media .

# Keep only last 30 days of backups
find "${BACKUP_DIR}" -name "*.sql" -mtime +30 -delete
find "${BACKUP_DIR}" -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: ${DATE}"
```

## 8. Performance Optimization

### Database Query Optimization

**Create `backend/utils/query_optimization.py`:**

```python
from django.db import models
from django.core.cache import cache
from functools import wraps

def cached_method(timeout=300):
    """Cache model method results"""
    def decorator(method):
        @wraps(method)
        def wrapper(self, *args, **kwargs):
            cache_key = f"{self.__class__.__name__}:{self.pk}:{method.__name__}:{hash(str(args) + str(kwargs))}"
            result = cache.get(cache_key)
            if result is None:
                result = method(self, *args, **kwargs)
                cache.set(cache_key, result, timeout)
            return result
        return wrapper
    return decorator

class OptimizedQueryMixin:
    """Mixin for optimized database queries"""

    @classmethod
    def get_with_related(cls, **filters):
        """Get objects with all related data in single query"""
        return cls.objects.select_related().prefetch_related().filter(**filters)

    @classmethod
    def bulk_create_optimized(cls, objects, batch_size=1000):
        """Optimized bulk creation"""
        return cls.objects.bulk_create(objects, batch_size=batch_size)
```

This production deployment guide provides comprehensive infrastructure setup, security hardening, monitoring, and performance optimization for deploying HepatoCAI in a production environment.
