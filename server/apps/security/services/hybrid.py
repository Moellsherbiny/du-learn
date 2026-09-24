import base64
import json

from apps.security.encryption.aes import (
    decrypt_aes,
    encrypt_aes,
    generate_aes_key,
)

from apps.security.encryption.hashing import sha256

from apps.security.encryption.rsa import (
    decrypt_rsa,
    encrypt_rsa,
)


def encrypt_hybrid(
    data: dict,
    public_key_pem: bytes,
) -> dict:
    """
    Hybrid encryption:

    1. Serialize data to JSON.
    2. Generate AES-256 key.
    3. Encrypt data using AES-256-GCM.
    4. Encrypt AES key using RSA-OAEP.
    5. Generate SHA-256 hash.
    """

    plaintext = json.dumps(
        data,
        ensure_ascii=False,
        separators=(",", ":"),
    ).encode("utf-8")

    aes_key = generate_aes_key()

    aes_result = encrypt_aes(
        plaintext,
        aes_key,
    )

    encrypted_aes_key = encrypt_rsa(
        aes_key,
        public_key_pem,
    )

    data_hash = sha256(plaintext)

    return {
        "algorithm": "HYBRID",
        "encryption": {
            "data": aes_result["ciphertext"],
            "nonce": aes_result["nonce"],
            "encrypted_key": encrypted_aes_key,
        },
        "integrity": {
            "algorithm": "SHA-256",
            "hash": data_hash,
        },
    }


def decrypt_hybrid(
    encrypted_payload: dict,
    private_key_pem: bytes,
) -> dict:
    """
    Decrypt hybrid encrypted data.
    """

    encryption = encrypted_payload["encryption"]

    encrypted_aes_key = encryption["encrypted_key"]

    aes_key = decrypt_rsa(
        encrypted_aes_key,
        private_key_pem,
    )

    plaintext = decrypt_aes(
        encryption["data"],
        encryption["nonce"],
        aes_key,
    )

    expected_hash = encrypted_payload["integrity"]["hash"]

    actual_hash = sha256(plaintext)

    if actual_hash != expected_hash:
        raise ValueError(
            "Data integrity verification failed."
        )

    return json.loads(
        plaintext.decode("utf-8"),
    )