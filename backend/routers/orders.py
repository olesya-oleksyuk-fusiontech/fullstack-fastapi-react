from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session

import crud
from auth import oauth2
from database import get_db
from schemas.orders import OrderDisplay, OrderCreate, OrdersDisplay
from schemas.user import User

router = APIRouter(
    prefix='/orders',
    tags=['orders']
)


@router.get('/myorders', response_model=OrdersDisplay)
def read_user_orders(
        page: int = 1,
        page_size: int = 1000,
        db: Session = Depends(get_db),
        current_user: User = Depends(oauth2.get_current_user)):
    response = crud.get_my_orders(user_id=current_user.id, db=db, skip=page_size * (page - 1), limit=page_size)
    response.update({"page": page})
    return response


@router.post('', response_model=OrderDisplay)
def create_order(
        order_details: OrderCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(oauth2.get_current_user),
):
    new_order = crud.add_order(db=db, order_details=order_details, user_id=current_user.id)
    return new_order


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


@router.get('', response_model=OrdersDisplay)
def read_orders(
        page: int = 1,
        page_size: int = 1000,
        db: Session = Depends(get_db),
        current_user: User = Depends(oauth2.get_current_user)
):
    if not current_user.isAdmin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Accessible to admins only")
    response = crud.get_orders(db, skip=page_size * (page - 1), limit=page_size)
    response.update({"page": page})
    return response
