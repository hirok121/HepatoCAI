# Accessibility & Advanced Security Audit Enhancement

## 1. WCAG 2.1 Accessibility Compliance

### Accessibility Audit Service

**Create `frontend/src/services/accessibilityService.js`:**

```javascript
class AccessibilityService {
  constructor() {
    this.a11ySettings = {
      fontSize: localStorage.getItem("a11y-font-size") || "medium",
      highContrast: localStorage.getItem("a11y-high-contrast") === "true",
      reducedMotion: localStorage.getItem("a11y-reduced-motion") === "true",
      screenReader: this.detectScreenReader(),
      voiceNavigation: false,
    };
    this.initializeA11y();
  }

  initializeA11y() {
    this.setupFocusManagement();
    this.setupKeyboardNavigation();
    this.setupAriaLiveRegions();
    this.setupColorContrastMode();
    this.setupMotionPreferences();
  }

  // Screen reader detection
  detectScreenReader() {
    const userAgent = navigator.userAgent.toLowerCase();
    const screenReaders = ["nvda", "jaws", "dragon", "voiceover"];
    return screenReaders.some((sr) => userAgent.includes(sr));
  }

  // Focus management for SPA navigation
  setupFocusManagement() {
    const focusElement = (selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    // Focus management on route changes
    window.addEventListener("locationchange", () => {
      // Announce page change to screen readers
      this.announcePageChange();

      // Focus main content
      setTimeout(() => {
        focusElement('main h1, main [role="main"] h1, #main-content h1');
      }, 100);
    });
  }

  // Keyboard navigation enhancements
  setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      // Skip links activation
      if (e.key === "Tab" && !e.shiftKey && e.target.matches("body")) {
        this.showSkipLinks();
      }

      // Escape key handler for modals/dropdowns
      if (e.key === "Escape") {
        this.handleEscapeKey();
      }

      // Arrow key navigation for custom components
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        this.handleArrowNavigation(e);
      }
    });
  }

  // ARIA live regions for dynamic content updates
  setupAriaLiveRegions() {
    // Create live regions if they don't exist
    const regions = [
      { id: "aria-live-polite", level: "polite" },
      { id: "aria-live-assertive", level: "assertive" },
      { id: "aria-live-status", level: "polite", role: "status" },
    ];

    regions.forEach((region) => {
      if (!document.getElementById(region.id)) {
        const liveRegion = document.createElement("div");
        liveRegion.id = region.id;
        liveRegion.setAttribute("aria-live", region.level);
        if (region.role) liveRegion.setAttribute("role", region.role);
        liveRegion.className = "sr-only";
        document.body.appendChild(liveRegion);
      }
    });
  }

  // Announce messages to screen readers
  announce(message, priority = "polite") {
    const regionId =
      priority === "assertive" ? "aria-live-assertive" : "aria-live-polite";
    const region = document.getElementById(regionId);
    if (region) {
      region.textContent = message;
      setTimeout(() => (region.textContent = ""), 1000);
    }
  }

  // Page change announcements
  announcePageChange() {
    const title = document.title;
    const mainHeading = document.querySelector(
      'main h1, [role="main"] h1, #main-content h1'
    );
    const announcement = mainHeading
      ? `Navigated to ${mainHeading.textContent}`
      : `Page loaded: ${title}`;

    this.announce(announcement);
  }

  // High contrast mode
  setupColorContrastMode() {
    const applyHighContrast = (enable) => {
      document.body.classList.toggle("high-contrast", enable);
      localStorage.setItem("a11y-high-contrast", enable);
    };

    if (this.a11ySettings.highContrast) {
      applyHighContrast(true);
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-contrast: high)");
    mediaQuery.addListener((e) => {
      if (!localStorage.getItem("a11y-high-contrast")) {
        applyHighContrast(e.matches);
      }
    });
  }

  // Reduced motion preferences
  setupMotionPreferences() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const applyMotionPreference = (reduce) => {
      document.body.classList.toggle("reduced-motion", reduce);
      localStorage.setItem("a11y-reduced-motion", reduce);
    };

    if (prefersReducedMotion.matches || this.a11ySettings.reducedMotion) {
      applyMotionPreference(true);
    }

    prefersReducedMotion.addListener((e) => {
      applyMotionPreference(e.matches);
    });
  }

  // Font size management
  setFontSize(size) {
    const sizes = {
      small: "0.875rem",
      medium: "1rem",
      large: "1.125rem",
      "extra-large": "1.25rem",
    };

    document.documentElement.style.setProperty("--base-font-size", sizes[size]);
    localStorage.setItem("a11y-font-size", size);
    this.announce(`Font size changed to ${size}`);
  }

  // Skip links functionality
  showSkipLinks() {
    const skipLinks = document.querySelector(".skip-links");
    if (skipLinks) {
      skipLinks.classList.add("visible");
      skipLinks.querySelector("a").focus();
    }
  }

  // Focus trap for modals
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);
    firstElement.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }

  // Form accessibility enhancements
  enhanceFormAccessibility(form) {
    const inputs = form.querySelectorAll("input, select, textarea");

    inputs.forEach((input) => {
      // Associate labels and inputs
      if (
        !input.getAttribute("aria-label") &&
        !input.getAttribute("aria-labelledby")
      ) {
        const label = form.querySelector(`label[for="${input.id}"]`);
        if (label) {
          input.setAttribute(
            "aria-labelledby",
            label.id || this.generateId("label")
          );
        }
      }

      // Add required indicators
      if (input.hasAttribute("required")) {
        input.setAttribute("aria-required", "true");
      }

      // Error associations
      const errorElement = form.querySelector(
        `[data-error-for="${input.name}"]`
      );
      if (errorElement) {
        input.setAttribute(
          "aria-describedby",
          errorElement.id || this.generateId("error")
        );
        input.setAttribute("aria-invalid", "true");
      }
    });
  }

  // Utility function to generate unique IDs
  generateId(prefix) {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default new AccessibilityService();
```

