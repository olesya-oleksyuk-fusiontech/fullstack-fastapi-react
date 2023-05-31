from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

import crud
from models import User
from schemas.user import UserToRegister, ProfileUpdate
from tests.utils.utils import random_email, random_lower_string


def user_authentication_headers(
        *, client: TestClient, email: str, password: str
) -> Dict[str, str]:
    data = {"username": email, "password": password}

    r = client.post("/login", data=data)
    response = r.json()
    auth_token = response["access_token"]
    headers = {"Authorization": f"Bearer {auth_token}"}
    return headers


def authentication_token_from_email(
        *, client: TestClient, email: str, password: str | None = None, session: Session
) -> Dict[str, str]:
    """
    Return a valid token for the user with given email.

    If the user doesn't exist it is created first.
    """
    password = random_lower_string() if (password is None) else password

    try:
        user = crud.get_user_by_email(db=session, email=email)
        user_in_update = ProfileUpdate(password=password)
        crud.update_user(db=session, user_id=user['user_id'], new_user=user_in_update)
    except:
        new_user_name = random_lower_string()
        user_in_create = UserToRegister(name=new_user_name, email=email, password=password)
        crud.create_user(db=session, user=user_in_create)

    return user_authentication_headers(client=client, email=email, password=password)


def add_test_user_to_db(session: Session, email: str | None = None) -> User:
    email = random_email() if (email is None) else email
    name = random_lower_string()
    password = random_lower_string()
    user_in = UserToRegister(name=name, email=email, password=password)
    user = crud.create_user(db=session, user=user_in)
    return user
