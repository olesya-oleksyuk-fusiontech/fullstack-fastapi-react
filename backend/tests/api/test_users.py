from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

import crud
from core.config import settings
from schemas.user import UserRegister, ProfileUpdate, User
from tests.utils.utils import random_lower_string, random_email


def add_test_user_to_db(session: Session, email: str | None = None) -> User:
    email = random_email() if (email is None) else email
    name = random_lower_string()
    password = random_lower_string()
    user_in = UserRegister(name=name, email=email, password=password)
    user = crud.create_user(db=session, user=user_in)
    return user


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
        *, client: TestClient, email: str, session: Session
) -> Dict[str, str]:
    """
    Return a valid token for the user with given email.

    If the user doesn't exist it is created first.
    """
    password = random_lower_string()

    try:
        user = crud.get_user_by_email(db=session, email=email)
        user_in_update = ProfileUpdate(password=password)
        crud.update_user(db=session, user_id=user['user_id'], new_user=user_in_update)
    except:
        new_user_name = random_lower_string()
        user_in_create = UserRegister(name= new_user_name, email=email, password=password)
        crud.create_user(db=session, user=user_in_create)
    #
    #
    # user = crud.get_user_by_email(db=session, email=email)
    # if not user:
    #     user_in_create = UserRegister(name=name, email=email, password=password)
    #     user = crud.create_user(db=session, user=user_in_create)
    # else:
    #     user_in_update = ProfileUpdate(password=password)
    #     user = crud.update_user(db=session, user_id=user['user_id'], new_user=user_in_update)

    return user_authentication_headers(client=client, email=email, password=password)


def test_get_all_users(
        client: TestClient,
        superuser_token_headers: dict,
        session: Session,
        normal_user_token_headers: Dict[str, str]
) -> None:
    user_in1 = add_test_user_to_db(session)
    user_in2 = add_test_user_to_db(session)

    r = client.get("/users", headers=superuser_token_headers)
    all_users = r.json()

    assert len(all_users) == 4, "Wrong number of User records in the DB"
    user_names = []
    for item in all_users:
        user_names.append(item['name'])
        assert "email" in item, "Email is missing in User DB record"
    assert user_in1.name in user_names and user_in2.name in user_names, 'Some of User names are missing'

    r = client.get("/users", headers=normal_user_token_headers)
    assert r.status_code == 403, 'Non-admin has access to all user profiles'


def test_get_user_profile_me(
        client: TestClient, superuser_token_headers: Dict[str, str]
) -> None:
    r = client.get("/users/profile", headers=superuser_token_headers)
    current_user = r.json()
    assert current_user
    assert current_user["isAdmin"] is True
    assert current_user["name"] == settings.FIRST_SUPERUSER_NAME
    assert current_user["email"] == settings.FIRST_SUPERUSER_EMAIL


def test_get_existing_user(
        client: TestClient, superuser_token_headers: dict, session: Session
) -> None:
    user_in = add_test_user_to_db(session)
    r = client.get(
        f"users/{user_in.id}", headers=superuser_token_headers,
    )
    api_user = r.json()
    existing_user = crud.get_user_by_email(db=session, email=user_in.email)
    assert existing_user
    assert existing_user.email == api_user["email"]


def test_create_new_user(
        client: TestClient, session: Session
) -> None:
    email = random_email()
    name = random_lower_string()
    password = random_lower_string()
    data = {"email": email, "password": password, 'name': name}
    r = client.post(
        '/users', json=data,
    )
    assert 200 <= r.status_code < 300
    created_user = r.json()
    user = crud.get_user_by_email(db=session, email=email)
    assert user
    assert user.email == created_user["email"]
