from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    AUTH_BIBLE_DB_URL: str
    BIBLE_DB_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    RUST_SEARCH_URL: str
    FRONTEND_URL: str

    class Config:
        env_file = ".env"


settings = Settings()
