from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from routers import users, products
from auth import authentication

app = FastAPI()
app.include_router(users.router)
app.include_router(products.router)
app.include_router(authentication.router)

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
