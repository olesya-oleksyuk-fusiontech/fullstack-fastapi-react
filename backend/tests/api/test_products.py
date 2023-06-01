from operator import attrgetter
from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

import crud
from constants import Product_info
from core.config import settings
from schemas.product import ProductEdit, Product
from schemas.user import User
from tests.utils.product import create_random_product


def test_get_all_products(
        client: TestClient,
        superuser_token_headers: dict,
        get_superuser: User,
        session: Session,
) -> None:
    admin_id = get_superuser.id
    create_random_product(session=session, client=client, creator_id=admin_id)
    create_random_product(session=session, client=client, creator_id=admin_id)

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
    product = create_random_product(session=session, client=client, creator_id=admin_id)

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


def test_change_product_info(
        client: TestClient,
        superuser_token_headers: dict,
        get_superuser: User,
        session: Session,
        normal_user_token_headers: Dict[str, str]
) -> None:
    admin_id = get_superuser.id
    product = create_random_product(session=session, client=client, creator_id=admin_id)
    name_old, price_old, countInStock_old = attrgetter('name', 'price', 'countInStock')(product)

    product_old = crud.get_product(db=session, product_id=product.id)
    product_updates = ProductEdit(
        id=product.id,
        name='new name',
        price=14.2,
        countInStock=50)
    r = client.patch(f"/products/{product.id}", headers=superuser_token_headers,
                     json=product_updates.dict(exclude_none=True))
    product_updated = r.json()

    assert product_updated['updated_on']
    assert name_old != product_updated["name"]
    assert price_old != product_updated["price"]
    assert countInStock_old != product_updated["countInStock"]
    assert product_old.id == product_updated["id"]
    assert product_old.brand == product_updated["brand"]

    r = client.patch(f"/products/{product.id}", headers=normal_user_token_headers,
                     json=product_updates.dict(exclude_none=True))
    assert r.status_code == 403, 'Non-admin has access to change product info'


def test_create_product_review(
        client: TestClient,
        db_with_product: Product,
        normal_user_token_headers: Dict[str, str],
        session: Session,
) -> None:
    assert len(db_with_product.reviews) == 0, "There should be no reviews for a new product"

    review = {
        "rating": 5,
        "comment": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
    }

    r = client.post(f"/products/{db_with_product.id}/reviews", headers=normal_user_token_headers,
                    json=review)

    review_created = r.json()

    r = client.get(f"/products/{db_with_product.id}")
    product_with_review = r.json()

    assert product_with_review['reviews'], 'No review found'
    assert len(product_with_review['reviews']) == 1, 'Wrong reviews number'
    review_received = product_with_review['reviews'][0]
    review_owner = crud.get_user_by_email(db=session, email=settings.TEST_USER_EMAIL)

    assert review_received['rating'] == review['rating'], 'Wrong rating'
    assert review_received['comment'] == review['comment'], 'Wrong comment'
    assert review_received['created_on'], 'No created on timestamp is found'
    assert review_received['owner'], 'No review owner is found'
    assert review_received['owner']['name'] == review_owner.name, 'Wrong reviewer name'

    incorrect_review = {
        "rating": 1000,
        "comment": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
    }

    r = client.post(f"/products/{db_with_product.id}/reviews", headers=normal_user_token_headers,
                    json=incorrect_review)
    response = r.json()
    assert response["detail"][0]["msg"] == 'ensure this value is less than or equal to 5'
    print(response)
