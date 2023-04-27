from fastapi import APIRouter, HTTPException, status
from fastapi.param_functions import Depends
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm.session import Session
from starlette.responses import RedirectResponse

import models
from auth import oauth2
from database import get_db
from hash import Hash

router = APIRouter(
    tags=['authentication']
)


@router.post('/token', tags=['users'])
def login():
    response = RedirectResponse(url='/login')
    return response


@router.post('/login', tags=['users'])
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid credentials")
    if not Hash.verify(user.password, request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incorrect password")

    access_token = oauth2.create_access_token(data={'sub': user.email})

    return {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'isAdmin': user.isAdmin,
        'access_token': access_token,
        'token_type': 'bearer',
    }
