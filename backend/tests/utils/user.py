from mysqlx import Session

import crud
from models import User
from schemas.user import UserToRegister
from tests.utils.utils import random_email, random_lower_string


def add_test_user_to_db(session: Session, email: str | None = None) -> User:
    email = random_email() if (email is None) else email
    name = random_lower_string()
    password = random_lower_string()
    user_in = UserToRegister(name=name, email=email, password=password)
    user = crud.create_user(db=session, user=user_in)
    return user