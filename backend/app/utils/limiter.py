from slowapi import Limiter
from slowapi.util import get_remote_address
from dotenv import load_dotenv
import os

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")

limiter = Limiter(key_func=get_remote_address, storage_uri=REDIS_URL)
