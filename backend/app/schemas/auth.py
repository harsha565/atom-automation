from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr = Field(
        ..., description="Valid and unique user email address"
    )
    password: str = Field(
        ..., min_length=8,
        description="Secure user password (min 8 chars)"
    )
    gym_name: Optional[str] = Field(
        None, description="Name of the gym or business"
    )
    owner_name: Optional[str] = Field(
        None, description="Name of the gym owner"
    )


class LoginRequest(BaseModel):
    """
    Schema for user login requests.
    """

    email: EmailStr = Field(..., description="Registered user email address")
    password: str = Field(..., description="Plaintext user password")


class RefreshRequest(BaseModel):
    """
    Schema for requesting a new access token using a refresh token.
    """

    refresh_token: str = Field(..., description="Cryptographically secure refresh token string")


class AuthTokensResponse(BaseModel):
    """
    Schema representing the standard JWT access and refresh token payload structure.
    """

    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="Hashed refresh token")
    token_type: str = Field("bearer", description="Token style header prefix")
    gym_name: Optional[str] = Field(None, description="Name of the gym or business")
