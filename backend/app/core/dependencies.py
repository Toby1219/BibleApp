from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

from app.core.security import decode_token
from app.models.models import User

bearer_scheme = HTTPBearer(auto_error=False)

credentials_excepton = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not vlaidate cedentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def validate_token(token: str, exception):
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise exception
        user_id: int = payload.get("sub")
        if user_id is None:
            raise exception
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has Expired",
        )
    except jwt.PyJWTError:
        raise exception
    return user_id


async def check_http_cookies(request: Request, exception, tokenType="access_token"):
    token = request.cookies.get(tokenType)
    if not token:
        return None
    return validate_token(token, exception)


async def check_credentials(credentials, exception):
    if not credentials:
        return None
    return validate_token(credentials.credentials, exception)


async def get_current_user(
    request: Request, credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
) -> User:

    user_id = await check_http_cookies(request, credentials_excepton)
    if user_id is None:
        user_id = await check_credentials(credentials, credentials_excepton)

    if user_id is None:
        raise credentials_excepton

    user = await User.get_or_none(id=int(user_id))
    if user is None or not user.is_active:
        raise credentials_excepton
    return user


async def get_current_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user
