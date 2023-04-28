from typing import List

from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session

import crud
from auth import oauth2
from auth.oauth2 import oauth2_schema
from database import get_db
from schemas.user import User, UserRegister, UserDetails, ProfileUpdate, UserUpdate

router = APIRouter(
    prefix='/users',
    tags=['users']
)


@router.get('', response_model=List[UserDetails])
def get_all_users(db: Session = Depends(get_db)):
    return crud.get_all_users(db)


@router.post('')
def register_user(
        user: UserRegister, db: Session = Depends(get_db)
):
    new_user = crud.create_user(db=db, user=user)
    access_token = oauth2.create_access_token(data={'sub': user.email})

    return {
        'id': new_user.id,
        'name': new_user.name,
        'email': new_user.email,
        'isAdmin': new_user.isAdmin,
        'access_token': access_token,
        'token_type': 'bearer',
    }


@router.get('/profile', response_model=UserDetails)
def get_user(
        db: Session = Depends(get_db),
        current_user: User = Depends(oauth2.get_current_user)
):
    db_user = crud.get_user(db, current_user.id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User is not found")
    return {
        'id': db_user.id,
        'name': db_user.name,
        'email': db_user.email,
        'isAdmin': db_user.isAdmin,
    }


@router.patch("/profile")
async def update_user(user: ProfileUpdate,
                      db: Session = Depends(get_db),
                      current_user: User = Depends(oauth2.get_current_user),
                      token: str = Depends(oauth2_schema)):
    updated_user = crud.update_user(db, current_user.id, user)
    return {
        'id': updated_user.id,
        'name': updated_user.name,
        'email': updated_user.email,
        'isAdmin': updated_user.isAdmin,
        'access_token': token,
        'token_type': 'bearer',
    }


@router.patch("/{user_id}")
async def update_user(user: UserUpdate,
                      db: Session = Depends(get_db),
                      current_user: User = Depends(oauth2.get_current_user)):
    updated_user = crud.update_user(db, user.id, user)
    return {
        'id': updated_user.id,
        'name': updated_user.name,
        'email': updated_user.email,
        'isAdmin': updated_user.isAdmin,
    }


@router.get('/{user_id}', response_model=UserDetails)
def get_user(user_id: int,
             db: Session = Depends(get_db),
             current_user: User = Depends(oauth2.get_current_user)
             ):
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User is not found")
    return db_user
