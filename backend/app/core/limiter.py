from slowapi import Limiter
from fastapi import Request

def get_real_client_ip(request: Request) -> str:
    # Use X-Forwarded-For header if present (standard for Railway, Vercel, etc.)
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        # Extract the rightmost/last entry (the client IP seen by the immediate proxy)
        ips = [ip.strip() for ip in forwarded.split(",")]
        return ips[-1]
    return request.client.host if request.client else "127.0.0.1"

# Initialize the Limiter object as a singleton.
# This prevents circular dependencies when importing the rate-limiter in routes.
limiter = Limiter(key_func=get_real_client_ip, default_limits=["100/minute"])