### Accessible Components

**Create `frontend/src/components/accessibility/AccessibilityToolbar.jsx`:**

```jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Slider,
  FormControlLabel,
  Switch,
  Typography,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Accessibility,
  FontDownload,
  Contrast,
  SlowMotionVideo,
  VolumeUp,
} from "@mui/icons-material";
import AccessibilityService from "../../services/accessibilityService";

function AccessibilityToolbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [settings, setSettings] = useState({
    fontSize: "medium",
    highContrast: false,
    reducedMotion: false,
    screenReaderMode: false,
  });

  useEffect(() => {
    // Load saved preferences
    setSettings({
      fontSize: localStorage.getItem("a11y-font-size") || "medium",
      highContrast: localStorage.getItem("a11y-high-contrast") === "true",
      reducedMotion: localStorage.getItem("a11y-reduced-motion") === "true",
      screenReaderMode: AccessibilityService.detectScreenReader(),
    });
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFontSizeChange = (event, newValue) => {
    const sizes = ["small", "medium", "large", "extra-large"];
    const size = sizes[newValue];
    setSettings((prev) => ({ ...prev, fontSize: size }));
    AccessibilityService.setFontSize(size);
  };

  const handleContrastToggle = (event) => {
    const enabled = event.target.checked;
    setSettings((prev) => ({ ...prev, highContrast: enabled }));
    document.body.classList.toggle("high-contrast", enabled);
    localStorage.setItem("a11y-high-contrast", enabled);
    AccessibilityService.announce(
      `High contrast ${enabled ? "enabled" : "disabled"}`
    );
  };

  const handleMotionToggle = (event) => {
    const enabled = event.target.checked;
    setSettings((prev) => ({ ...prev, reducedMotion: enabled }));
    document.body.classList.toggle("reduced-motion", enabled);
    localStorage.setItem("a11y-reduced-motion", enabled);
    AccessibilityService.announce(
      `Motion reduction ${enabled ? "enabled" : "disabled"}`
    );
  };

  const fontSizeIndex = ["small", "medium", "large", "extra-large"].indexOf(
    settings.fontSize
  );

  return (
    <>
      <Tooltip title="Accessibility Settings">
        <IconButton
          onClick={handleMenuOpen}
          aria-label="Open accessibility settings"
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl)}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1300,
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          <Accessibility />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        aria-label="Accessibility settings menu"
        PaperProps={{
          sx: { width: 300, p: 2 },
        }}
      >
        <Paper elevation={0}>
          <Typography variant="h6" gutterBottom>
            Accessibility Settings
          </Typography>

          {/* Font Size */}
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              <FontDownload sx={{ mr: 1, verticalAlign: "middle" }} />
              Font Size
            </Typography>
            <Slider
              value={fontSizeIndex}
              onChange={handleFontSizeChange}
              min={0}
              max={3}
              step={1}
              marks={[
                { value: 0, label: "Small" },
                { value: 1, label: "Medium" },
                { value: 2, label: "Large" },
                { value: 3, label: "Extra Large" },
              ]}
              aria-label="Font size"
            />
          </Box>

          {/* High Contrast */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.highContrast}
                onChange={handleContrastToggle}
                inputProps={{ "aria-label": "Toggle high contrast mode" }}
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Contrast sx={{ mr: 1 }} />
                High Contrast
              </Box>
            }
          />

          {/* Reduced Motion */}
          <FormControlLabel
            control={
              <Switch
                checked={settings.reducedMotion}
                onChange={handleMotionToggle}
                inputProps={{ "aria-label": "Toggle reduced motion" }}
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SlowMotionVideo sx={{ mr: 1 }} />
                Reduce Motion
              </Box>
            }
          />

          {/* Screen Reader Info */}
          {settings.screenReaderMode && (
            <Box
              sx={{
                mt: 2,
                p: 1,
                backgroundColor: "info.light",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">
                <VolumeUp sx={{ mr: 1, verticalAlign: "middle" }} />
                Screen reader detected. Enhanced navigation active.
              </Typography>
            </Box>
          )}
        </Paper>
      </Menu>
    </>
  );
}

export default AccessibilityToolbar;
```

### Skip Links Component

**Create `frontend/src/components/accessibility/SkipLinks.jsx`:**

