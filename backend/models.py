from sqlalchemy.schema import Column
from sqlalchemy.types import String, Integer, Text, Numeric
from database import Base


class Product(Base):
    __tablename__ = "Product"
    __allow_unmapped__ = True
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False)
    image = Column(String(100), nullable=False)
    brand = Column(String(20), nullable=False)
    category = Column(String(20), nullable=False)
    description = Column(Text(), nullable=False)
    rating = Column(Integer)
    price = Column(Numeric, nullable=False)
    countInStock = Column(Integer, nullable=False)
