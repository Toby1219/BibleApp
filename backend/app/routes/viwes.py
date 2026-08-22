from fastapi import APIRouter, Depends, HTTPException, Request, status
from app.schemas.schema import (
    AllBibleBook,
    BiblePassage,
    TestamentQuery,
    BibleBookQuery,
    SingleBibleBookQuery,
    DailverseResponse,
)

from app.models.bible_models import BibleBook, BibleContent, DailyVerse
from app.models.models import SearchHistory, User
from typing import Dict
from fastapi_cache.decorator import cache
from datetime import timezone, timedelta, datetime
import random
import httpx
from ..utils.rust_search import search_bible
from ..utils.cache import custom_key_builder
from ..utils.limiter import limiter


view_router = APIRouter()

@view_router.get("/all", response_model=Dict)
@limiter.limit("5/minute")
@cache(expire=600, key_builder=custom_key_builder)
async def get_all_books(request: Request):
    bible_book = await BibleBook.all().prefetch_related("testament")
    bible = [
        AllBibleBook(
            book_id=book.id,
            name=book.name,
            testament=book.testament.name,
            author=book.author,
            date=book.date,
            genre=book.genre,
            chapters=book.chapters,
            summary=book.summary,
        )
        for book in bible_book
    ]
    return {"total_count": len(bible), "response": bible}


@view_router.post("/all", response_model=Dict)
@limiter.limit("5/minute")
async def all_books_testament(request: Request, payload: TestamentQuery):
    bible_testament = payload.testament if payload.testament else "OT"
    bible_book = (
        await BibleBook.filter(testament__short_name=bible_testament.upper())
        .prefetch_related("testament")
        .all()
    )
    bible = [
        AllBibleBook(
            book_id=book.id,
            name=book.name,
            testament=book.testament.name,
            author=book.author,
            date=book.date,
            genre=book.genre,
            chapters=book.chapters,
            summary=book.summary,
        )
        for book in bible_book
    ]
    return {
        "total_count": len(bible),
        "total_chapters": sum([c.chapters for c in bible_book]),
        "response": bible,
    }


@view_router.post("/passage", response_model=Dict)
@limiter.limit("5/minute")
async def get_biblesPassage(request: Request, payload: BibleBookQuery):
    bible_books = (
        await BibleContent.filter(
            passage__name__icontains=payload.book_name.capitalize(),
            chapter=payload.chapter,
        )
        .prefetch_related("passage", "version")
        .order_by("chapter", "verse")
        .all()
    )
    passage_testament = await BibleBook.filter(name=bible_books[0].passage.name).prefetch_related("testament").first() if bible_books else ""
    if payload.searched and payload.user_mail:
        u = await User.filter(email=payload.user_mail).first()
        target_book = await BibleContent.filter(
            id__in=[b.id for b in bible_books],
            passage__name=payload.book_name.capitalize(),
            chapter=payload.chapter,
            verse=payload.verse
        ).first()
        
        saved_search = await SearchHistory.filter(book_id=bible_books[0].id).first()
        if not saved_search and target_book:
            search = await SearchHistory.create(user=u, phrase=payload.phrase, book=target_book)
            await search.save()
    
    return {
        "total_chapters": bible_books[0].passage.chapters if bible_books else 0,
        "total_count": len(bible_books),
        "testament":passage_testament.testament.name,
        "short_testment":passage_testament.testament.short_name,
        "heading": bible_books[0].heading,
        "data": [
            BiblePassage(
                passage=book.passage.name,
                chapter=book.chapter,
                verse=book.verse,
                text=book.text,
                version=book.version.name,
            )
            for book in bible_books
        ],
    }


@view_router.post("/passage/book", response_model=Dict)
@limiter.limit("5/minute")
async def get_single_book(request: Request, payload: SingleBibleBookQuery):
    bible_books = (
        await BibleContent.filter(
            passage__name__icontains=payload.book_name.capitalize(), 
            chapter = payload.chapter,
            verse = payload.verse,
        )
        .prefetch_related("passage", "version")
        .order_by("chapter", "verse")
        .all()
    )

    return {
        "total_chapters": bible_books[0].passage.chapters if bible_books else 0,
        "total_count": len(bible_books),
        "response": [
            BiblePassage(
                heading=book.heading,
                passage=book.passage.name,
                chapter=book.chapter,
                verse=book.verse,
                text=book.text,
                version=book.version.name,
            )
            for book in bible_books
        ],
    }

@view_router.get("/day-verse", response_model=DailverseResponse)
@limiter.limit("5/minute")
@cache(expire=600, key_builder=custom_key_builder)
async def get_daily_verse(request: Request):
    day_verse = None
    now = datetime.now(timezone.utc) - timedelta(hours=24)
    d_verse = await DailyVerse.filter(created_at__gt=now).latest("created_at")
    if d_verse:
        day_verse = await BibleContent.get(id=d_verse.book_id).prefetch_related("passage")
    else:       
        total = await BibleContent.all().count()
        day_verse = (
            await BibleContent.all()
            .offset(random.randint(0, max(total - 1, 0)))
            .limit(1)
            .prefetch_related("passage")
            .first()
        )
        d_v = await DailyVerse.create(book=day_verse)
        d_v.save()
    return DailverseResponse(book=f"{day_verse.passage.name} {day_verse.chapter}:{day_verse.verse}", text=day_verse.text)

@view_router.get("/book-count", response_model=Dict)
@limiter.limit("5/minute")
@cache(expire=600, key_builder=custom_key_builder)
async def get_books_count(request: Request):
    books = await BibleBook.all()
    data = {book.name:book.chapters for book in books}
    return data

@view_router.get("/verse-count", response_model=Dict)
@limiter.limit("5/minute")
@cache(expire=600, key_builder=custom_key_builder)
async def get_book_verse(request: Request, book:str, chapter:int):
    passage = await BibleBook.filter(name__icontains=book.capitalize()).first()
    if not passage:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Book does not exist")
    book_content = await BibleContent.filter(passage=passage.id, chapter=chapter).prefetch_related("passage").all()
    if not book_content:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Book content does not exit")
    data = {"book": book_content[0].passage.name, "chapter": book_content[0].chapter, "verse": len(book_content)}
    return data


@view_router.get("/search", response_model=list[Dict])
@limiter.limit("5/minute")
async def search(request: Request, q: str, limit: int = 20):
    try:
        results = await search_bible(q, limit)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"search service error: {e}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"search service unavailable: {e}")
    return results

