import os
import sys

# Set up python search path to import backend application files
sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
)

from app.services.encryption_service import EncryptionService


def test_encryption_roundtrip() -> None:
    print("Starting EncryptionService verification test...")

    plaintext = "sample_waba_access_token_123456!"

    try:
        # 1. Encrypt
        ciphertext = EncryptionService.encrypt(plaintext)
        print(f"Original plaintext: '{plaintext}'")
        print(f"Encrypted ciphertext: '{ciphertext}'")

        # Verify that cipher text is indeed different from plaintext
        assert ciphertext != plaintext, "Encryption failed: Ciphertext is equal to plaintext!"

        # 2. Decrypt
        decrypted = EncryptionService.decrypt(ciphertext)
        print(f"Decrypted plaintext: '{decrypted}'")

        # Verify round-trip matches original plaintext
        assert decrypted == plaintext, f"Decryption mismatch: expected '{plaintext}' but got '{decrypted}'"

        # 3. Test validation errors
        try:
            EncryptionService.decrypt("corrupt_or_invalid_ciphertext")
            assert False, "Decryption error check failed: did not raise expected ValueError for invalid token."
        except ValueError as e:
            print(f"Correctly caught invalid decryption payload: {e}")

        print("\n\u2713 Success: Symmetrical Fernet encryption and decryption functions operate correctly!")

    except Exception as exc:
        print(f"\n\u2717 Verification Test Failed: {exc}")
        sys.exit(1)


if __name__ == "__main__":
    test_encryption_roundtrip()
