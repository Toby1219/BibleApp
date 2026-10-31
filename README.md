
# 📖 Bible_webapp

> Scripture reader with a Rust (Tantivy) full-text search engine, a FastAPI backend and a React frontend.

![Python](https://img.shields.io/badge/Python-v3.12-3776AB?style=flat-square&logo=python&logoColor=white)  ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)  ![Rust](https://img.shields.io/badge/Rust-Search_Engine-000000?style=flat-square&logo=rust&logoColor=white)  ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)  ![Package Manager](https://img.shields.io/badge/uv-managed-8A2BE2?style=flat-square)

---

## 📌 Overview

**`Bible_webapp`** lets people browse the Bible by book, chapter and verse, search it by keyword, bookmark passages and keep a search history. It ships with the **World English Bible (WEB)**: 66 books and 31,127 verses.

It is made of three services plus PostgreSQL and Redis:

- **Backend**: Python / FastAPI. Accounts, Bible content, caching, rate limiting.
- **Search engine**: Rust / actix-web with [Tantivy](https://github.com/quickwit-oss/tantivy). Ranked **full-text (keyword) search** over every verse.
- **Frontend**: React + TypeScript (Vite, Tailwind CSS), served by nginx in Docker.

> **About the search:** Tantivy is a full-text search library (inverted index with BM25 ranking). It matches the *words* in a query, so searching "love" finds verses containing "love", but it does **not** use embeddings or vector similarity and won't match by meaning. Nothing in this repo creates or queries vectors.

---

## 🛠️ Key Features

- Browse by book → chapter → verse, with chapter navigation
- **Verse of the day** (a random verse that is kept for 24 hours)
- **Ranked full-text search** with Tantivy query syntax (phrases, `AND`/`OR`, `+`/`-`)
- Accounts: register, login, token refresh, logout (JWT in HttpOnly cookies or a Bearer header)
- **Bookmarks** and **search history** per user
- Redis response caching and per-IP rate limiting

| Service | Description | Tech Stack | Type | Port | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **API Backend** | REST routes for auth and Bible content | Python 3.12, FastAPI, Tortoise ORM | 🌐 REST Service | 8000 | ![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square) |
| **Frontend** | Reader, search, profile UI | React 19, TypeScript, Tailwind CSS | 💻 UI | 8080 (Docker) / 5173 (dev) | ![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square) |
| **Search engine** | Full-text search over all verses | Rust, actix-web, Tantivy | 🔍 Microservice | 8081 | ![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square) |

---

## 🧭 How it fits together

```
Browser ──► React app ──► FastAPI (:8000) ──► PostgreSQL  (auth_db + bible_db)
                              │   └─────────► Redis       (response cache, rate limits)
                              └── GET /search ──► Rust search service (:8081) ──► Tantivy index (./bible_index)
                                                        └────────────────────► Redis (result cache)
```

The browser only talks to FastAPI. FastAPI forwards `/bible/search` to the Rust service.

---

## 🗂️ Folder Structure
```bash
bible_webapp/
|
├── docker-compose.yml        # db, redis, api, search, web
├── .env                      # Postgres credentials for the db container
├── db/                       # first-run DB init: creates bible_db and loads init.sql (WEB Bible data)
├── backend (Python FastAPI)
│   ├── main.py               # app entrypoint
│   ├── app
│   │   ├── config.py         # settings from .env
│   │   ├── core              # JWT + password hashing, auth dependencies
│   │   ├── models            # Tortoise models (auth + bible)
│   │   ├── routes            # auth.py, viwes.py
│   │   ├── schemas           # Pydantic request/response models
│   │   ├── services          # database config (two connections)
│   │   └── utils             # Redis cache, rate limiter, Rust search client
│   ├── migrations            # aerich migrations (auth_models, bible_models)
│   └── test
├── frontend (React + TypeScript)
│   ├── public
│   └── src
│       ├── assets
│       ├── authpage          # login, register, profile
│       └── homepage          # home, reader, search results
└── search_engine (Rust)
    ├── bible_index           # prebuilt Tantivy index (31,127 verses)
    └── src
        ├── bin               # index_bible: builds the index from Postgres
        ├── entity            # Tantivy schema
        └── handlers          # GET /search
```

---

## 🚀 Quick Start

### Option A: Docker (recommended)

```bash
docker compose up -d --build                               # build images; start db, redis, api, search and web
docker compose exec api aerich --app auth_models upgrade   # create the auth tables (users, tokens, bookmarks, history)
```

Then open **http://localhost:8080** (or `127.0.0.1:8080`). The API's interactive docs are at **http://localhost:8000/docs**.

Notes:

- On the first start with an empty `pgdata` volume, `db/` scripts create `bible_db` and load the Bible text from `db/init.sql`. To start over: `docker compose down -v`.
- The `aerich` step is needed because the compose file doesn't create the auth tables (the dump in `db/init.sql` only contains Bible tables). I haven't run this step, so treat the command as untested.
- The search index is **not** built in Docker. The container mounts the prebuilt `search_engine/bible_index/` folder.

### Option B: Run each service locally

**Prerequisites**

| Tool | Version |
| :--- | :--- |
| Python + [`uv`](https://docs.astral.sh/uv/) | Python ≥ 3.12 |
| Rust | 1.96 (the Docker build uses `rust:1.96`) |
| Node.js + npm | Node 22 (the Docker build uses `node:22`) |
| PostgreSQL | 16 |
| Redis | 7 |

**1. Databases**

```bash
createdb auth_db                      # database for users, tokens, bookmarks, history
createdb bible_db                     # database for Bible content
psql bible_db -f db/init.sql          # load the World English Bible rows
```

**2. Configure `backend/.env` and `search_engine/.env`**: use `localhost` hosts instead of the Docker service names (see the Configuration section below).

**3. Backend**

```bash
cd backend                                    # FastAPI project root
uv sync                                       # create .venv and install dependencies from pyproject.toml
aerich --app auth_models upgrade              # create the auth tables in auth_db (untested; see KNOWN_ISSUES)
uv run uvicorn main:app --reload --port 8000  # start the API with auto-reload on :8000
```

**4. Search engine** (new terminal)

```bash
cd search_engine            # Rust project root (contains the prebuilt bible_index/)
cargo run --release         # serve GET /search on 0.0.0.0:8081 using ./bible_index
```

To rebuild the index from Postgres (for example after changing the data):

```bash
cd search_engine                          # Rust project root
rm -rf bible_index                        # the indexer refuses to write into an existing index
cargo run --release --bin index_bible     # read verses via DATABASE_URL and write a new ./bible_index
```

`index_bible` uses `sqlx::query_as!`, so the `DATABASE_URL` in `search_engine/.env` must be reachable at **compile time** as well as at run time.

**5. Frontend** (new terminal)

```bash
cd frontend       # React project root
npm ci            # install exact dependency versions from package-lock.json
npm run dev       # start Vite on http://localhost:5173
```

The frontend calls the API at `http://localhost:8000` (hard-coded in `frontend/src/axiosinit.tsx`).

---

## ⚙️ Configuration

**Root `.env`** (used by the `db` container): `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`. Compose overrides the database name to `auth_db`.

**`backend/.env`** (all required)

| Variable | Example (Docker) | Meaning |
| :--- | :--- | :--- |
| `AUTH_BIBLE_DB_URL` | `postgresql://user:pass@db:5432/auth_db` | users, tokens, bookmarks, search history |
| `BIBLE_DB_URL` | `postgresql://user:pass@db:5432/bible_db` | Bible text |
| `REDIS_URL` | `redis://redis:6379/0` | cache + rate-limit storage |
| `SECRET_KEY` | long random string | signs JWTs |
| `RUST_SEARCH_URL` | `http://search:8081` | search service (`http://127.0.0.1:8081` locally) |
| `FRONTEND_URL` | `http://localhost:8080` | allowed CORS origin (`http://localhost:5173` for Vite dev) |

Defaults in code: JWT algorithm `HS256`, access token 30 min, refresh token 7 days.

**`search_engine/.env`**

| Variable | Meaning |
| :--- | :--- |
| `REDIS_URL` | result cache (required by the server) |
| `DATABASE_URL` | `bible_db` URL, used only by the `index_bible` tool |

---

## 🧪 Tests

```bash
cd backend                      # FastAPI project root
uv run pytest test/test.py      # run the route tests
```

---