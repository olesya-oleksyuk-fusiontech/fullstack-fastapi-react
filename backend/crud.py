import math

from fastapi import Query, HTTPException, status
from sqlalchemy import inspect
from sqlalchemy.orm import Session

import models
import schemas
from hash import Hash


def object_as_dict(obj):
    return {c.key: getattr(obj, c.key)
            for c in inspect(obj).mapper.column_attrs}


def filtration(query: Query, keyword: str = ''):
    if keyword:
        return query.filter(models.Product.name.like(f'%{keyword}%'))
    return query


def pagination(query: Query, skip: int = 0, limit: int = 100):
    return query.offset(skip).limit(limit)


def get_products(db: Session, skip: int = 0, limit: int = 100, keyword: str = ''):
    products_filtered = filtration(db.query(models.Product), keyword=keyword)
    products_count = products_filtered.count()
    products_paginated = pagination(products_filtered, skip, limit)
    pages = 1 if (products_count <= limit) else math.ceil(products_count / limit)
    return dict(products=products_paginated.all(), pages=pages)


def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def create_product(db: Session, item: schemas.Product):
    db_product = models.Product(**item.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def create_review(db: Session, review: schemas.ReviewCreate, product_id: int, creator_id: id):
    new_review = {**review.dict(), 'product_id': product_id, 'creator_id': creator_id}
    db_review = models.Review(**new_review)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)


def create_user(db: Session, user: schemas.UserRegister):
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


def update_user(db: Session, id: int, new_user: schemas.UserUpdate):
    update_data = new_user.dict(exclude_unset=True)
    if 'password' in update_data:
        new_password = Hash.bcrypt(update_data['password'])
        update_data.update({'password': new_password})
    db.query(models.User).filter(models.User.id == id).update(update_data)
    db.commit()
    return get_user(db, id)
