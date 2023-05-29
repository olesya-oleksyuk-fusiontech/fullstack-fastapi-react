from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel

from .review import Review


# for auth usage
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


class ReviewCreator(BaseModel):
    name: str
    email: str

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


class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    isAdmin: Optional[bool] = False

    class Config:
        orm_mode = True


class UserDetails(BaseModel):
    id: int
    name: str
    email: str
    isAdmin: bool

    class Config:
        orm_mode = True


class UserUpdate(UserDetails):
    name: Optional[str] = None
    email: Optional[str] = None
    isAdmin: Optional[bool] = None

    class Config:
        orm_mode = True


class ProfileUpdate(UserUpdate):
    password: Optional[str] = None

    class Config:
        orm_mode = True
