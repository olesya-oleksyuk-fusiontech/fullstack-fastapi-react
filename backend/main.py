from typing import List
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
import crud
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)
app = FastAPI()


# an independent database session/connection per request,
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


origins = ['http://localhost:3000', "localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/products/", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = crud.get_products(db, skip=skip, limit=limit)
    return products


@app.get("/products/{product_id}", response_model=schemas.Product)
def read_user(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


@app.post("/products/", response_model=schemas.Product)
def create_product(
        item: schemas.Product, db: Session = Depends(get_db)
):
    return crud.create_product(db=db, item=item)
