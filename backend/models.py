from sqlalchemy import ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.schema import Column
from sqlalchemy.types import String, Integer, Text, Numeric, DateTime
from database import Base
from datetime import datetime


class Review(Base):
    __tablename__ = 'review'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False)
    created_on = Column(DateTime(), default=datetime.utcnow)
    # product_id = Column(Integer(), ForeignKey('product.id'))
    # product_id = Column(Integer(), ForeignKey('product.id'))


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
    # created_on = Column(TIMESTAMP , default=datetime.utcnow)
    # created_on = Column(DateTime(), default=datetime.utcnow)
    # updated_on = Column(DateTime(), default=datetime.utcnow, onupdate=datetime.utcnow)
    # reviews = relationship('Review', backref='product')


class ProductCreate(Product):
    pass
