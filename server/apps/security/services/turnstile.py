import requests

from django.conf import settings


TURNSTILE_VERIFY_URL = (
    "https://challenges.cloudflare.com/turnstile/v0/siteverify"
)


def verify_turnstile_token(
    token: str,
    remote_ip: str | None = None,
) -> bool:
    if not token:
        return False

    secret_key = getattr(
        settings,
        "TURNSTILE_SECRET_KEY",
        "",
    )

    if not secret_key:
        raise RuntimeError(
            "TURNSTILE_SECRET_KEY is not configured."
        )

    payload = {
        "secret": secret_key,
        "response": token,
    }

    if remote_ip:
        payload["remoteip"] = remote_ip

    try:
        response = requests.post(
            TURNSTILE_VERIFY_URL,
            data=payload,
            timeout=10,
        )

        response.raise_for_status()

        result = response.json()

        return bool(result.get("success"))

    except requests.RequestException:
        return False


def validate_turnstile_request(request, token:str, ) -> bool:

    if not token:
        return False

    return verify_turnstile_token(
        token=token,
        remote_ip=request.META.get("REMOTE_ADDR")
    )