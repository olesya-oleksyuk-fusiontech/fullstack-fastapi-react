from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

import crud
from core.config import settings
from schemas.user import UserRegister, ProfileUpdate
from tests.utils.utils import random_lower_string, random_email


def user_authentication_headers(
        *, client: TestClient, email: str, password: str
) -> Dict[str, str]:
    data = {"username": email, "password": password}

    r = client.post(f"{settings.API_V1_STR}/login/access-token", data=data)
    response = r.json()
    auth_token = response["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers


def authentication_token_from_email(
        *, client: TestClient, email: str, session: Session
) -> Dict[str, str]:
    """
    Return a valid token for the user with given email.

    If the user doesn't exist it is created first.
    """
    password = random_lower_string()
    name = random_lower_string()

    user = crud.get_user_by_email(db=session, email=email)
    if not user:
        user_in_create = UserRegister(name=name, email=email, password=password)
        user = crud.create_user(db=session, user=user_in_create)
    else:
        user_in_update = ProfileUpdate(password=password)
        user = crud.update_user(db=session, user_id=user['user_id'], new_user=user_in_update)

    return user_authentication_headers(client=client, email=email, password=password)


def test_get_all_users(
        client: TestClient, superuser_token_headers: dict, session: Session
) -> None:
    email = random_email()
    name = random_lower_string()
    password = random_lower_string()
    user_in = UserRegister(name=name, email=email, password=password)
    crud.create_user(db=session, user=user_in)

    email2 = random_email()
    name2 = random_lower_string()
    password2 = random_lower_string()
    user_in2 = UserRegister(name=name2, email=email2, password=password2)
    crud.create_user(db=session, user=user_in2)

    r = client.get("/users", headers=superuser_token_headers)
    all_users = r.json()

    assert len(all_users) == 3, "Wrong number of User records in the DB"
    for item in all_users:
        assert "email" in item, "No email found for the User record"


def test_get_user_profile_me(
        client: TestClient, superuser_token_headers: Dict[str, str]
) -> None:
    r = client.get("/users/profile", headers=superuser_token_headers)
    current_user = r.json()
    assert current_user
    assert current_user["isAdmin"] is True
    assert current_user["name"] == settings.FIRST_SUPERUSER_NAME
    assert current_user["email"] == settings.FIRST_SUPERUSER_EMAIL
