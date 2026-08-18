# </> Backend

> FastAPI application serving core REST routes  

![Python](https://img.shields.io/badge/Python-v3.12-3776AB?style=flat-square&logo=python&logoColor=white)

## 🗂️ Folder Structure
```bash
backend/
|
├── app
│   ├── config.py # configure .env file 
│   ├── core
│   │   ├── dependencies.py # Validate of tokens from cookies and get the current user if authenticated
│   │   ├── __init__.py
│   │   └── security.py # Hasshing of password and creation of JWT token
│   ├── models
│   │   ├── bible_models.py # Bible model where bible contnent live 
│   │   ├── __init__.py
│   │   └── models.py # Model for all authentication data 
│   ├── routes
│   │   ├── auth.py # Register, login, refresh, logout route all define here
│   │   ├── __init__.py
│   │   └── viwes.py # All bible content request e.g daily verse, all bible content etc
│   ├── schemas
│   │   ├── __init__.py
│   │   └── schema.py # Pydantic schemas for response and request
│   ├── services
│   │   ├── db.py # Database connection, aerich for migration, and models
│   │   └── __init__.py
│   └── utils
│       └── rust_search.py # Function to call rust actix-web api
├── main.py # Fast api entrypoint 
├── migrate.txt # helper note on how to use aerich migraion
├── migrations # migrations scripts for auth model and bible_models
│   ├── auth_models
│   │   ├── 0_20260703215527_init.py
│   │   ├── 1_20260704163348_update.py
│   │   ├── 2_20260719104429_update.py
│   │   ├── 3_20260719111320_update.py
│   │   └── 4_20260719114559_update.py
│   └── bible_models
│       ├── 0_20260703215612_init.py
│       ├── 1_20260719202744_update_bible_schema.py
│       └── 2_20260719205954_update_bible_schema.py
├── pyproject.toml
├── ReadMe.md
└── test
    └── test.py # pytest to test all routes
```
