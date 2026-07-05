from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel, Field

# Generic payload type placeholder for type-safe success response models
T = TypeVar("T")


class ErrorDetail(BaseModel):
    """
    Sub-schema containing exact details of the encountered error.
    """

    code: str = Field(..., description="Application-specific string error code")
    message: str = Field(..., description="Human-readable description of the error")


class ErrorResponse(BaseModel):
    """
    Standardized schema for API error responses.
    """

    success: bool = Field(False, description="Indicates if request failed")
    error: ErrorDetail = Field(..., description="Detailed error attributes")


class SuccessResponse(BaseModel, Generic[T]):
    """
    Standardized generic schema wrapper for all successful API responses.
    """

    success: bool = Field(True, description="Indicates if request succeeded")
    data: T = Field(..., description="The main response payload data")
    message: Optional[str] = Field(None, description="Optional informational message")


class PaginationSchema(BaseModel):
    """
    Standardized schema defining dataset pagination attributes.
    """

    page: int = Field(..., ge=1, description="Current page number (1-based index)")
    page_size: int = Field(
        ..., ge=1, le=100, description="Number of elements returned per page"
    )
    total: int = Field(..., ge=0, description="Total count of items in database")
