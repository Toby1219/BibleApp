from pydantic import BaseModel, ConfigDict, Field, EmailStr
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    email: EmailStr = Field(max_length=120)


class UserCreate(UserBase):
    password: str = Field(min_length=8)

class UserRegisterResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

class UserLogin(BaseModel):
    email: EmailStr = Field(max_length=120)
    password: str = Field(min_length=8)


class UserPrivateResponse(BaseModel):
    username: str
    email: str
    search_count: int
    created_at: datetime
    search_history: List[dict]

class UserBookmarkResponse(BaseModel):
    bookmark_count: int
    bookmark_passage: List[dict]
    
    
class UserAdminresponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    is_superuser: bool
    created_at: datetime


class UserUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=1, max_length=50)
    email: EmailStr | None = Field(default=None, max_length=120)


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(Token):
    user_id: Optional[int] = None
    username: Optional[str] = None




# ------------------------------------------
# Bible view Schema
# ------------------------------------------


class AllBibleBook(BaseModel):
    book_id: int
    name: str
    testament: Optional[str] = None
    author: Optional[str] = None
    date: Optional[str] = None
    genre: Optional[str] = None
    chapters: int
    summary: Optional[str] = None


class BiblePassage(BaseModel):
    passage: Optional[str] = None
    chapter: int
    verse: int
    text: str
    version: Optional[str] = None

class DailverseResponse(BaseModel):
    book:str
    text: str
    
# ------------------------------------------
# Bible view Schema POST
# ------------------------------------------


class TestamentQuery(BaseModel):
    testament: str


class BibleBookQuery(BaseModel):
    book_name: str
    chapter: int


class SingleBibleBookQuery(BaseModel):
    book_name: str
    chapter: int
    verse: Optional[int]
    
class BibleBookVerseResponse(BaseModel):
    book:str
    chapter:int


class BibleBookmark(BaseModel):
    book:str
  
class BookMarkSchema(BaseModel):
    book_name: str
    chapter: int 
    verse: Optional[int]
