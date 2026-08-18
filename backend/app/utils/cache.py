from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache import FastAPICache
from redis.asyncio import Redis
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response

@asynccontextmanager
async def caching(app: FastAPI):
    redis = Redis(host="localhost", port=6379, db=0)
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
    yield
    
    await redis.aclose()


def custom_key_builder(func, namespace, request: Request, response: Response, *args, **kwargs):
    return f"{namespace}:{request.url.path}"