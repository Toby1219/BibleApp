from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache import FastAPICache
from redis.asyncio import Redis
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response

import json
import hashlib

from typing import Any
from ..models.models import User

@asynccontextmanager
async def caching(app: FastAPI):
    redis = Redis(host="localhost", port=6379, db=0)

    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
    yield
    
    await redis.aclose()

def _serilize(value: Any):
    if isinstance(value, User):
        return{"user_id": value.id}
    
    if hasattr(value, "model_dump"):
        return value.model_dump(mode="json")
    
    if isinstance(value, dict):
        return{str(key): _serilize(val) for key, val in sorted(value.items())}
    
    if isinstance(value, (list, tuple)):
        return [_serilize(item) for item in value]
    
    return value

def custom_key_builder(func, namespace, request: Request, response: Response, *args, **kwargs):
    query = sorted(request.query_params.multi_items())
    data = {
        "method": request.method,
        "path": request.url.path,
        "query": query,
        "args": _serilize(args or ()),
        "kwargs": _serilize(kwargs or ())
    }
    raw = json.dumps(data, sort_keys=True, separators=(",", ":"), default=str)  
    digest = hashlib.sha256(raw.encode()).hexdigest()
    
    return f"{namespace}:{digest}"