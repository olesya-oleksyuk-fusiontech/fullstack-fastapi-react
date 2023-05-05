from pydantic import BaseModel, Field

class ShippingAddressDisplay(BaseModel):
    address: str
    city: str
    postal_code: int = Field(..., alias="postalCode")
    country: str

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
