from datetime import datetime

from pydantic import BaseModel, conint


class ReviewOwner(BaseModel):
    name: str

    class Config:
        orm_mode = True


# for auth usage
class Review(BaseModel):
    id: int
    rating: int
    comment: str
    created_on: datetime
    product_id: int
    creator_id: int
    creator: ReviewOwner

    class Config:
        orm_mode = True


class ReviewCreate(BaseModel):
    rating: conint(ge=0, le=5)
    comment: str

    class Config:
        orm_mode = True


class ReviewCreateOut(ReviewCreate):
    product_id: int
    creator_id: int

    class Config:
        orm_mode = True


class ReviewReadWithProduct(ReviewCreate):
    created_on: datetime
    owner: ReviewOwner

    class Config:
        orm_mode = True
