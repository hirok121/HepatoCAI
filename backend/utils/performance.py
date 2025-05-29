"""
Performance optimization utilities for HepatoCAI application.
"""

from django.core.cache import cache
from django.db import connection
from django.conf import settings
from functools import wraps
import time
import logging

logger = logging.getLogger(__name__)


class PerformanceMonitor:
    """Monitor and log performance metrics"""

    @staticmethod
    def monitor_db_queries(view_func):
        """Decorator to monitor database queries in views"""

        @wraps(view_func)
        def wrapper(*args, **kwargs):
            # Reset queries count
            initial_queries = len(connection.queries)
            start_time = time.time()

            # Execute the view
            response = view_func(*args, **kwargs)

            # Calculate metrics
            end_time = time.time()
            final_queries = len(connection.queries)
            query_count = final_queries - initial_queries
            execution_time = end_time - start_time

            # Log performance metrics
            if query_count > 10:  # Threshold for too many queries
                logger.warning(
                    f"High DB query count in {view_func.__name__}: "
                    f"{query_count} queries in {execution_time:.2f}s"
                )
            elif execution_time > 2.0:  # Threshold for slow response
                logger.warning(
                    f"Slow response in {view_func.__name__}: "
                    f"{execution_time:.2f}s with {query_count} queries"
                )
            else:
                logger.info(
                    f"Performance - {view_func.__name__}: "
                    f"{execution_time:.2f}s, {query_count} queries"
                )

            return response

        return wrapper

    @staticmethod
    def cache_result(key_prefix, timeout=300):
        """Decorator to cache view results"""

        def decorator(view_func):
            @wraps(view_func)
            def wrapper(request, *args, **kwargs):
                # Generate cache key based on view name and parameters
                cache_key = (
                    f"{key_prefix}:{view_func.__name__}:{hash(str(args) + str(kwargs))}"
                )

                # Try to get from cache first
                cached_result = cache.get(cache_key)
                if cached_result is not None:
                    logger.info(f"Cache hit for {cache_key}")
                    return cached_result

                # Execute view and cache result
                result = view_func(request, *args, **kwargs)
                cache.set(cache_key, result, timeout)
                logger.info(f"Cached result for {cache_key}")

                return result

            return wrapper

        return decorator


class DatabaseOptimizer:
    """Database query optimization utilities"""

    @staticmethod
    def optimize_queryset(queryset, select_related=None, prefetch_related=None):
        """Optimize queryset with select_related and prefetch_related"""
        if select_related:
            queryset = queryset.select_related(*select_related)
        if prefetch_related:
            queryset = queryset.prefetch_related(*prefetch_related)
        return queryset

    @staticmethod
    def log_slow_queries():
        """Log slow database queries"""
        if settings.DEBUG:
            for query in connection.queries:
                query_time = float(query["time"])
                if query_time > 0.1:  # Log queries taking more than 100ms
                    logger.warning(
                        f"Slow query ({query_time:.3f}s): {query['sql'][:200]}..."
                    )


class APIResponseOptimizer:
    """Optimize API responses for better performance"""

    @staticmethod
    def paginate_response(queryset, page_size=20):
        """Add pagination to large querysets"""
        from django.core.paginator import Paginator

        paginator = Paginator(queryset, page_size)
        return paginator

    @staticmethod
    def compress_response(response):
        """Add response compression headers"""
        if hasattr(response, "headers"):
            response.headers["Content-Encoding"] = "gzip"
        return response


# Performance middleware
class PerformanceMiddleware:
    """Middleware to monitor overall request performance"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        initial_queries = len(connection.queries)

        response = self.get_response(request)

        end_time = time.time()
        final_queries = len(connection.queries)

        # Log performance metrics
        execution_time = end_time - start_time
        query_count = final_queries - initial_queries

        if execution_time > 1.0 or query_count > 5:
            logger.warning(
                f"Request performance - {request.path}: "
                f"{execution_time:.2f}s, {query_count} queries"
            )

        # Add performance headers to response
        response["X-Response-Time"] = f"{execution_time:.3f}s"
        response["X-Query-Count"] = str(query_count)

        return response


# Rate limiting utilities
class RateLimiter:
    """Simple rate limiting using Django cache"""

    @staticmethod
    def is_rate_limited(identifier, limit=100, window=3600):
        """Check if identifier is rate limited"""
        cache_key = f"rate_limit:{identifier}"
        current_count = cache.get(cache_key, 0)

        if current_count >= limit:
            return True  # Increment counter
        cache.set(cache_key, current_count + 1, window)
        return False

    @staticmethod
    def rate_limit_view(limit=100, window=3600):
        """Decorator to add rate limiting to views and ViewSet methods"""

        def decorator(view_func):
            @wraps(view_func)
            def wrapper(*args, **kwargs):
                # Handle both function-based views and ViewSet methods
                if len(args) > 0:
                    # For ViewSet methods: args[0] is self, args[1] is request
                    # For function-based views: args[0] is request
                    request = (
                        args[1]
                        if hasattr(args[0], "__class__") and hasattr(args[0], "request")
                        else args[0]
                    )
                    if not hasattr(request, "META"):
                        # If args[0] is a ViewSet instance, request is args[1]
                        request = args[1] if len(args) > 1 else None

                if request and hasattr(request, "META"):
                    # Use IP address as identifier
                    identifier = request.META.get("REMOTE_ADDR", "unknown")

                    if RateLimiter.is_rate_limited(identifier, limit, window):
                        from rest_framework.response import Response
                        from rest_framework import status

                        return Response(
                            {"error": "Rate limit exceeded"},
                            status=status.HTTP_429_TOO_MANY_REQUESTS,
                        )

                return view_func(*args, **kwargs)

            return wrapper

        return decorator
