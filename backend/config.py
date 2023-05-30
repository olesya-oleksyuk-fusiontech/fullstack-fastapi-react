from os import environ
from dotenv import load_dotenv

load_dotenv()

DB_HOST = environ.get("DB_HOST")
DB_PORT = environ.get("DB_PORT")
DB_NAME = environ.get("DB_NAME")
TEST_DB_NAME = environ.get("TEST_DB_NAME")
DB_USER = environ.get("DB_USER")
DB_PASS = environ.get("DB_PASS")
SECRET_KEY = environ.get("SECRET_KEY")
JWT_ALGORITHM = environ.get("JWT_ALGORITHM")
PAYPAL_CLIENT_ID = environ.get("PAYPAL_CLIENT_ID")
