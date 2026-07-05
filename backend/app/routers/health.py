from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("")
async def health_check() -> dict:
    """
    Service health check endpoint.
    Returns the operational status of the API application.
    """
    return {
        "success": True,
        "data": {
            "status": "ok"
        }
    }