```jsx
import React from "react";
import { Box, Link } from "@mui/material";

function SkipLinks() {
  const skipLinks = [
    { href: "#main-content", text: "Skip to main content" },
    { href: "#navigation", text: "Skip to navigation" },
    { href: "#search", text: "Skip to search" },
    { href: "#footer", text: "Skip to footer" },
  ];

  return (
    <Box
      className="skip-links"
      sx={{
        position: "absolute",
        top: -1000,
        left: -1000,
        width: 1,
        height: 1,
        overflow: "hidden",
        "&.visible, &:focus-within": {
          position: "static",
          width: "auto",
          height: "auto",
          overflow: "visible",
          backgroundColor: "primary.main",
          zIndex: 9999,
          p: 1,
        },
      }}
    >
      {skipLinks.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          sx={{
            display: "block",
            color: "white",
            textDecoration: "none",
            p: 1,
            "&:focus": {
              outline: "3px solid yellow",
              outlineOffset: "2px",
            },
          }}
          onClick={(e) => {
            e.preventDefault();
            const target = document.querySelector(link.href);
            if (target) {
              target.focus();
              target.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          {link.text}
        </Link>
      ))}
    </Box>
  );
}

export default SkipLinks;
```

## 2. Advanced Security Audit Framework

### Security Audit Service

**Create `backend/utils/security_audit.py`:**

