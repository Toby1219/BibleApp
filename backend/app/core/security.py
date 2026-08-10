"""
Docstring for app.security
This is the core of the auth system — password hashing and JWT creation/verification.

"""
import jwt
from datetime import datetime, timedelta, timezone
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher

from app.config import settings

# --- Password hashing with pwdlib + Argon2 ---
password_hash = PasswordHash([Argon2Hasher()])

def hash_password(plain_password:str) -> str:
    return password_hash.hash(plain_password)

def verify_password(plain_pasword:str, hashed_password:str) ->  bool:
    return password_hash.verify(plain_pasword, hashed_password)


# --- JWT token creation ---
def create_access_token(data:dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp":expire, "type":"access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp":expire, "type":"refresh"})
    return jwt.encode(to_encode, key=settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token:str) -> dict:
    return jwt.decode(token, key=settings.SECRET_KEY, algorithms=settings.ALGORITHM)

