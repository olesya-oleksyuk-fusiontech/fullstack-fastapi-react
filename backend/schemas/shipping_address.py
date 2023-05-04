from pydantic import BaseModel


class ShippingAddress(BaseModel):
    address: str
    city: str
    postal_code: int
    country: str

    class Config:
        orm_mode = True


class ShippingAddressOrderCreate(BaseModel):
    address: str
    city: str
    postalCode: int
    country: str

    class Config:
        orm_mode = True