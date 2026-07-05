from pydantic import BaseModel


class DataDeletionResponse(BaseModel):
    url: str
    confirmation_code: str
