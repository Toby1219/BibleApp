
# 📖 Bible_webapp

> High-performance scripture ingestion, hybrid rust (tantivy) search engine, and API web application.

![Python](https://img.shields.io/badge/Python-v3.12-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-Search_Engine-000000?style=flat-square&logo=rust&logoColor=white)
![Package Manager](https://img.shields.io/badge/uv-managed-8A2BE2?style=flat-square)

---

## 📌 Overview

**`bible_webapp`** is an end-to-end platform for indexing, and serving scripture texts with low-latency search capabilities. It combines a **Python/FastAPI** backend for ORM data modeling and REST API endpoints with a specialized **Rust** microservice for high-speed lexical and vector search indexing.

---

## 🗂️ Folder Structure
```bash
bible_webapp/
|
├── backend (Python fastApi)
│   ├── app
│   │   ├── core
│   │   ├── models
│   │   ├── routes
│   │   ├── schemas
│   │   ├── services
│   │   └── utils
│   ├── migrations
│   │   ├── auth_models
│   │   └── bible_models
│   └── test
├── frontend (React js)
│   ├── public
│   └── src
│       ├── assets
│       ├── authpage
│       └── homepage
└── search_engine
    ├── bible_index
    └── src
        ├── bin
        ├── entity
        └── handlers
```

## 🛠️ Key Features

| Service | Description | Tech Stack | Type | Status |
| :--- | :--- | :--- | :---: | :---: |
| **API Backend** | FastAPI application serving core REST routes | Python 3.12, FastAPI | 🌐 REST Service | ![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square) |
| **Frontend** | React, Tailwind CSS UI | React JS, Tailwind CSS| 💻 UI | ![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square) |
| **Rust (actix-web)** | Hybrid semantic search powered by rust tantivy and served through actix-web | Rust, Actix Web, Tantivy | 🔍 Microservice | ![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square) |

---



## 🚀 Quick Start

### Prerequisites
* Python `^3.12`
* `uv` package manager

* Rust `^1.96.0`

* npm `^11.13.0`

### Installation

1. **Clone the repository:**
```bash
   git clone [https://github.com/username/project-name.git](https://github.com/username/project-name.git)
   cd project-name
```

2. **Install python packages:**
```bash
    # Initialize uv project & environment
    uv init .
    source .venv/bin/activate

    # Install dependencies
    uv pip install -r requirement.txt

    # Run FastAPI server
    cd backend
    uvicorn main:app --reload
```

3. **Setup Rust:**
```bash
    cd search_engine
    cargo build --release
    cargo run --release
```

---


### Docker Installation


