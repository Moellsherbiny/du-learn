import base64

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa


def generate_rsa_keys(
    key_size: int = 2048,
) -> tuple[bytes, bytes]:
    """
    Generate RSA private and public keys.
    """

    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=key_size,
    )

    public_key = private_key.public_key()

    private_bytes = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )

    public_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )

    return private_bytes, public_bytes


def encrypt_rsa(
    data: bytes,
    public_key_pem: bytes,
) -> str:
    """
    Encrypt data using RSA-OAEP.
    """

    public_key = serialization.load_pem_public_key(
        public_key_pem,
    )

    encrypted = public_key.encrypt(
        data,
        padding.OAEP(
            mgf=padding.MGF1(
                algorithm=hashes.SHA256(),
            ),
            algorithm=hashes.SHA256(),
            label=None,
        ),
    )

    return base64.b64encode(encrypted).decode("utf-8")


def decrypt_rsa(
    encrypted_data: str,
    private_key_pem: bytes,
) -> bytes:
    """
    Decrypt RSA-OAEP encrypted data.
    """

    private_key = serialization.load_pem_private_key(
        private_key_pem,
        password=None,
    )

    encrypted = base64.b64decode(encrypted_data)

    return private_key.decrypt(
        encrypted,
        padding.OAEP(
            mgf=padding.MGF1(
                algorithm=hashes.SHA256(),
            ),
            algorithm=hashes.SHA256(),
            label=None,
        ),
    )