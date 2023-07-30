from fastapi import FastAPI
from routers import drivers, circuits, news, home, races, constructors
from fastapi.middleware.cors import CORSMiddleware
from settings.config import *

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

routers = [drivers.router, circuits.router, news.router, home.router, races.router, constructors.router]
for router in routers:
    app.include_router(router) 