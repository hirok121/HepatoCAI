# Monitoring and Observability Enhancements

## 1. Application Metrics

### Custom Metrics Collection:

```python
# backend/utils/metrics.py
import time
from functools import wraps
from django.core.cache import cache
from django.conf import settings
import json
import logging

logger = logging.getLogger('metrics')

class MetricsCollector:
    """Collect application-specific metrics"""

    @staticmethod
    def record_diagnosis_metrics(duration, success, user_id=None):
        """Record diagnosis-specific metrics"""
        metrics_data = {
            'timestamp': time.time(),
            'duration': duration,
            'success': success,
            'user_id': user_id,
            'endpoint': 'diagnosis'
        }

        # Store in cache for aggregation
        cache_key = f"metrics:diagnosis:{int(time.time() // 60)}"  # Per minute
        cached_metrics = cache.get(cache_key, [])
        cached_metrics.append(metrics_data)
        cache.set(cache_key, cached_metrics, 3600)  # 1 hour TTL

        logger.info(f"Diagnosis metrics recorded: {json.dumps(metrics_data)}")

    @staticmethod
    def record_api_metrics(endpoint, method, status_code, duration):
        """Record general API metrics"""
        metrics_data = {
            'timestamp': time.time(),
            'endpoint': endpoint,
            'method': method,
            'status_code': status_code,
            'duration': duration
        }

        cache_key = f"metrics:api:{endpoint}:{int(time.time() // 60)}"
        cached_metrics = cache.get(cache_key, [])
        cached_metrics.append(metrics_data)
        cache.set(cache_key, cached_metrics, 3600)

        logger.info(f"API metrics recorded: {json.dumps(metrics_data)}")

def track_api_metrics(endpoint_name=None):
    """Decorator to track API endpoint metrics"""
    def decorator(func):
        @wraps(func)
        def wrapper(self, request, *args, **kwargs):
            start_time = time.time()
            endpoint = endpoint_name or func.__name__

            try:
                response = func(self, request, *args, **kwargs)
                duration = time.time() - start_time

                MetricsCollector.record_api_metrics(
                    endpoint=endpoint,
                    method=request.method,
                    status_code=response.status_code,
                    duration=duration
                )

                return response

            except Exception as e:
                duration = time.time() - start_time
                MetricsCollector.record_api_metrics(
                    endpoint=endpoint,
                    method=request.method,
                    status_code=500,
                    duration=duration
                )
                raise

        return wrapper
    return decorator
```

### Usage in Views:

```python
# backend/diagnosis/views.py
from utils.metrics import track_api_metrics, MetricsCollector

class DiagnoseAPIView(APIView):
    @track_api_metrics('hcv_diagnosis')
    def post(self, request):
        start_time = time.time()

        try:
            # existing implementation
            result = # ... diagnosis logic

            # Record specific diagnosis metrics
            duration = time.time() - start_time
            MetricsCollector.record_diagnosis_metrics(
                duration=duration,
                success=True,
                user_id=request.user.id if request.user.is_authenticated else None
            )

            return StandardResponse.success(data=result)

        except Exception as e:
            duration = time.time() - start_time
            MetricsCollector.record_diagnosis_metrics(
                duration=duration,
                success=False,
                user_id=request.user.id if request.user.is_authenticated else None
            )
            raise
```

## 2. Health Check Endpoints

### Create comprehensive health checks:

