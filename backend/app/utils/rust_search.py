import httpx
import os 
from dotenv import load_dotenv

load_dotenv()

RUST_SEARCH_URL = os.getenv("RUST_SEARCH_URL")


async def search_bible(query: str, limit: int = 10):
    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(
            f"{RUST_SEARCH_URL}/search",
            params={"q": query, "limit": limit},
        )
        response.raise_for_status()
        return response.json()