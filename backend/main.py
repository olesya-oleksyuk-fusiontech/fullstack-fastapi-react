from typing import Optional, List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette import status

import models
import schemas
import crud
from auth import oauth2
from database import SessionLocal
from fastapi.middleware.cors import CORSMiddleware

from hash import Hash

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

@app.post('/token')
def get_token(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.name == request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid credentials")
    if not Hash.verify(user.password, request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incorrect password")

    access_token = oauth2.create_access_token(data={'sub': user.name})

    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'user_id': user.id,
        'name': user.name,
        'password': user.password,
        'isAdmin': user.isAdmin,
    }

@app.post("/products", response_model=schemas.Product, tags=['products'])
def create_product(
        item: schemas.Product, db: Session = Depends(get_db)
):
    return crud.create_product(db=db, item=item)


@app.post("/users", response_model=schemas.UserRegister, tags=['users'])
def create_user(
        user: schemas.UserRegister, db: Session = Depends(get_db)
):
    return crud.create_user(db=db, user=user)


@app.get('/users', response_model=List[schemas.UserDisplay], tags=['users'])
def get_all_users(db: Session = Depends(get_db)):
    return crud.get_all_users(db)


@app.get('/users/{user_id}', response_model=schemas.UserDisplay, tags=['users'])
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User is not found")
