from typing import Optional
import uuid
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class GymCreateRequest(BaseModel):
    """
    Schema representing user requests to establish a new Gym profile.
    """

    gym_name: str = Field(..., min_length=2, max_length=255)
    owner_name: str = Field(..., min_length=2, max_length=255)
    phone: str = Field(..., max_length=50)

    @field_validator("gym_name", "owner_name", "phone", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        """
        Trims leading and trailing spaces from input string values.
        """
        if isinstance(v, str):
            return v.strip()
        return v


class GymUpdateRequest(BaseModel):
    """
    Schema representing user updates to an existing Gym profile.
    All fields are optional.
    """

    gym_name: Optional[str] = Field(None, min_length=2, max_length=255)
    owner_name: Optional[str] = Field(None, min_length=2, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)

    @field_validator("gym_name", "owner_name", "phone", mode="before")
    @classmethod
    def strip_whitespace(cls, v: Optional[str]) -> Optional[str]:
        """
        Trims spaces if string values are supplied.
        """
        if isinstance(v, str):
            return v.strip()
        return v


class GymResponse(BaseModel):
    """
    Schema detailing serialized output payloads for Gym profiles.
    """

    id: uuid.UUID
    gym_name: str
    owner_name: str
    phone: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
