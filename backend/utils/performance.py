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

                # Handle DRF Response objects by rendering them before caching
                if hasattr(result, "render"):
                    try:
                        # Render the response to ensure content is available for serialization
                        result.render()
                        cache.set(cache_key, result, timeout)
                        logger.info(f"Cached rendered result for {cache_key}")
                    except Exception as e:
                        logger.warning(
                            f"Failed to cache rendered response for {cache_key}: {e}"
                        )
                        # Don't cache if rendering fails, but still return the result
                else:
                    # For non-DRF responses, cache directly
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
            )  # Add performance headers to response
        response["X-Response-Time"] = f"{execution_time:.3f}s"
        response["X-Query-Count"] = str(query_count)
        return response
