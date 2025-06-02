from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "users"

    def ready(self):
        """
        Import signal handlers when the app is ready.
        This ensures signals are connected properly.
        """
        import users.signals  # noqa
