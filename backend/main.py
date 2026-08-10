from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.db import init_db
from app.routes.auth import router as auth_route

from app.routes.viwes import view_router as view_routes

app = FastAPI()

init_db(app)

origins = ["http://localhost:5173"]

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Specific origins (never use ["*"] with cookies)
    allow_credentials=True,  # 👈 Required for cookies to work
    allow_methods=["*"],  # Or specify: ["GET", "POST", "PUT", "DELETE"]
    allow_headers=["*"],
)

app.include_router(auth_route, prefix="/auth", tags=["Authentication"])
app.include_router(view_routes, prefix="/bible", tags=["views"])