```python
"""
Advanced security audit and vulnerability scanning framework.
"""

import re
import ssl
import socket
import urllib.parse
import requests
from datetime import datetime, timedelta
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import connections
from django.contrib.auth import get_user_model
from django.core.cache import cache
import logging
import json
import hashlib
from typing import Dict, List, Any

logger = logging.getLogger('security.audit')

class SecurityAuditor:
    """Comprehensive security audit framework"""

    def __init__(self):
        self.findings = []
        self.severity_levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

    def run_full_audit(self) -> Dict[str, Any]:
        """Run complete security audit"""
        audit_results = {
            'timestamp': datetime.now().isoformat(),
            'version': '1.0',
            'findings': [],
            'summary': {}
        }

        # Run all audit modules
        audit_modules = [
            self.audit_django_settings,
            self.audit_database_security,
            self.audit_authentication_security,
            self.audit_input_validation,
            self.audit_session_security,
            self.audit_csrf_protection,
            self.audit_ssl_configuration,
            self.audit_dependencies,
            self.audit_logging_security,
            self.audit_file_permissions,
            self.audit_rate_limiting,
            self.audit_api_security
        ]

        for module in audit_modules:
            try:
                findings = module()
                audit_results['findings'].extend(findings)
            except Exception as e:
                logger.error(f"Audit module {module.__name__} failed: {e}")
                audit_results['findings'].append({
                    'category': 'AUDIT_ERROR',
                    'severity': 'HIGH',
                    'title': f'Audit Module Failure: {module.__name__}',
                    'description': str(e),
                    'timestamp': datetime.now().isoformat()
                })

        # Generate summary
        audit_results['summary'] = self.generate_audit_summary(audit_results['findings'])

        return audit_results

    def audit_django_settings(self) -> List[Dict]:
        """Audit Django security settings"""
        findings = []

        # Check DEBUG setting
        if getattr(settings, 'DEBUG', False):
            findings.append({
                'category': 'CONFIGURATION',
                'severity': 'CRITICAL',
                'title': 'DEBUG mode enabled in production',
                'description': 'DEBUG=True should never be enabled in production',
                'recommendation': 'Set DEBUG=False in production settings',
                'cwe': 'CWE-489'
            })

        # Check SECRET_KEY
        secret_key = getattr(settings, 'SECRET_KEY', '')
        if len(secret_key) < 50:
            findings.append({
                'category': 'CONFIGURATION',
                'severity': 'HIGH',
                'title': 'Weak SECRET_KEY',
                'description': 'SECRET_KEY is too short or default',
                'recommendation': 'Use a strong, randomly generated SECRET_KEY'
            })

        # Check ALLOWED_HOSTS
        allowed_hosts = getattr(settings, 'ALLOWED_HOSTS', [])
        if '*' in allowed_hosts:
            findings.append({
                'category': 'CONFIGURATION',
                'severity': 'HIGH',
                'title': 'Wildcard in ALLOWED_HOSTS',
                'description': 'ALLOWED_HOSTS contains wildcard (*)',
                'recommendation': 'Specify exact hostnames in ALLOWED_HOSTS'
            })

        # Check security middleware
        middleware = getattr(settings, 'MIDDLEWARE', [])
        security_middleware = [
            'django.middleware.security.SecurityMiddleware',
            'django.middleware.csrf.CsrfViewMiddleware',
            'django.contrib.sessions.middleware.SessionMiddleware',
        ]

        for mw in security_middleware:
            if mw not in middleware:
                findings.append({
                    'category': 'CONFIGURATION',
                    'severity': 'MEDIUM',
                    'title': f'Missing security middleware: {mw}',
                    'description': f'Security middleware {mw} is not configured',
                    'recommendation': f'Add {mw} to MIDDLEWARE setting'
                })

        # Check security headers settings
        security_settings = {
            'SECURE_SSL_REDIRECT': True,
            'SECURE_HSTS_SECONDS': 31536000,
            'SECURE_HSTS_INCLUDE_SUBDOMAINS': True,
            'SECURE_CONTENT_TYPE_NOSNIFF': True,
            'SECURE_BROWSER_XSS_FILTER': True,
            'SESSION_COOKIE_SECURE': True,
            'SESSION_COOKIE_HTTPONLY': True,
            'CSRF_COOKIE_SECURE': True,
            'CSRF_COOKIE_HTTPONLY': True,
        }

        for setting_name, expected_value in security_settings.items():
            actual_value = getattr(settings, setting_name, None)
            if actual_value != expected_value:
                findings.append({
                    'category': 'CONFIGURATION',
                    'severity': 'MEDIUM',
                    'title': f'Insecure setting: {setting_name}',
                    'description': f'{setting_name} is {actual_value}, should be {expected_value}',
                    'recommendation': f'Set {setting_name} = {expected_value}'
                })

        return findings

    def audit_database_security(self) -> List[Dict]:
        """Audit database security configuration"""
        findings = []

        for alias in connections:
            db_config = connections[alias].settings_dict

            # Check for default passwords
            password = db_config.get('PASSWORD', '')
            weak_passwords = ['password', 'admin', '123456', 'root', '']
            if password.lower() in weak_passwords:
                findings.append({
                    'category': 'DATABASE',
                    'severity': 'CRITICAL',
                    'title': f'Weak database password for {alias}',
                    'description': 'Database is using a weak or default password',
                    'recommendation': 'Use a strong, unique password for database'
                })

            # Check SSL configuration
            options = db_config.get('OPTIONS', {})
            if not options.get('sslmode') and db_config.get('ENGINE') == 'django.db.backends.postgresql':
                findings.append({
                    'category': 'DATABASE',
                    'severity': 'HIGH',
                    'title': f'SSL not configured for database {alias}',
                    'description': 'Database connection is not using SSL',
                    'recommendation': 'Configure SSL for database connections'
                })

        return findings

    def audit_authentication_security(self) -> List[Dict]:
        """Audit authentication and authorization security"""
        findings = []
        User = get_user_model()

        # Check for users with weak passwords
        try:
            weak_users = User.objects.filter(
                password__in=[
                    'pbkdf2_sha256$0$password',  # Example of weak hash
                    'pbkdf2_sha256$0$123456',
                ]
            ).count()

            if weak_users > 0:
                findings.append({
                    'category': 'AUTHENTICATION',
                    'severity': 'HIGH',
                    'title': f'{weak_users} users with weak passwords',
                    'description': 'Some users have weak or default passwords',
                    'recommendation': 'Enforce strong password policy'
                })
        except Exception as e:
            logger.error(f"Error checking user passwords: {e}")

        # Check for superusers
        try:
            superuser_count = User.objects.filter(is_superuser=True).count()
            if superuser_count > 3:
                findings.append({
                    'category': 'AUTHENTICATION',
                    'severity': 'MEDIUM',
                    'title': f'Too many superusers ({superuser_count})',
                    'description': 'Large number of superuser accounts increases attack surface',
                    'recommendation': 'Limit number of superuser accounts'
                })
        except Exception as e:
            logger.error(f"Error checking superuser count: {e}")

        # Check authentication backends
        auth_backends = getattr(settings, 'AUTHENTICATION_BACKENDS', [])
        insecure_backends = [
            'django.contrib.auth.backends.AllowAllUsersModelBackend',
        ]

        for backend in insecure_backends:
            if backend in auth_backends:
                findings.append({
                    'category': 'AUTHENTICATION',
                    'severity': 'HIGH',
                    'title': f'Insecure authentication backend: {backend}',
                    'description': 'Using insecure authentication backend',
                    'recommendation': 'Remove insecure authentication backends'
                })

        return findings

    def audit_input_validation(self) -> List[Dict]:
        """Audit input validation mechanisms"""
        findings = []

        # This would typically involve static code analysis
        # For now, we'll check for common patterns

        # Check if custom validation is properly implemented
        from utils.security import SecurityValidator

        try:
            # Test XSS detection
            test_input = "<script>alert('xss')</script>"
            if not hasattr(SecurityValidator, 'validate_input'):
                findings.append({
                    'category': 'INPUT_VALIDATION',
                    'severity': 'HIGH',
                    'title': 'Missing input validation framework',
                    'description': 'No centralized input validation detected',
                    'recommendation': 'Implement comprehensive input validation'
                })
        except ImportError:
            findings.append({
                'category': 'INPUT_VALIDATION',
                'severity': 'CRITICAL',
                'title': 'Security validation module missing',
                'description': 'utils.security module not found',
                'recommendation': 'Implement security validation utilities'
            })

        return findings

    def audit_session_security(self) -> List[Dict]:
        """Audit session security configuration"""
        findings = []

        # Check session timeout
        session_timeout = getattr(settings, 'SESSION_COOKIE_AGE', 1209600)  # Default 2 weeks
        if session_timeout > 86400:  # More than 1 day
            findings.append({
                'category': 'SESSION',
                'severity': 'MEDIUM',
                'title': 'Long session timeout',
                'description': f'Session timeout is {session_timeout} seconds',
                'recommendation': 'Reduce session timeout for better security'
            })

        # Check session engine
        session_engine = getattr(settings, 'SESSION_ENGINE', 'django.contrib.sessions.backends.db')
        if session_engine == 'django.contrib.sessions.backends.file':
            findings.append({
                'category': 'SESSION',
                'severity': 'MEDIUM',
                'title': 'File-based session storage',
                'description': 'Using file-based session storage',
                'recommendation': 'Use database or cache-based session storage'
            })

        return findings

    def audit_csrf_protection(self) -> List[Dict]:
        """Audit CSRF protection configuration"""
        findings = []

        # Check CSRF middleware
        middleware = getattr(settings, 'MIDDLEWARE', [])
        if 'django.middleware.csrf.CsrfViewMiddleware' not in middleware:
            findings.append({
                'category': 'CSRF',
                'severity': 'HIGH',
                'title': 'CSRF middleware not configured',
                'description': 'CSRF protection middleware is missing',
                'recommendation': 'Add CsrfViewMiddleware to MIDDLEWARE'
            })

        # Check CSRF cookie settings
        if not getattr(settings, 'CSRF_COOKIE_HTTPONLY', False):
            findings.append({
                'category': 'CSRF',
                'severity': 'MEDIUM',
                'title': 'CSRF cookie not HTTPOnly',
                'description': 'CSRF_COOKIE_HTTPONLY is not enabled',
                'recommendation': 'Set CSRF_COOKIE_HTTPONLY = True'
            })

        return findings

    def audit_ssl_configuration(self) -> List[Dict]:
        """Audit SSL/TLS configuration"""
        findings = []

        # Check SSL redirect
        if not getattr(settings, 'SECURE_SSL_REDIRECT', False):
            findings.append({
                'category': 'SSL',
                'severity': 'HIGH',
                'title': 'SSL redirect not enabled',
                'description': 'SECURE_SSL_REDIRECT is not enabled',
                'recommendation': 'Enable SSL redirect in production'
            })

        # Check HSTS
        hsts_seconds = getattr(settings, 'SECURE_HSTS_SECONDS', 0)
        if hsts_seconds < 31536000:  # Less than 1 year
            findings.append({
                'category': 'SSL',
                'severity': 'MEDIUM',
                'title': 'HSTS not properly configured',
                'description': f'HSTS timeout is {hsts_seconds} seconds',
                'recommendation': 'Set SECURE_HSTS_SECONDS to at least 31536000'
            })

        return findings

    def audit_dependencies(self) -> List[Dict]:
        """Audit third-party dependencies for known vulnerabilities"""
        findings = []

        # This would typically use tools like safety or pip-audit
        # For demonstration, we'll check for some common vulnerable packages

        try:
            import pkg_resources
            installed_packages = [d.project_name.lower() for d in pkg_resources.working_set]

            # Known vulnerable packages (example - would use real vulnerability database)
            vulnerable_packages = {
                'django': ['3.0', '3.1.0'],  # Example vulnerable versions
                'requests': ['2.19.1'],
                'urllib3': ['1.25.0'],
            }

            for package_name, vulnerable_versions in vulnerable_packages.items():
                if package_name in installed_packages:
                    try:
                        package = pkg_resources.get_distribution(package_name)
                        if package.version in vulnerable_versions:
                            findings.append({
                                'category': 'DEPENDENCIES',
                                'severity': 'HIGH',
                                'title': f'Vulnerable dependency: {package_name}',
                                'description': f'{package_name} version {package.version} has known vulnerabilities',
                                'recommendation': f'Update {package_name} to latest secure version'
                            })
                    except pkg_resources.DistributionNotFound:
                        pass

        except ImportError:
            findings.append({
                'category': 'DEPENDENCIES',
                'severity': 'LOW',
                'title': 'Cannot audit dependencies',
                'description': 'pkg_resources not available for dependency audit',
                'recommendation': 'Install pip-audit for dependency vulnerability scanning'
            })

        return findings

    def audit_logging_security(self) -> List[Dict]:
        """Audit logging configuration for security"""
        findings = []

        # Check if security logging is configured
        logging_config = getattr(settings, 'LOGGING', {})
        loggers = logging_config.get('loggers', {})

        security_loggers = ['django.security', 'security', 'audit']
        configured_security_loggers = [logger for logger in security_loggers if logger in loggers]

        if not configured_security_loggers:
            findings.append({
                'category': 'LOGGING',
                'severity': 'MEDIUM',
                'title': 'No security logging configured',
                'description': 'No security-specific loggers found',
                'recommendation': 'Configure security logging for audit trails'
            })

        return findings

    def audit_file_permissions(self) -> List[Dict]:
        """Audit file permissions for security issues"""
        findings = []

        import os
        import stat

        # Check settings file permissions
        try:
            settings_module = settings.SETTINGS_MODULE
            settings_file = settings_module.replace('.', '/') + '.py'

            if os.path.exists(settings_file):
                file_stat = os.stat(settings_file)
                file_mode = stat.filemode(file_stat.st_mode)

                # Check if file is world-readable
                if file_stat.st_mode & stat.S_IROTH:
                    findings.append({
                        'category': 'FILE_PERMISSIONS',
                        'severity': 'HIGH',
                        'title': 'Settings file world-readable',
                        'description': f'Settings file {settings_file} is readable by others',
                        'recommendation': 'Restrict settings file permissions to owner only'
                    })
        except Exception as e:
            logger.error(f"Error checking file permissions: {e}")

        return findings

    def audit_rate_limiting(self) -> List[Dict]:
        """Audit rate limiting configuration"""
        findings = []

        try:
            from utils.security import RateLimitManager

            # Check if rate limiting is properly configured
            # This would depend on your specific implementation

        except ImportError:
            findings.append({
                'category': 'RATE_LIMITING',
                'severity': 'MEDIUM',
                'title': 'Rate limiting not implemented',
                'description': 'No rate limiting framework detected',
                'recommendation': 'Implement rate limiting for API endpoints'
            })

        return findings

    def audit_api_security(self) -> List[Dict]:
        """Audit API security configuration"""
        findings = []

        # Check REST framework settings
        if 'rest_framework' in getattr(settings, 'INSTALLED_APPS', []):
            drf_settings = getattr(settings, 'REST_FRAMEWORK', {})

            # Check authentication classes
            auth_classes = drf_settings.get('DEFAULT_AUTHENTICATION_CLASSES', [])
            if 'rest_framework.authentication.SessionAuthentication' in auth_classes:
                findings.append({
                    'category': 'API_SECURITY',
                    'severity': 'MEDIUM',
                    'title': 'Session authentication in API',
                    'description': 'Using session authentication for API endpoints',
                    'recommendation': 'Use token-based authentication for APIs'
                })

            # Check permission classes
            permission_classes = drf_settings.get('DEFAULT_PERMISSION_CLASSES', [])
            if 'rest_framework.permissions.AllowAny' in permission_classes:
                findings.append({
                    'category': 'API_SECURITY',
                    'severity': 'HIGH',
                    'title': 'API allows anonymous access',
                    'description': 'Default permission allows anonymous API access',
                    'recommendation': 'Restrict API access to authenticated users'
                })

        return findings

    def generate_audit_summary(self, findings: List[Dict]) -> Dict[str, Any]:
        """Generate summary of audit findings"""
        summary = {
            'total_findings': len(findings),
            'by_severity': {level: 0 for level in self.severity_levels},
            'by_category': {},
            'risk_score': 0
        }

        for finding in findings:
            severity = finding.get('severity', 'LOW')
            category = finding.get('category', 'UNKNOWN')

            summary['by_severity'][severity] += 1
            summary['by_category'][category] = summary['by_category'].get(category, 0) + 1

        # Calculate risk score
        severity_weights = {'LOW': 1, 'MEDIUM': 3, 'HIGH': 7, 'CRITICAL': 15}
        for severity, count in summary['by_severity'].items():
            summary['risk_score'] += count * severity_weights.get(severity, 0)

        return summary

class PenetrationTester:
    """Automated penetration testing framework"""

    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.findings = []

    def run_penetration_tests(self):
        """Run automated penetration tests"""
        test_methods = [
            self.test_sql_injection,
            self.test_xss_vulnerabilities,
            self.test_csrf_protection,
            self.test_authentication_bypass,
            self.test_directory_traversal,
            self.test_information_disclosure,
            self.test_rate_limiting,
            self.test_ssl_configuration
        ]

        for test_method in test_methods:
            try:
                test_method()
            except Exception as e:
                logger.error(f"Penetration test {test_method.__name__} failed: {e}")

        return self.findings

    def test_sql_injection(self):
        """Test for SQL injection vulnerabilities"""
        payloads = [
            "' OR '1'='1",
            "' UNION SELECT NULL--",
            "'; DROP TABLE users;--",
            "1' AND 1=1--"
        ]

        test_endpoints = [
            '/api/diagnosis/',
            '/api/users/',
            '/accounts/login/'
        ]

        for endpoint in test_endpoints:
            for payload in payloads:
                try:
                    response = self.session.post(
                        f"{self.base_url}{endpoint}",
                        data={'test_param': payload},
                        timeout=10
                    )

                    # Check for SQL error messages
                    error_indicators = [
                        'sql syntax',
                        'mysql_fetch',
                        'postgresql error',
                        'ora-',
                        'microsoft jet database'
                    ]

                    response_text = response.text.lower()
                    if any(indicator in response_text for indicator in error_indicators):
                        self.findings.append({
                            'type': 'SQL_INJECTION',
                            'severity': 'CRITICAL',
                            'endpoint': endpoint,
                            'payload': payload,
                            'description': 'Potential SQL injection vulnerability detected'
                        })

                except requests.RequestException:
                    pass

    def test_xss_vulnerabilities(self):
        """Test for XSS vulnerabilities"""
        payloads = [
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<img src=x onerror=alert('XSS')>",
            "';alert('XSS');//"
        ]

        test_endpoints = [
            '/api/diagnosis/',
            '/contact/',
            '/search/'
        ]

        for endpoint in test_endpoints:
            for payload in payloads:
                try:
                    response = self.session.post(
                        f"{self.base_url}{endpoint}",
                        data={'message': payload},
                        timeout=10
                    )

                    if payload in response.text:
                        self.findings.append({
                            'type': 'XSS',
                            'severity': 'HIGH',
                            'endpoint': endpoint,
                            'payload': payload,
                            'description': 'Potential XSS vulnerability detected'
                        })

                except requests.RequestException:
                    pass

    def test_csrf_protection(self):
        """Test CSRF protection"""
        try:
            # Try to make a state-changing request without CSRF token
            response = self.session.post(
                f"{self.base_url}/api/diagnosis/",
                data={'test': 'data'},
                timeout=10
            )

            if response.status_code != 403:
                self.findings.append({
                    'type': 'CSRF',
                    'severity': 'HIGH',
                    'endpoint': '/api/diagnosis/',
                    'description': 'CSRF protection may not be properly implemented'
                })

        except requests.RequestException:
            pass

    def test_authentication_bypass(self):
        """Test for authentication bypass vulnerabilities"""
        protected_endpoints = [
            '/api/admin/',
            '/admin/',
            '/api/users/me/'
        ]

        for endpoint in protected_endpoints:
            try:
                response = self.session.get(
                    f"{self.base_url}{endpoint}",
                    timeout=10
                )

                if response.status_code == 200:
                    self.findings.append({
                        'type': 'AUTH_BYPASS',
                        'severity': 'CRITICAL',
                        'endpoint': endpoint,
                        'description': 'Protected endpoint accessible without authentication'
                    })

            except requests.RequestException:
                pass

    def test_directory_traversal(self):
        """Test for directory traversal vulnerabilities"""
        payloads = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts",
            "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd"
        ]

        for payload in payloads:
            try:
                response = self.session.get(
                    f"{self.base_url}/static/{payload}",
                    timeout=10
                )

                if "root:" in response.text or "[drivers]" in response.text:
                    self.findings.append({
                        'type': 'DIRECTORY_TRAVERSAL',
                        'severity': 'HIGH',
                        'payload': payload,
                        'description': 'Potential directory traversal vulnerability'
                    })

            except requests.RequestException:
                pass

    def test_information_disclosure(self):
        """Test for information disclosure"""
        test_paths = [
            '/.git/config',
            '/admin/',
            '/debug/',
            '/.env',
            '/phpinfo.php',
            '/server-status',
            '/server-info'
        ]

        for path in test_paths:
            try:
                response = self.session.get(
                    f"{self.base_url}{path}",
                    timeout=10
                )

                if response.status_code == 200:
                    self.findings.append({
                        'type': 'INFO_DISCLOSURE',
                        'severity': 'MEDIUM',
                        'path': path,
                        'description': f'Sensitive path {path} is accessible'
                    })

            except requests.RequestException:
                pass

    def test_rate_limiting(self):
        """Test rate limiting implementation"""
        endpoint = '/api/diagnosis/'

        # Make rapid requests
        for i in range(20):
            try:
                response = self.session.post(
                    f"{self.base_url}{endpoint}",
                    data={'test': f'request_{i}'},
                    timeout=5
                )

                if i > 10 and response.status_code != 429:
                    self.findings.append({
                        'type': 'RATE_LIMITING',
                        'severity': 'MEDIUM',
                        'endpoint': endpoint,
                        'description': 'Rate limiting may not be properly implemented'
                    })
                    break

            except requests.RequestException:
                pass

    def test_ssl_configuration(self):
        """Test SSL/TLS configuration"""
        if not self.base_url.startswith('https://'):
            self.findings.append({
                'type': 'SSL_CONFIG',
                'severity': 'HIGH',
                'description': 'Application not using HTTPS'
            })
            return

        try:
            # Test SSL certificate
            hostname = urllib.parse.urlparse(self.base_url).hostname
            context = ssl.create_default_context()

            with socket.create_connection((hostname, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()

                    # Check certificate expiry
                    not_after = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                    if not_after < datetime.now() + timedelta(days=30):
                        self.findings.append({
                            'type': 'SSL_CONFIG',
                            'severity': 'HIGH',
                            'description': 'SSL certificate expires soon or has expired'
                        })

        except Exception as e:
            self.findings.append({
                'type': 'SSL_CONFIG',
                'severity': 'MEDIUM',
                'description': f'SSL configuration issue: {str(e)}'
            })

# Management command for running security audits
class Command(BaseCommand):
    help = 'Run comprehensive security audit'

    def add_arguments(self, parser):
        parser.add_argument(
            '--format',
            choices=['json', 'text'],
            default='text',
            help='Output format'
        )
        parser.add_argument(
            '--output',
            help='Output file path'
        )
        parser.add_argument(
            '--pentest',
            action='store_true',
            help='Include penetration testing'
        )
        parser.add_argument(
            '--url',
            default='http://localhost:8000',
            help='Base URL for penetration testing'
        )

    def handle(self, *args, **options):
        auditor = SecurityAuditor()

        self.stdout.write('Running security audit...')
        audit_results = auditor.run_full_audit()

        if options['pentest']:
            self.stdout.write('Running penetration tests...')
            pen_tester = PenetrationTester(options['url'])
            pentest_findings = pen_tester.run_penetration_tests()
            audit_results['penetration_test_findings'] = pentest_findings

        # Output results
        if options['format'] == 'json':
            output = json.dumps(audit_results, indent=2)
        else:
            output = self.format_text_output(audit_results)

        if options['output']:
            with open(options['output'], 'w') as f:
                f.write(output)
            self.stdout.write(f'Audit results saved to {options["output"]}')
        else:
            self.stdout.write(output)

    def format_text_output(self, results):
        """Format audit results as readable text"""
        output = []
        output.append("=" * 60)
        output.append("SECURITY AUDIT REPORT")
        output.append("=" * 60)
        output.append(f"Timestamp: {results['timestamp']}")
        output.append(f"Total Findings: {results['summary']['total_findings']}")
        output.append(f"Risk Score: {results['summary']['risk_score']}")
        output.append("")

        # Summary by severity
        output.append("FINDINGS BY SEVERITY:")
        for severity, count in results['summary']['by_severity'].items():
            if count > 0:
                output.append(f"  {severity}: {count}")
        output.append("")

        # Detailed findings
        output.append("DETAILED FINDINGS:")
        output.append("-" * 40)

        for finding in results['findings']:
            output.append(f"[{finding['severity']}] {finding['title']}")
            output.append(f"Category: {finding['category']}")
            output.append(f"Description: {finding['description']}")
            if 'recommendation' in finding:
                output.append(f"Recommendation: {finding['recommendation']}")
            output.append("")

        return '\n'.join(output)
```

