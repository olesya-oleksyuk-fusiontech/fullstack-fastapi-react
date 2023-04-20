from typing import Text
from sqlalchemy.schema import Column
from sqlalchemy.types import String, Integer, Text
from database import Base


class Product(Base):
    __tablename__ = "Product"

    id: Column(Integer, primary_key=True, index=True)
    name: Column(String(50), unique=True)
    image: Column(String(100))
    brand: Column(String(20))
    category: Column(String(20))
    description: Column(Text())
    rating: Column(Integer)
    price: Column(Integer)
    countInStock: Column(Integer)


