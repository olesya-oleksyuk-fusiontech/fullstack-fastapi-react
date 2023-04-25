from typing import Optional, List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette import status
from starlette.responses import RedirectResponse

import models
import schemas
import crud
from auth import oauth2
from auth.oauth2 import oauth2_schema
from database import get_db
from fastapi.middleware.cors import CORSMiddleware

from hash import Hash

app = FastAPI()

origins = ['http://localhost:3000', "localhost:3000", 'http://localhost:3001', 'localhost:3001']

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


@app.get("/products", response_model=schemas.ProductDisplay, tags=['products'])
def read_products(page: int = 1, keyword: Optional[str] = None, db: Session = Depends(get_db)):
    page_size = 8
    response = crud.get_products(db, skip=page_size * (page - 1), limit=page_size, keyword=keyword)
    response.update({"page": page})
    return response


@app.post('/token', tags=['users'])
def login():
    response = RedirectResponse(url='/login')
    return response


@app.post('/login', tags=['users'])
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid credentials")
    if not Hash.verify(user.password, request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incorrect password")

    access_token = oauth2.create_access_token(data={'sub': user.email})

    return {
        'token': access_token,
        '_id': user.id,
        'name': user.name,
        'email': user.email,
        'isAdmin': user.isAdmin,
    }


@app.get("/products/{product_id}",
         response_model=schemas.Product,
         tags=['products'])
def read_product(product_id: int,
                 db: Session = Depends(get_db),
                 token: str = Depends(oauth2_schema)
                 ):
    oauth2.get_current_user(token, db)
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


@app.post("/products", response_model=schemas.Product, tags=['products'])
def create_product(
        item: schemas.Product, db: Session = Depends(get_db)
):
    return crud.create_product(db=db, item=item)


@app.post("/users",
          tags=['users'])
def register_user(
        user: schemas.UserRegister, db: Session = Depends(get_db)
):
    new_user = crud.create_user(db=db, user=user)
    access_token = oauth2.create_access_token(data={'sub': user.email})

    return {
        'token': access_token,
        '_id': new_user.id,
        'name': new_user.name,
        'email': new_user.email,
        'isAdmin': new_user.isAdmin,
    }


@app.get('/users', response_model=List[schemas.UserDisplay], tags=['users'])
def get_all_users(db: Session = Depends(get_db)):
    return crud.get_all_users(db)


@app.get('/users/{user_id}', response_model=schemas.UserDisplay, tags=['users'])
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User is not found")


