from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from constants import Product_info
from core.config import settings
from schemas.user import User
from tests.utils.product import create_random_product


def test_get_all_products(
        client: TestClient,
        superuser_token_headers: dict,
        get_superuser: User,
        session: Session,
) -> None:
    admin_id = get_superuser.id
    create_random_product(session=session, creator_id=admin_id)
    create_random_product(session=session, creator_id=admin_id)

    r = client.get("/products")
    assert r.status_code == 200
    content = r.json()
    assert content["page"] == 1 and content["pages"] == 1, "Wrong pagination"
    products = content["products"]
    assert len(products) == 2, "Wrong number of products received"
    for item in products:
        assert item["name"] == Product_info.name, "Wrong name"
        assert item["brand"] == Product_info.brand, "Wrong brand"
        assert item["category"] == Product_info.category, "Wrong category"
        assert item["description"] == Product_info.description, "Wrong description"
        assert item["image"] == Product_info.image, "Wrong image path"
        assert item["rating"] == Product_info.rating, "Wrong rating"
        assert item["price"] == Product_info.price, "Wrong price"
        assert item["countInStock"] == Product_info.countInStock, "Wrong count in stock"
        assert item["numReviews"] == 0, "Wrong number of reviews"


def test_get_product(
        client: TestClient,
        superuser_token_headers: dict,
        get_superuser: User,
        session: Session,
) -> None:
    admin_id = get_superuser.id
    product = create_random_product(session=session, creator_id=admin_id)

    r = client.get(f"/products/{product.id}")
    assert r.status_code == 200
    product_received = r.json()

    assert product_received["name"] == Product_info.name, "Wrong name"
    assert product_received["brand"] == Product_info.brand, "Wrong brand"
    assert product_received["category"] == Product_info.category, "Wrong category"
    assert product_received["description"] == Product_info.description, "Wrong description"
    assert product_received["image"] == Product_info.image, "Wrong image path"
    assert product_received["rating"] == Product_info.rating, "Wrong rating"
    assert product_received["price"] == Product_info.price, "Wrong price"
    assert product_received["countInStock"] == Product_info.countInStock, "Wrong count in stock"
    assert product_received["numReviews"] == 0 and len(product_received["reviews"]) == 0, \
        "Wrong number of reviews"
    creator_info = product_received["creator"]
    assert creator_info["email"] == settings.FIRST_SUPERUSER_EMAIL and \
           creator_info["name"] == settings.FIRST_SUPERUSER_NAME, 'Wrong product creator data'
