from typing import Any, Optional
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder


def success_response(
    data: Any = None,
    message: Optional[str] = None,
    status_code: int = 200,
) -> JSONResponse:
    """
    Standardizes a successful API response using JSONResponse.
    Format:
    {
        "success": true,
        "data": { ... },
        "message": "..." (optional)
    }
    """
    content = {
        "success": True,
        "data": jsonable_encoder(data) if data is not None else {},
    }
    if message is not None:
        content["message"] = message

    return JSONResponse(status_code=status_code, content=content)


def error_response(
    code: str,
    message: str,
    status_code: int = 400,
) -> JSONResponse:
    """
    Standardizes an error API response using JSONResponse.
    Format:
    {
        "success": false,
        "error": {
            "code": "...",
            "message": "..."
        }
    }
    """
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "error": {
                "code": code,
                "message": message,
            },
        },
    )