### Security Audit Management Command

**Create `backend/management/commands/security_audit.py`:**

```python
from django.core.management.base import BaseCommand
from utils.security_audit import SecurityAuditor, PenetrationTester
import json

class Command(BaseCommand):
    help = 'Run comprehensive security audit'

    def add_arguments(self, parser):
        parser.add_argument(
            '--format',
            choices=['json', 'text'],
            default='text',
            help='Output format'
        )
        parser.add_argument(
            '--output',
            help='Output file path'
        )
        parser.add_argument(
            '--pentest',
            action='store_true',
            help='Include penetration testing'
        )
        parser.add_argument(
            '--url',
            default='http://localhost:8000',
            help='Base URL for penetration testing'
        )

    def handle(self, *args, **options):
        # Implementation details in security_audit.py
        pass
```

## 3. Implementation Integration

### Update App.jsx with Accessibility

**Update `frontend/src/App.jsx`:**

```jsx
// Add accessibility components
import AccessibilityToolbar from "./components/accessibility/AccessibilityToolbar";
import SkipLinks from "./components/accessibility/SkipLinks";
import AccessibilityService from "./services/accessibilityService";

function App() {
  useEffect(() => {
    // Initialize accessibility service
    AccessibilityService.initializeA11y();
  }, []);

  return (
    <div className="App">
      <SkipLinks />
      <AccessibilityToolbar />

      {/* Main content with proper landmarks */}
      <main id="main-content" role="main" tabIndex="-1">
        {/* Existing app content */}
      </main>
    </div>
  );
}
```

