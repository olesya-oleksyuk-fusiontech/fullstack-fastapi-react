from typing import List

from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session

import schemas
import crud
from auth import oauth2
from database import get_db


router = APIRouter(
    prefix='/users',
    tags=['users']
)


@router.get('', response_model=List[schemas.UserDisplay], tags=['users'])
def get_all_users(db: Session = Depends(get_db)):
    return crud.get_all_users(db)


@router.get('/profile', response_model=schemas.UserDetails, tags=['users'])
def get_user(
        db: Session = Depends(get_db),
        current_user: schemas.User = Depends(oauth2.get_current_user)
):
    db_user = crud.get_user(db, current_user.id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User is not found")
    return {
        '_id': db_user.id,
        'name': db_user.name,
        'email': db_user.email,
        'isAdmin': db_user.isAdmin,
    }


@router.patch("/profile",
              # response_model=schemas.UserDisplay,
              tags=['users'])
async def update_user(user: schemas.UserUpdate,
                      db: Session = Depends(get_db),
                      current_user: schemas.User = Depends(oauth2.get_current_user)):
    updated_user = crud.update_user(db, current_user.email, user)
    return {
        token: token
        **updated_user
    }


@router.get('/{user_id}', response_model=schemas.UserDisplay, tags=['users'])
def get_user(user_id: int,
             db: Session = Depends(get_db),
             current_user: schemas.User = Depends(oauth2.get_current_user)
             ):
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User is not found")
