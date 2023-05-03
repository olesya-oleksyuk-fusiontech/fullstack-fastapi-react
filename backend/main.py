import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from auth import authentication
from routers import users, products, uploads

app = FastAPI(root_path="/api")
app.include_router(users.router)
app.include_router(products.router)
app.include_router(authentication.router)
app.include_router(uploads.router)

origins = ['http://localhost:3000', "localhost:3000", 'http://localhost:3001', 'localhost:3001']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def read_root(request: Request):
    return {"message": "Hello World", "root_path": request.scope.get("root_path")}


app.mount('/images', StaticFiles(directory='images'), name='images')

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
