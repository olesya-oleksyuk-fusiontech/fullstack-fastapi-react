from typing import List, Optional

from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session

import schemas
import crud
from auth import oauth2
from database import get_db

router = APIRouter(
    prefix='/products',
    tags=['products']
)


@router.get("/{product_id}",
            response_model=schemas.Product,
            tags=['products'])
def read_product(
        product_id: int,
        db: Session = Depends(get_db),
):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


@router.post('', response_model=schemas.Product, tags=['products'])
def create_product(
        item: schemas.Product, db: Session = Depends(get_db)
):
    return crud.create_product(db=db, item=item)


@router.get('', response_model=schemas.ProductDisplay, tags=['products'])
def read_products(page: int = 1, keyword: Optional[str] = None, db: Session = Depends(get_db)):
    page_size = 8
    response = crud.get_products(db, skip=page_size * (page - 1), limit=page_size, keyword=keyword)
    response.update({"page": page})
    return response
