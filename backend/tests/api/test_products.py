from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

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
        assert item["name"] == "Наименование", "Wrong name"
        assert item["brand"] == "Бренд", "Wrong brand"
        assert item["category"] == "Категория", "Wrong category"
        assert item["description"] == "Описание", "Wrong description"
        assert item["image"] == "images/sample.jpg", "Wrong image path"
        assert item["rating"] == 0, "Wrong rating"
        assert item["price"] == 0, "Wrong price"
        assert item["countInStock"] == 0, "Wrong count in stock"
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

    assert product_received["name"] == "Наименование", "Wrong name"
    assert product_received["brand"] == "Бренд", "Wrong brand"
    assert product_received["category"] == "Категория", "Wrong category"
    assert product_received["description"] == "Описание", "Wrong description"
    assert product_received["image"] == "images/sample.jpg", "Wrong image path"
    assert product_received["rating"] == 0, "Wrong rating"
    assert product_received["price"] == 0, "Wrong price"
    assert product_received["countInStock"] == 0, "Wrong count in stock"
    assert product_received["numReviews"] == 0 and len(product_received["reviews"]) == 0,\
        "Wrong number of reviews"
    creator_info = product_received["creator"]
    assert creator_info["email"] == settings.FIRST_SUPERUSER_EMAIL and \
           creator_info["name"] == settings.FIRST_SUPERUSER_NAME, 'Wrong product creator data'