from django.conf import settings
from django.core import signing


VERIFICATION_SALT = "dulearn.email.verification"
VERIFICATION_EXPIRE_DAYS = 3


def generate_email_verification_key(user):
    return signing.dumps(
        {
            "user_id": str(user.pk),
            "email": user.email,
        },
        key=settings.SECRET_KEY,
        salt=VERIFICATION_SALT,
    )


def verify_email_key(key):
    try:
        payload = signing.loads(
            key,
            key=settings.SECRET_KEY,
            salt=VERIFICATION_SALT,
            max_age=VERIFICATION_EXPIRE_DAYS * 86400,
        )

    except signing.SignatureExpired:
        return {
            "success": False,
            "reason": "expired",
        }

    except signing.BadSignature:
        return {
            "success": False,
            "reason": "invalid",
        }

    return {
        "success": True,
        "payload": payload,
    }