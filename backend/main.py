from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.services.db import init_db
from app.utils.cache import caching
from app.routes.auth import router as auth_route
from app.utils.limiter import limiter
from app.routes.viwes import view_router as view_routes
from dotenv import load_dotenv
import os

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL")
RUST_SEARCH_URL = os.getenv("RUST_SEARCH_URL")

app = FastAPI(lifespan=caching)

app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler,
)

init_db(app)


origins = [FRONTEND_URL, RUST_SEARCH_URL]

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Or  specify: ["GET", "POST", "PUT", "DELETE"]
    allow_headers=["*"],
)

app.include_router(auth_route, prefix="/auth", tags=["Authentication"])
app.include_router(view_routes, prefix="/bible", tags=["views"])
