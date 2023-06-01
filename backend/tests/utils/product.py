from typing import Optional

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

import crud
from core.config import settings
from schemas.product import Product
from tests.utils.utils import create_superuser


def create_random_product(session: Session, *, creator_id: Optional[int] = None) -> Product:
    if creator_id is None:
        user = add_test_user_to_db(session)
        creator_id = user.id
    return crud.create_product(db=session, creator_id=creator_id)


@pytest.fixture(scope="module")
def db_with_product(session: Session, client: TestClient) -> Product:
    return create_random_product(session=session, client=client)


@pytest.fixture(scope="module")
def db_with_3_products(session: Session, client: TestClient) -> list[Product]:
    products = [create_random_product(session=session, client=client) for _ in range(3)]
    return products
