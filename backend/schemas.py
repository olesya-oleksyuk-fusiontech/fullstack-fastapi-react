from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel

class ReviewOwner(BaseModel):
    name: str

    class Config:
        orm_mode = True


class Review(BaseModel):
    id: int
    rating: int
    comment: str
    created_on: datetime
    product_id: int
    creator_id: int
    creator: ReviewOwner
    # user: ReviewOwner = Relationship(back_populates="user")
    # user: ReviewOwner = Relationship(back_populates="user")

    class Config:
        orm_mode = True


class ReviewReadWithProduct(BaseModel):
    rating: int
    comment: str
    created_on: datetime
    creator_id: int
    owner: ReviewOwner
    # user: ReviewOwner = Relationship(back_populates="user")

    class Config:
        orm_mode = True

class User(BaseModel):
    id: int
    name: str
    email: str
    password: str
    isAdmin: bool
    createdAt: datetime
    updatedAt: datetime
    reviews: Optional[List[Review]] = []

    class Config:
        orm_mode = True


class Creator(BaseModel):
    id: int
    name: str
    email: str
    createdAt: datetime
    updatedAt: datetime

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
    reviews: Optional[List[ReviewReadWithProduct]] = []
    # admin who add the product
    creator: Creator = None

    class Config:
        orm_mode = True


class UserDisplay(BaseModel):
    id: int
    name: str
    email: str
    isAdmin: bool
    createdAt: datetime
    updatedAt: datetime
    reviews: Optional[List[Review]] = []

    class Config:
        orm_mode = True


class UserDetails(BaseModel):
    _id: int
    name: str
    email: str
    isAdmin: bool

    class Config:
        orm_mode = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    isAdmin: Optional[bool] = None

    class Config:
        orm_mode = True


class UserRegister(BaseModel):
    name: str
    email: str
    password: str

    class Config:
        orm_mode = True


class ProductAuth(BaseModel):
    data: Product
    current_user: UserDisplay

    class Config:
        orm_mode = True


class ProductDisplay(BaseModel):
    products: List[Product]
    page: int
    pages: int

    class Config:
        orm_mode = True
