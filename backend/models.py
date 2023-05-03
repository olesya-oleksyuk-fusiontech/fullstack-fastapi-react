from sqlalchemy import ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.schema import Column
from sqlalchemy.types import String, Integer, Text, Numeric, DateTime, Boolean
from database import Base
from datetime import datetime

metadata = Base.metadata


class Review(Base):
    __tablename__ = 'review'
    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer, nullable=False)
    comment = Column(String(100))
    created_on = Column(DateTime(), default=datetime.utcnow)

    product_id = Column(Integer, ForeignKey("product.id"))
    creator_id = Column(Integer, ForeignKey("user.id"))
    product = relationship("Product", back_populates="reviews")
    owner = relationship("User", back_populates="reviews")


class Product(Base):
    __tablename__ = "product"
    # __allow_unmapped__ = True
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    image = Column(String(100), nullable=False)
    brand = Column(String(20), nullable=False)
    category = Column(String(20), nullable=False)
    description = Column(Text(), nullable=False)
    rating = Column(Integer)
    price = Column(Numeric, nullable=False)
    countInStock = Column(Integer, nullable=False)
    created_on = Column(TIMESTAMP, default=datetime.utcnow)

    reviews = relationship("Review", back_populates="product")
    creator_id = Column(Integer, ForeignKey("user.id"))
    creator = relationship("User", back_populates="products")


class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(50))
    email = Column(String(30))
    password = Column(String(200))
    isAdmin = Column(Boolean, default=False)
    isActive = Column(Boolean, default=True)
    createdAt = Column(TIMESTAMP, default=datetime.utcnow)
    updatedAt = Column(TIMESTAMP, default=datetime.utcnow)

    reviews = relationship('Review', backref='user')
    products = relationship("Product", back_populates="creator")
