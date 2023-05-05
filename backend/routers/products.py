from typing import Optional

from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session

import crud
from auth import oauth2
from database import get_db
from schemas.product import Product, ProductsDisplay, ProductEdit
from schemas.review import ReviewCreate
from schemas.user import User

router = APIRouter(
    prefix='/products',
    tags=['products']
)


@router.get("/{product_id}", response_model=Product)
def read_product(
        product_id: int,
        db: Session = Depends(get_db),
):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


@router.put('/{product_id}', response_model=Product)
def edit_product(
        item: ProductEdit, db: Session = Depends(get_db),
        current_user: User = Depends(oauth2.get_current_user),
):
    return crud.edit_product(db, new_product=item)


@router.post('/{product_id}/reviews', tags=['reviews'])
def create_review(
        product_id: int,
        review: ReviewCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(oauth2.get_current_user)
):
    crud.create_review(db, review, product_id, creator_id=current_user.id)
    return 'test'


@router.post('', response_model=ProductEdit)
def create_product(
        db: Session = Depends(get_db),
        current_user: User = Depends(oauth2.get_current_user)
):
    return crud.create_product(db=db, creator_id=current_user.id)


@router.get('', response_model=ProductsDisplay)
def read_products(page: int = 1, keyword: Optional[str] = None, db: Session = Depends(get_db)):
    page_size = 4
    response = crud.get_products(db, skip=page_size * (page - 1), limit=page_size, keyword=keyword)
    response.update({"page": page})
    return response
