from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel


class Review(BaseModel):
    id: int
    rating: int
    comment: str
    created_on: datetime
    product_id: int

    class Config:
        orm_mode = True


class Product(BaseModel):
    id: int
    name: str
    image: str
    brand: str
    category: str
    description: str
    rating: int
    price: float
    countInStock: int
    created_on: datetime
    reviews: Optional[List[Review]] = []


    class Config:
        orm_mode = True


class ProductsDisplay(BaseModel):
    products: List[Product]
    page: int
    pages: int

    class Config:
        orm_mode = True
