from typing import Optional

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

import crud
from core.config import settings
from schemas.product import Product
from tests.utils.utils import create_superuser


def create_random_product(session: Session, client: TestClient, *, creator_id: Optional[int] = None) -> Product:
    if creator_id is None:
        try:
            creator = crud.get_user_by_email(db=session, email=settings.FIRST_SUPERUSER_EMAIL)
            return crud.create_product(db=session, creator_id=creator.id)
        except Exception as e:
            if hasattr(e, 'status_code') and e.status_code == 404:
                superuser = create_superuser(client)
                return crud.create_product(db=session, creator_id=superuser['id'])
        superuser = create_superuser(client)
        creator_id = superuser.id
    return crud.create_product(db=session, creator_id=creator_id)


@pytest.fixture(scope="module")
def db_with_product(session: Session, client: TestClient) -> Product:
    return create_random_product(session=session, client=client)


@pytest.fixture(scope="module")
def db_with_3_products(session: Session, client: TestClient) -> list[Product]:
    products = [create_random_product(session=session, client=client) for _ in range(3)]
    return products
