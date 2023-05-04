from typing import List

from pydantic import BaseModel, Field

from .product import ProductEdit
from .shipping_address import ShippingAddressDisplay
from .user import UserDetails


class OrderItem(BaseModel):
    quantity: int
    product: ProductEdit

    class Config:
        orm_mode = True


class OrderItemCreate(BaseModel):
    quantity: int
    productId: int


class OrderBase(BaseModel):
    shipping_price: float = Field(..., alias="shippingPrice")
    items_price: float = Field(..., alias="itemsPrice")
    total_price: float = Field(..., alias="totalPrice")
    shipping_address: ShippingAddressDisplay = Field(..., alias="shippingAddress")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True


class OrderDisplay(OrderBase):
    id: int
    order_items: List[OrderItem] = Field(..., alias="orderItems")
    user: UserDetails
    is_paid: bool = Field(..., alias="isPaid")
    is_delivered: bool = Field(..., alias="isDelivered")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True


class OrderCreate(OrderBase):
    orderItems: List[OrderItemCreate]
    paymentMethod: str

    class Config:
        orm_mode = True
