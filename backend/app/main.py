from fastapi import FastAPI
import uvicorn
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8888, reload=True)
    