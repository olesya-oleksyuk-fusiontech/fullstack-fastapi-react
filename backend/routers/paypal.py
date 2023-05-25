from fastapi import APIRouter

from config import PAYPAL_CLIENT_ID

router = APIRouter(
    prefix='/paypal',
    tags=['paypal']
)

@router.get("/config", response_model=str)
def get_paypal_client():
    return PAYPAL_CLIENT_ID
