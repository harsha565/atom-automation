from typing import Optional
from cryptography.fernet import Fernet, InvalidToken

from app.config import settings


class EncryptionService:
    """
    Encryption service using cryptography Fernet symmetric encryption.
    Uses Settings.FERNET_SECRET_KEY for signing and encrypting sensitive fields.
    """

    _fernet: Optional[Fernet] = None

    @classmethod
    def _get_fernet(cls) -> Fernet:
        """
        Initializes and returns the Fernet instance.
        Raises ValueError if FERNET_SECRET_KEY is misconfigured or invalid.
        """
        if cls._fernet is None:
            if not settings.FERNET_SECRET_KEY:
                raise ValueError("FERNET_SECRET_KEY is not configured in settings.")
            try:
                # Key must be a 32-byte url-safe base64-encoded string
                cls._fernet = Fernet(settings.FERNET_SECRET_KEY.encode("utf-8"))
            except Exception as e:
                raise ValueError(
                    f"Initialization of Fernet failed. Ensure FERNET_SECRET_KEY is a valid 32-byte base64-encoded string. Error: {e}"
                )
        return cls._fernet

    @classmethod
    def encrypt(cls, value: str) -> str:
        """
        Symmetrically encrypts a string value.
        """
        if value is None:
            raise ValueError("Cannot encrypt None value.")
        try:
            fernet = cls._get_fernet()
            encrypted_bytes = fernet.encrypt(value.encode("utf-8"))
            return encrypted_bytes.decode("utf-8")
        except Exception as e:
            if not isinstance(e, ValueError):
                raise ValueError(f"Encryption failed: {e}")
            raise

    @classmethod
    def decrypt(cls, value: str) -> str:
        """
        Symmetrically decrypts a cipher string back to plain text.
        Raises ValueError if decryption fails or if the cipher text is corrupted.
        """
        if value is None:
            raise ValueError("Cannot decrypt None value.")
        try:
            fernet = cls._get_fernet()
            decrypted_bytes = fernet.decrypt(value.encode("utf-8"))
            return decrypted_bytes.decode("utf-8")
        except InvalidToken:
            raise ValueError(
                "Decryption failed: The token is invalid or the key does not match."
            )
        except Exception as e:
            if not isinstance(e, ValueError):
                raise ValueError(f"Decryption failed: {e}")
            raise
