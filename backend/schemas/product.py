from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel

from constants import Product_info
from .review import ReviewReadWithProduct

from .user import ReviewCreator


class ProductEdit(BaseModel):
    id: int
    name: Optional[str]= Product_info.brand
    image: Optional[str]= Product_info.image
    brand: Optional[str]= Product_info.brand
    category: Optional[str]= Product_info.category
    description: Optional[str]= Product_info.description
    price: Optional[float]= Product_info.price
    countInStock: Optional[int]= Product_info.countInStock

    class Config:
        orm_mode = True

class Product(ProductEdit):
    creator_id: int
    created_on: datetime

    class Config:
        orm_mode = True

class ProductOnAdminList(ProductEdit):
    rating: int
    numReviews: int

    class Config:
        orm_mode = True


class Product(ProductOnAdminList):
    created_on: datetime
    updated_on: Optional[datetime]
    reviews: Optional[List[ReviewReadWithProduct]] = []
    # admin who add the product
    creator: ReviewCreator = None


class ProductsDisplay(BaseModel):
    products: List[ProductOnAdminList]
    page: int
    pages: int

    class Config:
        orm_mode = True
