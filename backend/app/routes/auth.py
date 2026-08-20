from fastapi import APIRouter, HTTPException, status, Depends, Response, Request
from typing import Dict
import jwt
from fastapi_cache.decorator import cache
from app.models.models import User, SearchHistory, UserBookMark
from app.models.bible_models import BibleContent
from app.schemas.schema import (
    Token,
    UserCreate,
    UserPrivateResponse,
    UserRegisterResponse,
    UserLogin,
    UserAdminresponse,
    UserBookmarkResponse,
    BookMarkSchema,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.dependencies import get_current_user
from ..utils.cache import custom_key_builder
from ..utils.limiter import limiter

router = APIRouter()

@router.post(
    "/register", response_model=UserRegisterResponse, status_code=status.HTTP_201_CREATED
)
@limiter.limit("2/minute")
async def register(request: Request, payload: UserCreate):
    # Check for existing user
    if await User.filter(username=payload.username).exists():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken"
        )
    if await User.filter(email=payload.email).exists():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    user = await User.create(
        username=payload.username,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    return UserRegisterResponse.model_validate(user, from_attributes=True)


@router.post("/login", response_model=Token)
@limiter.limit("2/minute")
async def login(request: Request, response: Response, payload: UserLogin):
    user: User = await User.get_or_none(email=payload.email)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    token_data = {"sub": str(user.id), "username": user.username, "email": user.email}
    access_token = create_access_token(token_data)
    refresh_token_ = create_refresh_token(token_data)

    # Set Cookies for https Auth
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # Set true for production
        samesite="lax",
        max_age=86400,
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token_,
        httponly=True,
        secure=False,  # Set true for production
        samesite="lax",
        max_age=86400,
    )

    return Token(
        access_token=access_token,
        refresh_token=refresh_token_,
    )


@router.post("/refresh", response_model=Token)
@limiter.limit("2/minute")
async def refresh_token(
    response: Response, request: Request, refresh_token: str = None
):

    if refresh_token is None:
        refresh_token = request.cookies.get("refresh_token")

    if refresh_token is None:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type"
            )
        user_id = payload.get("sub")
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired"
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )

    user = await User.get_or_none(id=int(user_id))
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    token_data = {"sub": str(user.id), "username": user.username}

    new_access_token = create_access_token(token_data)
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=False,  # Set true for production
        samesite="lax",
        max_age=86400,
    )
    return Token(
        access_token=new_access_token,
        refresh_token=create_refresh_token(token_data),
    )


@router.get("/me", response_model=UserPrivateResponse)
@limiter.limit("2/minute")
async def get_me(request: Request, current_user: User = Depends(get_current_user)):
    
    if current_user.is_superuser:
        return UserAdminresponse.model_validate(current_user, from_attributes=True)
    
    search_history = await SearchHistory.filter(user=current_user).all()
    
    needed_ids = {h.book_id for h in search_history}
    books_by_id = {}
    if needed_ids:
        books = await BibleContent.filter(id__in=needed_ids).prefetch_related("passage")
        books_by_id = {b.id:b for b in books}
           
    search_history_book = [
        {
            "phrase": h.pharse,
            "book": f"{books_by_id[h.book_id].passage.name} {books_by_id[h.book_id].chapter}:{books_by_id[h.book_id].verse}",
            "created_at": h.created_at,
        }
        for h in search_history
        if h.book_id in books_by_id
    ]
    
    return UserPrivateResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        created_at=current_user.created_at,
        search_count=len(search_history),
        search_history=search_history_book
    )



@router.get("/bookmark", response_model=UserBookmarkResponse)
@limiter.limit("2/minute")
@cache(expire=600, key_builder=custom_key_builder)
async def get_bookmarks(request: Request, current_user: User= Depends(get_current_user)):
    bookmark = await UserBookMark.filter(user=current_user).all()
    
    needed_id = {b.book_id for b in bookmark}
    books_by_id = {}
    if needed_id:
        books = await BibleContent.filter(id__in=needed_id).prefetch_related("passage")
        books_by_id = {b.id:b for b in books}

    return UserBookmarkResponse(
        bookmark_count = len(bookmark),
        bookmark_passage = [
            {
                "ref":f"{books_by_id[b.book_id].passage.name} {books_by_id[b.book_id].chapter}:{books_by_id[b.book_id].verse}",
                "snippet": books_by_id[b.book_id].text,
                "created_at":b.created_at
            }
            for b in bookmark
            if b.book_id in books_by_id
        ]
    )

@router.post("/save_bookmark", response_model=Dict)
@limiter.limit("2/minute")
async def save_bookmark(request: Request, payload:BookMarkSchema, current_user:User=Depends(get_current_user)):
    book = await BibleContent.filter(passage__name__icontains=payload.book_name.capitalize(), 
                                     chapter = payload.chapter, verse = payload.verse | 1).prefetch_related("passage").first()
    if not book:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Book not found"
        )
    mark_book = await UserBookMark.create(user=current_user, book=book)
    await mark_book.save()
    return {"message": "Book has been bookmarked", 
            "book":{"book":book.passage.name, "chapter":book.chapter, "verse":book.verse}}
    


