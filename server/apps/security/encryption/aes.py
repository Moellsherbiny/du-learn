import base64
import os

from cryptography.hazmat.primitives.ciphers.aead import AESGCM


KEY_SIZE = 32
NONCE_SIZE = 12


def generate_aes_key() -> bytes:
    """
    Generate a 256-bit AES key.
    """
    return AESGCM.generate_key(bit_length=256)


def encrypt_aes(
    data: bytes,
    key: bytes,
) -> dict[str, str]:
    """
    Encrypt data using AES-256-GCM.
    """

    if len(key) != KEY_SIZE:
        raise ValueError("AES-256 key must be exactly 32 bytes.")

    nonce = os.urandom(NONCE_SIZE)

    aes = AESGCM(key)

    encrypted = aes.encrypt(
        nonce,
        data,
        None,
    )

    return {
        "ciphertext": base64.b64encode(encrypted).decode("utf-8"),
        "nonce": base64.b64encode(nonce).decode("utf-8"),
    }


def decrypt_aes(
    ciphertext: str,
    nonce: str,
    key: bytes,
) -> bytes:
    """
    Decrypt AES-256-GCM encrypted data.
    """

    if len(key) != KEY_SIZE:
        raise ValueError("AES-256 key must be exactly 32 bytes.")

    encrypted = base64.b64decode(ciphertext)
    nonce_bytes = base64.b64decode(nonce)

    aes = AESGCM(key)

    return aes.decrypt(
        nonce_bytes,
        encrypted,
        None,
    )