import logging
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import sentry_sdk

from app.core.error_codes import ErrorCode
from app.core.responses import error_response

logger = logging.getLogger(__name__)


class AppException(Exception):
    """
    Base exception class for all custom application exceptions.
    """

    def __init__(self, code: str, message: str, status_code: int = 400):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code


class AuthenticationException(AppException):
    def __init__(
        self,
        message: str = "Invalid credentials",
        code: str = ErrorCode.INVALID_CREDENTIALS,
    ):
        super().__init__(code=code, message=message, status_code=401)


class AuthorizationException(AppException):
    def __init__(
        self,
        message: str = "Not authorized to access this resource",
        code: str = ErrorCode.FORBIDDEN,
    ):
        super().__init__(code=code, message=message, status_code=403)


class NotFoundException(AppException):
    def __init__(
        self, message: str = "Resource not found", code: str = ErrorCode.NOT_FOUND
    ):
        super().__init__(code=code, message=message, status_code=404)


class ValidationException(AppException):
    def __init__(
        self,
        message: str = "Validation failed",
        code: str = ErrorCode.VALIDATION_ERROR,
    ):
        super().__init__(code=code, message=message, status_code=422)


class ConflictException(AppException):
    def __init__(
        self,
        message: str = "Conflict occurred",
        code: str = ErrorCode.EMAIL_ALREADY_EXISTS,
    ):
        super().__init__(code=code, message=message, status_code=409)


class WhatsAppException(AppException):
    def __init__(self, message: str, code: str = ErrorCode.WHATSAPP_NOT_CONNECTED):
        super().__init__(code=code, message=message, status_code=400)


class MetaAPIException(AppException):
    def __init__(
        self,
        message: str,
        code: str = ErrorCode.META_API_ERROR,
        status_code: int = 500,
    ):
        super().__init__(code=code, message=message, status_code=status_code)



def register_exception_handlers(app: FastAPI) -> None:
    """
    Registers global exception handlers to capture all errors raised in the application.
    Conforms all error payloads to a uniform client response structure.
    """

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
        """
        Handles custom application business logic exceptions.
        """
        logger.warning(
            f"AppException [{exc.code}] on {request.url.path}: {exc.message}"
        )
        return error_response(
            code=exc.code, message=exc.message, status_code=exc.status_code
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request, exc: StarletteHTTPException
    ) -> JSONResponse:
        """
        Handles standard FastAPI/Starlette HTTPExceptions.
        """
        status_code = exc.status_code
        message = str(exc.detail)

        # Map typical HTTP status codes to defined application ErrorCodes
        if status_code == 401:
            code = ErrorCode.UNAUTHORIZED
        elif status_code == 403:
            code = ErrorCode.FORBIDDEN
        elif status_code == 404:
            code = ErrorCode.NOT_FOUND
        elif status_code == 422:
            code = ErrorCode.VALIDATION_ERROR
        else:
            code = f"HTTP_ERROR_{status_code}"

        logger.warning(
            f"HTTPException [{code}] on {request.url.path}: {message} (Status: {status_code})"
        )
        return error_response(code=code, message=message, status_code=status_code)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        """
        Handles incoming request schema validation errors (e.g. missing fields, invalid formats).
        """
        errors = exc.errors()
        error_details = []

        for err in errors:
            # Format location to readable dot-separated paths (e.g. body.user.email)
            loc = ".".join(str(item) for item in err.get("loc", []))
            msg = err.get("msg", "Validation error")
            error_details.append(f"{loc}: {msg}")

        # Combine all detailed error messages
        combined_message = " | ".join(error_details) or "Validation failed"
        logger.warning(
            f"RequestValidationError on {request.url.path}: {combined_message}"
        )

        return error_response(
            code=ErrorCode.VALIDATION_ERROR,
            message=combined_message,
            status_code=422,
        )

    @app.exception_handler(ValidationError)
    async def pydantic_validation_exception_handler(
        request: Request, exc: ValidationError
    ) -> JSONResponse:
        """
        Handles internal model parsing errors (Pydantic ValidationError) raised during runtime.
        """
        errors = exc.errors()
        error_details = []
        for err in errors:
            loc = ".".join(str(item) for item in err.get("loc", []))
            msg = err.get("msg", "Validation error")
            error_details.append(f"{loc}: {msg}")

        combined_message = " | ".join(error_details) or "Internal validation failed"
        logger.error(
            f"Pydantic ValidationError on {request.url.path}: {combined_message}"
        )

        return error_response(
            code=ErrorCode.VALIDATION_ERROR,
            message=combined_message,
            status_code=500,
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        """
        Catch-all exception handler for unhandled server-side errors.
        Logs details to standard output, captures the traceback in Sentry, and obscures raw details to client.
        """
        # Capture error in Sentry
        sentry_sdk.capture_exception(exc)

        # Log complete stacktrace internally
        logger.exception(
            f"Unhandled exception encountered during request: {request.method} {request.url.path}"
        )

        # Obscure traceback from client responses for security
        return error_response(
            code=ErrorCode.INTERNAL_SERVER_ERROR,
            message="An unexpected server error occurred. Please contact support.",
            status_code=500,
        )
