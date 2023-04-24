from typing import Optional

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
import crud
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware

# models.Base.metadata.create_all(bind=engine)
app = FastAPI()


# an independent database session/connection per request
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


@app.get("/products", response_model=schemas.ProductsDisplay, tags=['products'])
def read_products(page: int = 1, keyword: Optional[str] = None, db: Session = Depends(get_db)):
    page_size = 8
    response = crud.get_products(db, skip=page_size * (page - 1), limit=page_size, keyword=keyword)
    response.update({"page": page})
    return response


@app.get("/products/{product_id}", response_model=schemas.Product, tags=['products'])
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


@app.post("/products", response_model=schemas.Product, tags=['products'])
def create_product(
        item: schemas.Product, db: Session = Depends(get_db)
):
    return crud.create_product(db=db, item=item)