```python
# backend/health/views.py
from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache
from rest_framework.views import APIView
import time
import psutil
import os

class HealthCheckView(APIView):
    """Comprehensive health check endpoint"""

    def get(self, request):
        checks = {
            'database': self._check_database(),
            'cache': self._check_cache(),
            'disk_space': self._check_disk_space(),
            'memory': self._check_memory(),
            'ai_model': self._check_ai_model(),
        }

        # Overall health status
        overall_healthy = all(check['healthy'] for check in checks.values())

        return JsonResponse({
            'status': 'healthy' if overall_healthy else 'unhealthy',
            'timestamp': time.time(),
            'checks': checks
        }, status=200 if overall_healthy else 503)

    def _check_database(self):
        """Check database connectivity"""
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                return {'healthy': True, 'message': 'Database connection OK'}
        except Exception as e:
            return {'healthy': False, 'message': f'Database error: {str(e)}'}

    def _check_cache(self):
        """Check cache connectivity"""
        try:
            test_key = 'health_check_test'
            cache.set(test_key, 'test_value', 10)
            value = cache.get(test_key)
            cache.delete(test_key)

            if value == 'test_value':
                return {'healthy': True, 'message': 'Cache working OK'}
            else:
                return {'healthy': False, 'message': 'Cache not returning correct values'}
        except Exception as e:
            return {'healthy': False, 'message': f'Cache error: {str(e)}'}

    def _check_disk_space(self):
        """Check available disk space"""
        try:
            disk_usage = psutil.disk_usage('/')
            free_gb = disk_usage.free / (1024**3)

            if free_gb > 1:  # More than 1GB free
                return {'healthy': True, 'message': f'{free_gb:.2f}GB free space'}
            else:
                return {'healthy': False, 'message': f'Low disk space: {free_gb:.2f}GB'}
        except Exception as e:
            return {'healthy': False, 'message': f'Disk check error: {str(e)}'}

    def _check_memory(self):
        """Check memory usage"""
        try:
            memory = psutil.virtual_memory()
            if memory.percent < 90:
                return {'healthy': True, 'message': f'Memory usage: {memory.percent}%'}
            else:
                return {'healthy': False, 'message': f'High memory usage: {memory.percent}%'}
        except Exception as e:
            return {'healthy': False, 'message': f'Memory check error: {str(e)}'}

    def _check_ai_model(self):
        """Check AI model availability"""
        try:
            from diagnosis.AiDiagnosisTool.main import AiDiagnosisTool
            # Quick test with minimal data
            test_data = {
                'age': 45,
                'alp': 85.5,
                'ast': 32.0,
                'che': 7500,
                'crea': 1.2,
                'ggt': 28.5
            }
            result = AiDiagnosisTool(test_data)

            if result:
                return {'healthy': True, 'message': 'AI model responding OK'}
            else:
                return {'healthy': False, 'message': 'AI model not responding'}
        except Exception as e:
            return {'healthy': False, 'message': f'AI model error: {str(e)}'}

class MetricsView(APIView):
    """Expose application metrics"""

    def get(self, request):
        # Get metrics from cache
        current_minute = int(time.time() // 60)

        # Aggregate metrics from last 5 minutes
        metrics = {
            'diagnosis': [],
            'api': {}
        }

        for i in range(5):
            minute_key = current_minute - i

            # Diagnosis metrics
            diag_key = f"metrics:diagnosis:{minute_key}"
            diag_metrics = cache.get(diag_key, [])
            metrics['diagnosis'].extend(diag_metrics)

        # Calculate aggregated statistics
        if metrics['diagnosis']:
            successful_diagnoses = sum(1 for m in metrics['diagnosis'] if m['success'])
            total_diagnoses = len(metrics['diagnosis'])
            avg_duration = sum(m['duration'] for m in metrics['diagnosis']) / total_diagnoses

            metrics['diagnosis_summary'] = {
                'total': total_diagnoses,
                'successful': successful_diagnoses,
                'success_rate': successful_diagnoses / total_diagnoses,
                'avg_duration': avg_duration
            }

        return JsonResponse(metrics)
```

## 3. Logging Enhancements

### Structured Logging:

```python
# backend/utils/structured_logging.py
import json
import logging
from django.conf import settings

class StructuredFormatter(logging.Formatter):
    """Custom formatter for structured JSON logging"""

    def format(self, record):
        log_entry = {
            'timestamp': self.formatTime(record),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
        }

        # Add extra fields if present
        if hasattr(record, 'user_id'):
            log_entry['user_id'] = record.user_id
        if hasattr(record, 'request_id'):
            log_entry['request_id'] = record.request_id
        if hasattr(record, 'ip_address'):
            log_entry['ip_address'] = record.ip_address
        if hasattr(record, 'endpoint'):
            log_entry['endpoint'] = record.endpoint

        return json.dumps(log_entry)

# Usage in diagnosis views
logger = logging.getLogger('diagnosis')

class DiagnoseAPIView(APIView):
    def post(self, request):
        logger.info(
            "Diagnosis request received",
            extra={
                'user_id': request.user.id if request.user.is_authenticated else None,
                'ip_address': request.META.get('REMOTE_ADDR'),
                'endpoint': 'hcv_diagnosis'
            }
        )

        # ... existing implementation
```

## 4. Error Tracking

### Sentry Integration:

```python
# backend/settings.py
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.logging import LoggingIntegration

if not DEBUG:
    sentry_logging = LoggingIntegration(
        level=logging.INFO,
        event_level=logging.ERROR
    )

    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        integrations=[
            DjangoIntegration(
                transaction_style='url',
            ),
            sentry_logging,
        ],
        traces_sample_rate=0.1,
        send_default_pii=False,
        environment=os.getenv("ENVIRONMENT", "development"),
    )
```
