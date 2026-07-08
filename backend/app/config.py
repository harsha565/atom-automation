from typing import Optional

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Gym WhatsApp Automation API"
    APP_ENV: str = "development"
    DEBUG: bool = True

    DATABASE_URL: str

    JWT_SECRET_KEY: str
    JWT_REFRESH_SECRET_KEY: str

    SUPABASE_URL: str = "https://lekjnclggscuaglqzavr.supabase.co"
    SUPABASE_ANON_KEY: str = "sb_publishable_4Rbw_R5J_EbtjCZH5BL_zw_T37vtEsh"
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    FERNET_SECRET_KEY: str

    ALLOWED_ORIGINS: list[str] = []

    META_APP_ID: Optional[str] = None
    META_APP_SECRET: str
    META_WEBHOOK_VERIFY_TOKEN: str
    APP_PUBLIC_URL: str = "http://localhost:3000"

    N8N_WEBHOOK_URL: Optional[str] = None

    SENTRY_DSN: Optional[str] = None

    INTERNAL_CRON_SECRET: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def validate_database_url(cls, v: Optional[str]) -> Optional[str]:
        if v and v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def validate_allowed_origins(cls, v: any) -> list[str]:
        if not v:
            return []
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [x.strip() for x in v.split(",") if x.strip()]
        return []

    @model_validator(mode="after")
    def validate_production_secrets(self) -> "Settings":
        if self.APP_ENV == "production":
            default_keys = [
                "your-super-secret-access-token-key-change-me",
                "your-super-secret-refresh-token-key-change-me",
                "temp-secret-key",
                "temp-refresh-secret-key"
            ]
            if self.JWT_SECRET_KEY in default_keys:
                raise ValueError("JWT_SECRET_KEY must be a unique secure value in production!")
            if self.JWT_REFRESH_SECRET_KEY in default_keys:
                raise ValueError("JWT_REFRESH_SECRET_KEY must be a unique secure value in production!")
        return self


settings = Settings()