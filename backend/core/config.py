from pydantic import BaseSettings, EmailStr


class Settings(BaseSettings):
    API_V1_STR: str = "/api"

    TEST_USER_EMAIL: EmailStr = "test@example.com"
    TEST_USER_PASSWORD: str = "1234"
    FIRST_SUPERUSER_EMAIL: EmailStr = "admin@example.com"
    FIRST_SUPERUSER_PASSWORD: str = '1234'
    FIRST_SUPERUSER_NAME: str = 'admin'
    USERS_OPEN_REGISTRATION: bool = False

    class Config:
        case_sensitive = True


settings = Settings()
