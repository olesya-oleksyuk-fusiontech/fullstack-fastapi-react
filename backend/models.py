from datetime import datetime

from sqlalchemy import ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.schema import Column
from sqlalchemy.types import String, Integer, Text, Numeric, DateTime, Boolean

from database import Base

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
    orders = relationship("Order_Item", back_populates="product")


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
    orders = relationship("Order", back_populates="user")


class Order(Base):
    __tablename__ = "order"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    items_price = Column(Numeric, nullable=False)
    total_price = Column(Numeric, nullable=False)
    shipping_price = Column(Numeric, default=0)
    is_paid = Column(Boolean, default=False)
    is_delivered = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    delivered_at = Column(TIMESTAMP, nullable=True)

    user_id = Column(Integer, ForeignKey("user.id"))
    shipping_address_id = Column(Integer, ForeignKey("shipping_address.id"))

    user = relationship("User", back_populates="orders")
    shipping_address = relationship("Shipping_Address", back_populates="orders")
    order_items = relationship("Order_Item", back_populates="order")

    payment_id = Column(Integer, ForeignKey("payment_details.id"))
    payment_details = relationship("Payment_Details", back_populates="order", uselist=False)


class Order_Item(Base):
    __tablename__ = "order_item"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    quantity = Column(Integer, nullable=False)

    order_id = Column(Integer, ForeignKey("order.id"))
    product_id = Column(Integer, ForeignKey("product.id"))
    order = relationship("Order", back_populates='order_items')
    product = relationship("Product", back_populates="orders")


class Shipping_Address(Base):
    __tablename__ = "shipping_address"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    address = Column(String(50), nullable=False)
    city = Column(String(30), nullable=False)
    postal_code = Column(Integer, nullable=False)
    country = Column(String(30), nullable=False)

    orders = relationship("Order", back_populates="shipping_address")


class Payment_Details(Base):
    __tablename__ = "payment_details"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    payment_result_id = Column(String(50), index=True)
    status = Column(String(50))
    update_time = Column(DateTime(), default=datetime.utcnow, nullable=False)
    create_time = Column(DateTime(), default=datetime.utcnow, nullable=False)
    email_address = Column(String(50))

    order = relationship("Order", back_populates="payment_details", uselist=False)
    provider_id = Column(Integer, ForeignKey("payment_provider.id"), nullable=False)
    provider = relationship("Payment_Provider", back_populates="orders_payment_details")

class Payment_Provider(Base):
    __tablename__ = "payment_provider"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(50), nullable=False, default="unknown")

    orders_payment_details = relationship("Payment_Details", back_populates="provider")