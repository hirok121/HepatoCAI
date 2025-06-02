"""
Comprehensive logging configuration for HepatoCAI application.
"""

import os
from pathlib import Path

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Ensure logs directory exists
LOGS_DIR = BASE_DIR / "logs"
LOGS_DIR.mkdir(exist_ok=True)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "[{levelname}] {asctime} {name} {process:d} {thread:d} {message}",
            "style": "{",
        },
        "standard": {
            "format": "[{levelname}] {asctime} {name}: {message}",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "standard",
        },
        "file": {
            "level": "INFO",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": LOGS_DIR / "django.log",
            "maxBytes": 1024 * 1024 * 5,  # 5 MB
            "backupCount": 5,
            "formatter": "verbose",
        },
        "error_file": {
            "level": "ERROR",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": LOGS_DIR / "django_error.log",
            "maxBytes": 1024 * 1024 * 5,  # 5 MB
            "backupCount": 5,
            "formatter": "verbose",
        },
        "security_file": {
            "level": "INFO",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": LOGS_DIR / "security.log",
            "maxBytes": 1024 * 1024 * 5,  # 5 MB
            "backupCount": 5,
            "formatter": "verbose",
        },
        "diagnosis_file": {
            "level": "INFO",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": LOGS_DIR / "diagnosis.log",
            "maxBytes": 1024 * 1024 * 5,  # 5 MB
            "backupCount": 5,
            "formatter": "verbose",
        },
        "users_file": {
            "level": "INFO",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": LOGS_DIR / "users.log",
            "maxBytes": 1024 * 1024 * 5,  # 5 MB
            "backupCount": 5,
            "formatter": "verbose",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["error_file"],
            "level": "ERROR",
            "propagate": False,
        },
        "django.security": {
            "handlers": ["security_file"],
            "level": "INFO",
            "propagate": False,
        },
        "users": {
            "handlers": ["users_file", "console"],
            "level": "INFO",
            "propagate": False,
        },
        "diagnosis": {
            "handlers": ["diagnosis_file", "console"],
            "level": "INFO",
            "propagate": False,
        },
        "utils.responses": {
            "handlers": ["error_file", "console"],
            "level": "INFO",
            "propagate": False,
        },
        "django.utils.autoreload": {
            "handlers": ["file"],  # Log to file only, not console
            "level": "WARNING",  # Suppress DEBUG messages from autoreloader
            "propagate": False,
        },
        # Root logger
        "root": {
            "handlers": ["console", "file"],
            "level": "INFO",
        },
    },
}

# Development vs Production logging
if os.getenv("DEBUG", "False").lower() == "true":
    # Development: More verbose logging
    LOGGING["loggers"]["django"]["level"] = "DEBUG"
    LOGGING["loggers"]["users"]["level"] = "DEBUG"
    LOGGING["loggers"]["diagnosis"]["level"] = "DEBUG"
    LOGGING["handlers"]["console"]["level"] = "DEBUG"
else:
    # Production: Less verbose, focus on errors
    LOGGING["loggers"]["django"]["level"] = "WARNING"
    LOGGING["handlers"]["console"]["level"] = "WARNING"
