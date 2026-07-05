import asyncio
import os
import sys

# Set up python search path to import backend application files
sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
)

# Load environment configuration so settings are resolved
from dotenv import load_dotenv

load_dotenv()

from app.services.meta_service import MetaService
from app.core.exceptions import MetaAPIException


async def test_meta_token_validation() -> None:
    # Check if command-line argument is passed for token
    if len(sys.argv) < 2:
        print("\nError: Missing temporary access token argument.")
        print("Usage: python scripts/test_meta_service.py <temporary_access_token>")
        sys.exit(1)

    access_token = sys.argv[1]

    print("Initiating Meta Graph API token validation request...")

    try:
        # Resolve profiles detail via validation endpoint
        profile = await MetaService.validate_access_token(access_token)

        print("\n\u2713 Token is VALID!")
        print("Meta Profile Details:")
        print(f"  - Meta User ID: {profile.get('id')}")
        print(f"  - Meta User Name: {profile.get('name')}")

    except MetaAPIException as exc:
        print(f"\n\u2717 Meta API Call Failed (Expected if token is expired/invalid):")
        print(f"  - Error Code: {exc.code}")
        print(f"  - Status Code: {exc.status_code}")
        print(f"  - Error Detail: {exc.message}")
    except Exception as exc:
        print(f"\n\u2717 Unexpected Exception Encountered: {exc}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(test_meta_token_validation())
