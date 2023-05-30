from typing import List

from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session

import crud
from auth import oauth2
from auth.oauth2 import oauth2_schema
from database import get_db
from schemas.user import User, UserToRegister, UserDetails, ProfileUpdate, UserUpdate, UserRegistered

router = APIRouter(
    prefix='/users',
    tags=['users']
)


@router.get('', response_model=List[UserDetails])
def get_all_users(
        db: Session = Depends(get_db),
        current_user: User = Depends(oauth2.get_current_user)):
    if not current_user.isAdmin:
        raise HTTPException(status_code=403, detail="No permission. Admins only")
    return crud.get_all_users(db)


@router.post('')
def register_user(
        user: UserToRegister, db: Session = Depends(get_db)
) -> UserRegistered:
    new_user = crud.create_user(db=db, user=user)
    access_token = oauth2.create_access_token(data={'sub': user.email})
    new_user.token_type = 'bearer'
    new_user.access_token = access_token
    return new_user


@router.get('/profile', response_model=UserDetails)
def get_user(
        db: Session = Depends(get_db),
        current_user: User = Depends(oauth2.get_current_user)
) -> UserDetails:
    db_user = crud.get_user(db, current_user.id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User is not found")
    return db_user


@router.patch("/profile")
async def update_user(user: ProfileUpdate,
                      db: Session = Depends(get_db),
                      current_user: User = Depends(oauth2.get_current_user)
                      ) -> UserDetails:
    updated_user = crud.update_user(db, current_user.id, user)
    return updated_user


@router.patch("/{user_id}")
async def update_user(user: UserUpdate,
                      user_id: int,
                      db: Session = Depends(get_db),
                      current_user: User = Depends(oauth2.get_current_user)) -> UserDetails:
    if not current_user.isAdmin:
        raise HTTPException(status_code=403, detail="No permission. Admins only")
    updated_user = crud.update_user(db, user_id, user)
    return updated_user


@router.get('/{user_id}', response_model=UserDetails)
def get_user(user_id: int,
             db: Session = Depends(get_db),
             current_user: User = Depends(oauth2.get_current_user)
             ):
    if not current_user.isAdmin:
        raise HTTPException(status_code=403, detail="No permission. Admins only")
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User is not found")
    return db_user
