from typing import Optional

from sqlalchemy.orm import Session

import crud
from schemas.product import Product
from tests.utils.user import add_test_user_to_db


def create_random_product(session: Session, *, creator_id: Optional[int] = None) -> Product:
    if creator_id is None:
        user = add_test_user_to_db(session)
        creator_id = user.id
    return crud.create_product(db=session, creator_id=creator_id)
