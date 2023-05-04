from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session

import crud
from auth import oauth2
from database import get_db
from schemas.orders import OrderDisplay
from schemas.user import User

router = APIRouter(
    prefix='/orders',
    tags=['orders']
)


@router.get("/{order_id}", response_model=OrderDisplay)
def read_order(
        order_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(oauth2.get_current_user)
):
    db_order = crud.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order
