from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routers import deals, stores


app = FastAPI(title="SuperDeal API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(deals.router)
app.include_router(stores.router)

@app.get("/")
def root():
    return {"status": "ok", "message": "SuperDeal API running"}