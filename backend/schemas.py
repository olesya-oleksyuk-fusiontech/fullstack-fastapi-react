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
