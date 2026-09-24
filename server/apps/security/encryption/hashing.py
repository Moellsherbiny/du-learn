import hashlib


def sha256(data: bytes) -> str:
    """
    Generate SHA-256 hash.
    """

    return hashlib.sha256(data).hexdigest()


def verify_sha256(
    data: bytes,
    expected_hash: str,
) -> bool:
    """
    Verify data integrity using SHA-256.
    """

    actual_hash = sha256(data)

    return actual_hash == expected_hash