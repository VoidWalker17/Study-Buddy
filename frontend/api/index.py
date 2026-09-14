from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import ml_routes

app = FastAPI(title="Study Buddy ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ml_routes.router)

@app.get("/")
def health_check():
    return {"status": "ok", "service": "study-buddy-ml"}
