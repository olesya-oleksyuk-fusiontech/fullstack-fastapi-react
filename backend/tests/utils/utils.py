import random
import string
from typing import Dict

from fastapi.testclient import TestClient

from core.config import settings


def random_lower_string() -> str:
    return "".join(random.choices(string.ascii_lowercase, k=10))


def random_email() -> str:
    return f"{random_lower_string()}@{random_lower_string()}.com"


def get_superuser_token_headers(client: TestClient) -> Dict[str, str]:
    login_data = {
        "name": settings.FIRST_SUPERUSER_NAME,
        "email": settings.FIRST_SUPERUSER_EMAIL,
        "password": settings.FIRST_SUPERUSER_PASSWORD,
        "isAdmin": True
    }
    response = client.post("/users", json=login_data)
    tokens = response.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}
    return headers


def test_list_equal(expected: list, actual: list) -> str:
    seen = set()
    duplicates = []
    for x in actual:
        if x in seen:
            duplicates.append(x)
        else:
            seen.add(x)
    lacks = set(expected) - set(actual)
    extra = set(actual) - set(expected)
    message = f"Lacks elements {lacks} " if lacks else ''
    message += f"Extra elements {extra}" if extra else ''
    message += f"Duplicate elements {duplicates}" if duplicates else ''
    return message
