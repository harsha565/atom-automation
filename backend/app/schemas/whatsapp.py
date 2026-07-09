from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class WhatsAppConnectRequest(BaseModel):
    """
    Schema for initiating a WhatsApp Business Account connection
    using the Meta Embedded Signup authorization code.
    """

    authorization_code: str = Field(
        ...,
        description="The authorization code returned from Meta's Embedded Signup flow.",
    )
    business_id: Optional[str] = Field(
        None,
        description="Optional Business Manager Account ID captured from client session.",
    )
    waba_id: Optional[str] = Field(
        None,
        description="Optional WhatsApp Business Account ID captured from client session.",
    )
    phone_number_id: Optional[str] = Field(
        None,
        description="Optional phone number ID captured from client session.",
    )


class WhatsAppConnectionResponse(BaseModel):
    """
    Schema representing the status parameters of the WhatsApp connection.
    """

    status: str = Field(..., description="Current status of the WhatsApp integration (e.g. CONNECTED, PENDING).")
    phone_number: str = Field(..., description="The linked WhatsApp phone number.")
    waba_id: str = Field(..., description="The WhatsApp Business Account (WABA) ID.")
    connected_at: Optional[datetime] = Field(
        None, description="Timestamp when the connection was established."
    )

    model_config = {"from_attributes": True}
