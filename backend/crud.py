import math
from typing import List, Type

from fastapi import Query, HTTPException, status
from sqlalchemy import inspect, column
from sqlalchemy.orm import Session

import models
from hash import Hash
from schemas.orders import OrderCreate, PaymentResult
from schemas.product import ProductEdit
from schemas.review import ReviewCreate
from schemas.user import ProfileUpdate, UserUpdate, UserRegister


def object_as_dict(obj):
    return {c.key: getattr(obj, c.key)
            for c in inspect(obj).mapper.column_attrs}


def filtration(query: Query, keyword: str = ''):
    if keyword:
        return query.filter(models.Product.name.like(f'%{keyword}%'))
    return query


def pagination(query: Query, skip: int = 0, limit: int = 100):
    return query.offset(skip).limit(limit)


def get_paginated_items(items: Query, skip: int = 0, limit: int = 100):
    items_count = items.count()
    items_paginated = pagination(items, skip, limit).all()
    pages = 1 if (items_count <= limit) else math.ceil(items_count / limit)
    return items_paginated, pages


def add_count_reviews(products: List[models.Product] | Type[models.Product] | None):
    if isinstance(products, list):
        for item in products:
            item.numReviews = len(item.reviews)
    elif products is None:
        products.numReviews = 0
    else:
        products.numReviews = len(products.reviews)


def get_products(db: Session, skip: int = 0, limit: int = 100, keyword: str = ''):
    products_filtered = filtration(db.query(models.Product), keyword=keyword)
    products_count = products_filtered.count()
    products_paginated = pagination(products_filtered, skip, limit).all()
    pages = 1 if (products_count <= limit) else math.ceil(products_count / limit)
    add_count_reviews(products=products_paginated)
    return dict(products=products_paginated, pages=pages)


def get_product(db: Session, product_id: int):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    add_count_reviews(products=product)
    return product


def create_product(db: Session, creator_id: int):
    new_product = models.Product(
        name='Наименование',
        image='images/sample.jpg',
        brand='Бренд',
        category='Категория',
        description='Описание',
        rating=0,
        price=0,
        countInStock=0,
        creator_id=creator_id
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


def edit_product(db: Session, new_product: ProductEdit):
    update_data = new_product.dict()
    db.query(models.Product).filter(models.Product.id == new_product.id).update(update_data)
    db.commit()
    return get_product(db, product_id=new_product.id)


def create_review(db: Session, review: ReviewCreate, product_id: int, creator_id: id):
    new_review = {**review.dict(), 'product_id': product_id, 'creator_id': creator_id}
    db_review = models.Review(**new_review)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)


def create_user(db: Session, user: UserRegister):
    new_user = models.User(
        name=user.name,
        email=user.email,
        password=Hash.bcrypt(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_all_users(db: Session):
    return db.query(models.User).all()


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'User with email {email} not found')
    return user


def update_user(db: Session, user_id: int, new_user: ProfileUpdate | UserUpdate):
    update_data = new_user.dict(exclude_unset=True)
    if 'password' in update_data:
        new_password = Hash.bcrypt(update_data['password'])
        update_data.update({'password': new_password})
    db.query(models.User).filter(models.User.id == user_id).update(update_data)
    db.commit()
    return get_user(db, user_id)


def create_shipping_address(db: Session, address: str, city: str, country: str, postal_code: int):
    new_shipping_address = models.Shipping_Address(
        address=address,
        city=city,
        postal_code=postal_code,
        country=country,
    )

    db.add(new_shipping_address)
    db.commit()
    db.refresh(new_shipping_address)
    return new_shipping_address


def create_order(
        db: Session, items_price: float, shipping_price: float, total_price: float, user_id: int,
        shipping_address_id: id, payment_id: id):
    new_order = models.Order(
        items_price=items_price,
        shipping_price=shipping_price,
        total_price=total_price,
        user_id=user_id,
        shipping_address_id=shipping_address_id,
        payment_id=payment_id
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order


def create_payment_details(db: Session, provider_name: str = 'paypal'):
    provider = db.query(models.Payment_Provider) \
        .filter(models.Payment_Provider.name == provider_name).first()
    provider_id = 1 if (provider is None) else provider.id

    new_payment_details = models.Payment_Details(provider_id=provider_id)

    db.add(new_payment_details)
    db.commit()
    db.refresh(new_payment_details)
    return new_payment_details


def get_payment_name(db: Session, provider_id: int):
    order = db.query(models.Payment_Provider) \
        .filter(models.Payment_Provider.id == provider_id).first()
    return order


def add_order(db: Session, order_details: OrderCreate, user_id):
    new_shipping_address = create_shipping_address(
        db,
        address=order_details.shipping_address.address,
        city=order_details.shipping_address.city,
        postal_code=order_details.shipping_address.postal_code,
        country=order_details.shipping_address.country
    )

    new_payment_details = create_payment_details(db, provider_name=order_details.payment_method)

    new_order = create_order(
        db,
        items_price=order_details.items_price,
        shipping_price=order_details.shipping_price,
        total_price=order_details.total_price,
        user_id=user_id,
        shipping_address_id=new_shipping_address.id,
        payment_id=new_payment_details.id
    )

    for item in order_details.orderItems:
        new_order_item = models.Order_Item(
            quantity=item.quantity,
            product_id=item.productId,
            order_id=new_order.id
        )
        db.add(new_order_item)

    db.commit()
    return new_order


def get_order(db: Session, order_id: int):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    payment_name = order.payment_details.provider.name
    return {
        'id': order.id,
        'order_items': order.order_items,
        'user': order.user,
        'is_paid': order.is_paid,
        'is_delivered': order.is_delivered,
        'created_at': order.created_at,
        'shipping_price': order.shipping_price,
        'items_price': order.items_price,
        'total_price': order.total_price,
        'shipping_address': order.shipping_address,
        'payment_method': payment_name,
        'payment_details': order.payment_details
    }


def update_order_payment(db: Session, order_id: int, updates: PaymentResult):
    update_data = updates.dict(exclude_unset=True)
    order = db.query(models.Order).filter(models.Order.id == order_id)
    payment_result_id = order.value(column('payment_id'))
    db.query(models.Payment_Details).filter(models.Payment_Details.id == payment_result_id) \
        .update(update_data)
    order.update({'is_paid': True})
    db.commit()
    return get_order(db, order_id)


def get_orders(db: Session, skip: int = 0, limit: int = 100):
    orders = db.query(models.Order)
    orders_paginated, pages = get_paginated_items(items=orders, skip=skip, limit=limit)
    return {'orders': orders_paginated, 'pages': pages}


def get_my_orders(user_id: int, db: Session, skip: int = 0, limit: int = 100):
    orders = db.query(models.Order).filter(models.Order.user_id == user_id)
    orders_paginated, pages = get_paginated_items(items=orders, skip=skip, limit=limit)
    return {'orders': orders_paginated, 'pages': pages}
