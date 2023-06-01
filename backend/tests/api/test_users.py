from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

import crud
from core.config import settings
from schemas.user import ProfileUpdate
from tests.utils.user import add_test_user_to_db
from tests.utils.utils import random_lower_string, random_email, are_list_equal


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
        client: TestClient, session: Session, superuser_token_headers: dict
) -> None:
    r = client.get("/users/profile", headers=superuser_token_headers)
    current_user = r.json()

    res_keys_expected = ['id', 'email', 'name', 'isAdmin']

    comparison_result = are_list_equal(res_keys_expected, list(current_user.keys()))
    assert current_user
    assert not comparison_result, comparison_result
    assert current_user["isAdmin"] is True
    assert current_user["name"] == settings.FIRST_SUPERUSER_NAME
    assert current_user["email"] == settings.FIRST_SUPERUSER_EMAIL


def test_get_existing_user(
        client: TestClient,
        superuser_token_headers: dict,
        session: Session,
        normal_user_token_headers: Dict[str, str]) -> None:
    user_in = add_test_user_to_db(session)
    r = client.get(
        f"users/{user_in.id}", headers=superuser_token_headers,
    )
    api_user = r.json()
    existing_user = crud.get_user_by_email(db=session, email=user_in.email)
    assert existing_user
    assert existing_user.email == api_user["email"]

    r = client.get(f"users/{user_in.id}", headers=normal_user_token_headers)
    assert r.status_code == 403, 'Non-admin has access to change another user profile'


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


def test_change_user_info(
        client: TestClient,
        superuser_token_headers: dict,
        session: Session,
        normal_user_token_headers: Dict[str, str]
) -> None:
    normal_user_old = crud.get_user_by_email(db=session, email=settings.TEST_USER_EMAIL)
    normal_user_old_data = {"name": normal_user_old.name, "email": normal_user_old.email}
    normal_user_updates = ProfileUpdate(name=random_lower_string())
    r = client.patch("/users/profile", headers=normal_user_token_headers,
                     json=normal_user_updates.dict(exclude_none=True))
    normal_user_updated = r.json()
    assert normal_user_old_data["name"] != normal_user_updated["name"]
    assert normal_user_old_data["email"] == normal_user_updated["email"]

    new_user = add_test_user_to_db(session)
    new_user_old_data = {"name": new_user.name}
    new_user_updates = ProfileUpdate(name=random_lower_string())

    r = client.patch(f"users/{new_user.id}", headers=normal_user_token_headers,
                     json=new_user_updates.dict(exclude_none=True))
    assert r.status_code == 403, 'Non-admin has access to change another user profile'

    r = client.patch(f"users/{new_user.id}", headers=superuser_token_headers,
                     json=new_user_updates.dict(exclude_none=True))
    new_user_updated_by_admin = r.json()

    assert 200 == r.status_code, f"Something went wrong, status code: {r.status_code}"
    assert new_user_old_data["name"] != new_user_updated_by_admin["name"]
