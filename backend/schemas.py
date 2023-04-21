from typing import List

from pydantic import BaseModel


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

    class Config:
        orm_mode = True


class ProductsDisplay(BaseModel):
    products: List[Product]
    page: int
    pages: int

    class Config:
        orm_mode = True
