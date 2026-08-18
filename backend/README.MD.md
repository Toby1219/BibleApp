backend/
|
├── app
│   ├── config.py
│   ├── core
│   │   ├── dependencies.py
│   │   ├── __init__.py
│   │   └── security.py
│   ├── models
│   │   ├── bible_models.py
│   │   ├── __init__.py
│   │   └── models.py
│   ├── routes
│   │   ├── auth.py
│   │   ├── __init__.py
│   │   └── viwes.py
│   ├── schemas
│   │   ├── __init__.py
│   │   └── schema.py
│   ├── services
│   │   ├── db.py
│   │   └── __init__.py
│   └── utils
│       └── rust_search.py
├── main.py
├── migrate.txt
├── migrations
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
    └── test.py
