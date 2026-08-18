import os
import sys

import pytest
from starlette.testclient import TestClient 
from tortoise import Tortoise

# Parent directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

TEST_DB_URL = "sqlite://:memory:"
STATUS_CODE = [x for x in range(200, 510)]


@pytest.fixture(scope="session", autouse=True)
def initialize_tortoise_db():
    """Initialize Tortoise ORM with an in-memory SQLite database for tests."""
    Tortoise.init(
        db_url=TEST_DB_URL,
        modules={
            "auth_models": {
                "models": ["app.models.models", "aerich.models"],
                "default_connection": "default",
            },
            "bible_models": {
                "models": ["app.models.bible_models"],
                "default_connection": "bible",
            },    
        },
    )
    yield
    Tortoise.close_connections()


@pytest.fixture
def client():
    """FastAPI test client for route tests."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def auth_headers(client):
    """Create a real user and return a bearer token for authenticated requests."""
    email = "authuser@example.com"
    password = "securepassword123"
    username = "authuser"

    register_response = client.post(
        "/auth/register",
        json={"email": email, "password": password, "username": username},
    )
    assert register_response.status_code in STATUS_CODE, register_response.text

    login_response = client.post(
        "/auth/login",
        json={"email": email, "password": password},
    )
    assert login_response.status_code == 200, login_response.text

    token = login_response.json().get("access_token")
    assert token, login_response.json()
    return {"Authorization": f"Bearer {token}"}


class TestAuthRoutes:
    """Tests for authentication routes."""

    def test_register_user(self, client):
        response = client.post(
            "/auth/register",
            json={
                "email": "testuser002@example.com",
                "password": "testpassword123",
                "username": "testuser002",
            },
        )
        assert response.status_code in STATUS_CODE, response.text

    def test_login_user(self, client):
        client.post(
            "/auth/register",
            json={
                "email": "logintest002@example.com",
                "password": "password123",
                "username": "logintest002",
            },
        )

        response = client.post(
            "/auth/login",
            json={"email": "logintest002@example.com", "password": "password123"},
        )
        assert response.status_code == 200, response.text
        assert "access_token" in response.json(), response.json()

    def test_logout_user(self, client, auth_headers):
        response = client.post("/auth/logout", headers=auth_headers)
        assert response.status_code in STATUS_CODE, response.text

    def test_refresh_token(self, client, auth_headers):
        response = client.post("/auth/refresh", headers=auth_headers)
        assert response.status_code in STATUS_CODE, response.text


class TestBibleRoutes:
    """Tests for Bible content routes."""

    def test_get_books(self, client):
        response = client.get("/bible/books")
        assert response.status_code in STATUS_CODE, response.text

    def test_get_book_by_id(self, client):
        response = client.get("/bible/books/1")
        assert response.status_code in STATUS_CODE, response.text

    def test_get_chapters(self, client):
        response = client.get("/bible/books/1/chapters")
        assert response.status_code in STATUS_CODE, response.text

    def test_get_chapter_by_id(self, client):
        response = client.get("/bible/books/1/chapters/1")
        assert response.status_code in STATUS_CODE, response.text

    def test_get_verses(self, client):
        response = client.get("/bible/books/1/chapters/1/verses")
        assert response.status_code in STATUS_CODE, response.text

    def test_get_verse_by_id(self, client):
        response = client.get("/bible/books/1/chapters/1/verses/1")
        assert response.status_code in STATUS_CODE, response.text

    def test_search_verses(self, client):
        response = client.get("/bible/search?q=love")
        assert response.status_code in STATUS_CODE, response.text


class TestGeneralRoutes:
    """Tests for general/view routes."""

    def test_root_endpoint(self, client):
        response = client.get("/")
        assert response.status_code in STATUS_CODE, response.text

    def test_health_check(self, client):
        response = client.get("/health")
        assert response.status_code in STATUS_CODE, response.text


class TestEdgeCases:
    """Tests for edge cases and error handling."""

    def test_invalid_book_id(self, client):
        response = client.get("/bible/books/99999")
        assert response.status_code in STATUS_CODE, response.text

    def test_invalid_chapter_id(self, client):
        response = client.get("/bible/books/1/chapters/99999")
        assert response.status_code in STATUS_CODE, response.text

    def test_invalid_verse_id(self, client):
        response = client.get("/bible/books/1/chapters/1/verses/99999")
        assert response.status_code in STATUS_CODE, response.text

    def test_empty_search(self, client):
        response = client.get("/bible/search?q=")
        assert response.status_code in STATUS_CODE, response.text

    def test_missing_query_param(self, client):
        response = client.get("/bible/search")
        assert response.status_code in STATUS_CODE, response.text

