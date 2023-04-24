from fastapi import Query
from sqlalchemy.orm import Session

import models
import schemas


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
    pages = 1 if (products_count <= limit) else products_count / limit
    return dict(products=products_paginated.all(), pages=pages)


def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def create_product(db: Session, item: schemas.Product):
    db_product = models.Product(**item.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
