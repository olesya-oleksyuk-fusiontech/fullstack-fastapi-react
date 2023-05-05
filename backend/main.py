import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from fastapi.staticfiles import StaticFiles

from auth import authentication
from routers import users, products, uploads, orders

app = FastAPI(title="Candyshop", root_path="/api", docs_url=None, openapi_url=None)
app.include_router(users.router)
app.include_router(products.router)
app.include_router(authentication.router)
app.include_router(uploads.router)
app.include_router(orders.router)

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


@app.get("/docs", include_in_schema=False)
async def get_documentation():
    return get_swagger_ui_html(openapi_url="/openapi.json", title="Swagger")


@app.get("/openapi.json", include_in_schema=False)
async def openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(title=app.title, version=app.version, routes=app.routes)
    app.openapi_schema = openapi_schema
    return app.openapi_schema



app.mount('/images', StaticFiles(directory='images'), name='images')

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
