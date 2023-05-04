from typing import List

from pydantic import BaseModel

from .product import ProductEdit
from .shipping_address import ShippingAddress, ShippingAddressOrderCreate
from .user import UserDetails


class OrderItem(BaseModel):
    quantity: float
    product: ProductEdit

    class Config:
        orm_mode = True


class OrderItemInOrderCreate(BaseModel):
    quantity: int
    productId: int


class OrderCreate(BaseModel):
    # id: int
    items_price: float
    total_price: float
    # is_paid: bool
    # is_delivered: bool

    user: UserDetails
    shipping_address: ShippingAddress
    order_items: List[OrderItem]

    class Config:
        orm_mode = True


class OrderDisplay(OrderCreate):
    id: int
    is_paid: bool
    is_delivered: bool

    class Config:
        orm_mode = True


class OrderCreateDetails(BaseModel):
    orderItems: List[OrderItemInOrderCreate]
    shippingAddress: ShippingAddressOrderCreate
    paymentMethod: str
    itemsPrice: float
    shippingPrice: float
    totalPrice: float

    class Config:
        orm_mode = True
