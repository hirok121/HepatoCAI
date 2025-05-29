# HepatoCAI - Enhanced Security & Performance Documentation

## Overview

This documentation covers the enhanced security, performance, and error handling features implemented in the HepatoCAI application following community standards and best practices.

## Table of Contents

1. [Security Enhancements](#security-enhancements)
2. [Performance Optimizations](#performance-optimizations)
3. [Error Handling System](#error-handling-system)
4. [Logging Configuration](#logging-configuration)
5. [Environment Configuration](#environment-configuration)
6. [Frontend Performance](#frontend-performance)
7. [Testing](#testing)
8. [Deployment Considerations](#deployment-considerations)

## Security Enhancements

### Security Validators

The `SecurityValidator` class provides comprehensive input validation and sanitization:

```python
from utils.security import SecurityValidator

# Email validation
is_valid = SecurityValidator.validate_email_format("user@example.com")

# Input sanitization
clean_input = SecurityValidator.sanitize_input(user_input)

# XSS detection
has_xss = SecurityValidator.detect_xss(user_input)

# SQL injection detection
has_sql_injection = SecurityValidator.detect_sql_injection(user_input)

# Comprehensive data validation
is_safe = SecurityValidator.validate_input_data(request.data)
```

### Rate Limiting

Multiple rate limiting strategies are available:

```python
from utils.security import RateLimitManager
from utils.performance import RateLimiter

# Class-based rate limiting
@RateLimiter.rate_limit_view(limit=5, window=300)  # 5 requests per 5 minutes
def login_view(request):
    pass

# Manual rate limiting
is_limited = RateLimitManager.is_rate_limited("user_123", limit=10, window=3600)
```

### Security Headers

Automatic security headers are added via middleware:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy: ...`
- `Strict-Transport-Security: ...` (HTTPS only)

### Audit Logging

Security events are automatically logged:

```python
from utils.security import AuditLogger

# Log authentication events
AuditLogger.log_authentication_event('successful_login', user=user, ip_address=ip)

# Log suspicious activities
AuditLogger.log_suspicious_activity('invalid_input', ip_address=ip, details={...})
```

### Security Middleware

The `SecurityMiddleware` performs automatic security checks:

- Validates request headers
- Detects suspicious user agents
- Logs security events
- Adds security headers to responses

## Performance Optimizations

### Database Query Monitoring

Monitor and optimize database queries:

```python
from utils.performance import PerformanceMonitor

@PerformanceMonitor.monitor_db_queries
def my_view(request):
    # Automatically logs query count and execution time
    return queryset
```

### Caching

Implement result caching:

```python
@PerformanceMonitor.cache_result("user_list", timeout=300)
def get_users():
    return User.objects.all()
```

### Query Optimization

Use the `DatabaseOptimizer` for better querysets:

```python
from utils.performance import DatabaseOptimizer

# Optimize queryset with select_related and prefetch_related
optimized_queryset = DatabaseOptimizer.optimize_queryset(
    User.objects.all(),
    select_related=['profile'],
    prefetch_related=['groups']
)
```

### Performance Middleware

The `PerformanceMiddleware` automatically:

- Monitors request execution time
- Counts database queries
- Logs slow requests
- Adds performance headers

### API Response Optimization

```python
from utils.performance import APIResponseOptimizer

# Paginate large datasets
paginated_data = APIResponseOptimizer.paginate_queryset(queryset, request)

# Compress responses
compressed_response = APIResponseOptimizer.compress_response(response)
```

## Error Handling System

### Standardized Responses

All API responses use the `StandardResponse` utility:

```python
from utils.responses import StandardResponse

# Success response
return StandardResponse.success(
    data={"user": user_data},
    message="User retrieved successfully"
)

# Error response
return StandardResponse.error(
    message="Invalid input",
    status_code=400
)

# Validation error
return StandardResponse.validation_error(
    errors=serializer.errors,
    message="Validation failed"
)

# Not found
return StandardResponse.not_found(
    message="User not found",
    resource_type="user"
)
```

### Exception Handling Decorator

The `@handle_exceptions` decorator automatically handles exceptions:

```python
from utils.responses import handle_exceptions

@handle_exceptions
def my_view(request):
    # Any unhandled exception will be caught and formatted
    return StandardResponse.success(data=data)
```

### Response Format

All responses follow this consistent format:

```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": {...},
    "timestamp": "2024-01-15T10:30:00Z",
    "errors": null
}
```

## Logging Configuration

### Log Files

The application generates separate log files:

- `django.log` - General application logs
- `django_error.log` - Error logs only
- `users.log` - User authentication and management
- `diagnosis.log` - Diagnosis-related operations
- `security.log` - Security events and audit trails
- `performance.log` - Performance metrics

### Log Rotation

All log files use rotating handlers:

- Maximum size: 5MB per file
- Backup count: 5 files
- Automatic compression of old files

### Log Levels

Configure log levels via environment variables:

```bash
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL
```

### Component-Specific Logging

Enable/disable logging for specific components:

```bash
LOG_USERS=True
LOG_DIAGNOSIS=True
LOG_SECURITY=True
LOG_PERFORMANCE=True
```

## Environment Configuration

### Security Settings

```bash
# Rate limiting
RATE_LIMIT_ENABLED=True
LOGIN_RATE_LIMIT="5/5m"
REGISTRATION_RATE_LIMIT="3/10m"

# Security headers
SECURE_SSL_REDIRECT=False
SECURE_HSTS_SECONDS=31536000
X_FRAME_OPTIONS="DENY"

# Security monitoring
SECURITY_AUDIT_ENABLED=True
SUSPICIOUS_ACTIVITY_THRESHOLD=5
```

### Performance Settings

```bash
# Cache configuration
CACHE_TIMEOUT=300
CACHE_KEY_PREFIX="hepatocai"

# Performance monitoring
PERFORMANCE_MONITORING=True
SLOW_QUERY_THRESHOLD=2.0
HIGH_QUERY_COUNT_THRESHOLD=10

# Database optimization
DB_CONN_MAX_AGE=0
```

### Application Features

```bash
# AI Features
AI_ASSISTANT_ENABLED=True
AI_MODEL_TIMEOUT=30
AI_MAX_REQUESTS_PER_USER=50

# File uploads
MAX_UPLOAD_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES="jpg,jpeg,png,pdf,doc,docx"

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
```

## Frontend Performance

### Lazy Loading

Components are lazy-loaded using React.lazy():

```jsx
import { LazyComponents } from "./config/performance";

// Usage in routes
<Route path="/diagnosis" element={<LazyComponents.Diagnosis />} />;
```

### Performance Monitoring

Client-side performance monitoring:

```javascript
import { PerformanceMonitor } from "./config/performance";

// Initialize monitoring
PerformanceMonitor.init();

// Track custom metrics
PerformanceMonitor.trackMetric("component_render", duration);
```

### API Optimization

```javascript
import { APIOptimizer } from "./config/performance";

// Cached API calls
const userData = await APIOptimizer.cachedRequest("/api/users/me");

// Optimized requests with retry
const result = await APIOptimizer.optimizedRequest("/api/diagnosis", {
  retry: 3,
  timeout: 5000,
});
```

## Testing

### Running Tests

```bash
# Run all tests
python manage.py test

# Run specific test module
python manage.py test tests.test_security_performance

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

### Test Categories

1. **Security Tests**: Input validation, XSS/SQL injection detection
2. **Performance Tests**: Caching, query optimization, rate limiting
3. **Response Tests**: Standardized response format, error handling
4. **Middleware Tests**: Security and performance middleware functionality

### Example Test

```python
class SecurityValidatorTests(TestCase):
    def test_xss_detection(self):
        malicious_input = "<script>alert('xss')</script>"
        self.assertTrue(SecurityValidator.detect_xss(malicious_input))

        safe_input = "normal text"
        self.assertFalse(SecurityValidator.detect_xss(safe_input))
```

## Deployment Considerations

### Production Settings

1. **Enable HTTPS**:

   ```bash
   SECURE_SSL_REDIRECT=True
   CSRF_COOKIE_SECURE=True
   SESSION_COOKIE_SECURE=True
   ```

2. **Database Optimization**:

   ```bash
   DB_CONN_MAX_AGE=600  # 10 minutes
   ```

3. **Cache Backend**:

   ```bash
   # Use Redis in production
   REDIS_URL="redis://localhost:6379/0"
   ```

4. **Log Level**:
   ```bash
   LOG_LEVEL=WARNING  # Reduce log verbosity
   ```

### Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] Input validation implemented
- [ ] Audit logging enabled
- [ ] CSRF protection active
- [ ] XSS protection enabled

### Performance Checklist

- [ ] Database queries optimized
- [ ] Caching implemented
- [ ] Static files compressed
- [ ] Frontend assets minified
- [ ] Lazy loading configured
- [ ] Performance monitoring active

## API Rate Limits

| Endpoint     | Rate Limit   | Window     |
| ------------ | ------------ | ---------- |
| Login        | 5 requests   | 5 minutes  |
| Registration | 3 requests   | 10 minutes |
| Email Check  | 10 requests  | 5 minutes  |
| Diagnosis    | 50 requests  | 1 hour     |
| General API  | 100 requests | 1 hour     |

## Monitoring and Alerts

### Performance Metrics

- Response time > 2 seconds
- Database queries > 10 per request
- Cache hit ratio < 80%
- Error rate > 5%

### Security Alerts

- Failed login attempts > 5 per IP
- Suspicious input patterns detected
- Rate limit violations
- Unauthorized access attempts

## Support and Maintenance

### Log Analysis

1. **Check Error Logs**:

   ```bash
   tail -f logs/django_error.log
   ```

2. **Monitor Performance**:

   ```bash
   grep "SLOW" logs/performance.log
   ```

3. **Security Audit**:
   ```bash
   grep "SUSPICIOUS" logs/security.log
   ```

### Regular Maintenance

- Review security logs weekly
- Monitor performance metrics daily
- Update dependencies monthly
- Run security audits quarterly

## Troubleshooting

### Common Issues

1. **High Database Query Count**:

   - Review and optimize querysets
   - Add `select_related()` and `prefetch_related()`
   - Implement proper caching

2. **Rate Limit Errors**:

   - Check rate limit configuration
   - Verify cache backend is working
   - Adjust limits for legitimate use cases

3. **Security Alerts**:
   - Investigate suspicious activities
   - Update security rules if needed
   - Block malicious IPs if necessary

### Debug Mode

Enable debug features for development:

```bash
DEBUG=True
DEV_BYPASS_EMAIL_VERIFICATION=True
DEV_SHOW_DEBUG_TOOLBAR=True
```

---

_This documentation is automatically updated with each release. For the latest information, check the project repository._
