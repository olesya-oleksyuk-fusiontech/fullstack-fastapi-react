from sqlalchemy.orm import Session

import models
import schemas


def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()


def count_products(db: Session):
    return db.query(models.Product).count()


def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()


def get_products_by_name(db: Session, skip: int = 0, limit: int = 100, keyword: str = ''):
    print(keyword)
    return db.query(models.Product).filter(models.Product.name.like(f'{keyword}%')).offset(skip).limit(limit).all()


def create_product(db: Session, item: schemas.Product):
    db_product = models.Product(**item.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