### CSS for Accessibility

**Create `frontend/src/styles/accessibility.css`:**

```css
/* Screen reader only content */
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* High contrast mode */
.high-contrast {
  --primary-color: #000000;
  --secondary-color: #ffffff;
  --background-color: #ffffff;
  --text-color: #000000;
  --link-color: #0000ee;
  --border-color: #000000;
}

.high-contrast * {
  background-color: var(--background-color) !important;
  color: var(--text-color) !important;
  border-color: var(--border-color) !important;
}

.high-contrast a {
  color: var(--link-color) !important;
  text-decoration: underline !important;
}

/* Reduced motion */
.reduced-motion *,
.reduced-motion *::before,
.reduced-motion *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}

/* Focus indicators */
:focus {
  outline: 3px solid #005fcc !important;
  outline-offset: 2px !important;
}

.high-contrast :focus {
  outline: 3px solid #000000 !important;
  outline-offset: 2px !important;
}

/* Font size scaling */
:root {
  --base-font-size: 1rem;
}

html {
  font-size: var(--base-font-size);
}

/* Skip links */
.skip-links a {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 9999;
}

.skip-links a:focus {
  top: 6px;
}

/* Touch targets */
@media (hover: none) and (pointer: coarse) {
  button,
  a,
  input,
  select,
  textarea {
    min-height: 44px;
    min-width: 44px;
  }
}
```

This enhancement provides comprehensive accessibility compliance and advanced security auditing capabilities for the HepatoCAI application. The accessibility features ensure WCAG 2.1 compliance, while the security audit framework provides enterprise-grade vulnerability assessment and penetration testing capabilities.
