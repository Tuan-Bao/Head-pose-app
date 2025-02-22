from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Head Mouse Control"
    WEBSOCKET_PORT: int = 8000
    WEBSOCKET_HOST: str = "0.0.0.0"
    CORS_ORIGINS: list = ["http://localhost:5173"]  # Your React app URL

    class Config:
        env_file = ".env"

settings = Settings() 