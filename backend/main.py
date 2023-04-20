from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

import models
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
