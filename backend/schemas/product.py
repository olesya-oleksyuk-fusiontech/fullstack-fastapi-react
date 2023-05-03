from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel

from .review import ReviewReadWithProduct

from .user import ReviewCreator


class ProductEdit(BaseModel):
    id: int
    name: str
    image: str
    brand: str
    category: str
    description: str
    price: float
    countInStock: int

    class Config:
        orm_mode = True


class ProductOnAdminList(ProductEdit):
    rating: int
    numReviews: int

    class Config:
        orm_mode = True


class Product(ProductOnAdminList):
    created_on: datetime
    reviews: Optional[List[ReviewReadWithProduct]] = []
    # admin who add the product
    creator: ReviewCreator = None


class ProductsDisplay(BaseModel):
    products: List[ProductOnAdminList]
    page: int
    pages: int

    class Config:
        orm_mode = True
