import hashlib
import secrets

from django.core.cache import cache


OTP_LENGTH = 6
OTP_EXPIRY_SECONDS = 10 * 60
OTP_COOLDOWN_SECONDS = 60
OTP_MAX_ATTEMPTS = 5

OTP_CACHE_PREFIX = "email_verification_otp"


def _get_cache_key(user_id):
    return f"{OTP_CACHE_PREFIX}:{user_id}"


def _get_cooldown_key(user_id):
    return f"{_get_cache_key(user_id)}:cooldown"


def _hash_otp(otp):
    return hashlib.sha256(
        otp.encode("utf-8")
    ).hexdigest()


def generate_otp(user_id):
    """
    Generate a new email verification OTP.

    Returns:
        str: Plain OTP to send by email.

    Raises:
        ValueError: If cooldown is active.
    """

    if not can_request_new_otp(user_id):
        raise ValueError(
            "يمكنك طلب رمز جديد بعد قليل."
        )

    otp = "".join(
        str(secrets.randbelow(10))
        for _ in range(OTP_LENGTH)
    )

    cache.set(
        _get_cache_key(user_id),
        {
            "hash": _hash_otp(otp),
            "attempts": 0,
        },
        timeout=OTP_EXPIRY_SECONDS,
    )

    cache.set(
        _get_cooldown_key(user_id),
        True,
        timeout=OTP_COOLDOWN_SECONDS,
    )

    return otp


def verify_otp(user_id, otp):
    """
    Verify the OTP.

    Returns:
        tuple[bool, str]
    """

    cache_key = _get_cache_key(user_id)
    data = cache.get(cache_key)

    if not data:
        return (
            False,
            "رمز التأكيد منتهي الصلاحية أو غير موجود.",
        )

    if not isinstance(otp, str):
        return (
            False,
            "رمز التأكيد غير صالح.",
        )

    otp = otp.strip()

    if len(otp) != OTP_LENGTH or not otp.isdigit():
        return (
            False,
            "رمز التأكيد يجب أن يتكون من 6 أرقام.",
        )

    attempts = data.get("attempts", 0)

    if attempts >= OTP_MAX_ATTEMPTS:
        cache.delete(cache_key)

        return (
            False,
            "تم تجاوز عدد المحاولات المسموح بها. اطلب رمزًا جديدًا.",
        )

    provided_hash = _hash_otp(otp)

    if not secrets.compare_digest(
        data["hash"],
        provided_hash,
    ):
        data["attempts"] = attempts + 1

        cache.set(
            cache_key,
            data,
            timeout=OTP_EXPIRY_SECONDS,
        )

        remaining = (
            OTP_MAX_ATTEMPTS - data["attempts"]
        )

        return (
            False,
            f"رمز التأكيد غير صحيح. متبقي {remaining} محاولات.",
        )

    # OTP is single-use.
    cache.delete(cache_key)

    return (
        True,
        "تم تأكيد البريد الإلكتروني بنجاح.",
    )


def can_request_new_otp(user_id):
    return not cache.get(
        _get_cooldown_key(user_id)
    )


def clear_otp(user_id):
    cache.delete(
        _get_cache_key(user_id)
    )

    cache.delete(
        _get_cooldown_key(user_id)
    )