from django.conf import settings
from allauth.account.adapter import DefaultAccountAdapter


class AccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(
        self,
        request,
        emailconfirmation,
    ):
        frontend_url = getattr(
            settings,
            "FRONTEND_URL",
            "http://localhost:3000",
        ).rstrip("/")

        return (
            f"{frontend_url}/verify-email/"
            f"{emailconfirmation.key}"
        )