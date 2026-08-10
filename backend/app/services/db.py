import os
from dotenv import load_dotenv
from tortoise.contrib.fastapi import register_tortoise

load_dotenv()

BIBLE_DB_URL = os.getenv("BIBLE_DB_URL")
AUTH_BIBLE_DB_URL = os.getenv("AUTH_BIBLE_DB_URL")

TORTOISE_ORM = {
    "connections": {
        "default": AUTH_BIBLE_DB_URL,
        "bible": BIBLE_DB_URL,
    },
    "apps": {
        "auth_models": {
            "models": ["app.models.models", "aerich.models"],
            "default_connection": "default",
        },
        "bible_models": {
            "models": ["app.models.bible_models"],
            "default_connection": "bible",
        },
    },
}


def init_db(app):
    # You can use this (not flexible)
    # register_tortoise(
    #     app,
    #     db_url=DB_URL,
    #     modules={"models": ["app.models"]},
    #     generate_schemas=True,
    #     add_exception_handlers=True,
    # )
    # OR
    #
    # Use this (flexible)
    register_tortoise(
        app,
        config=TORTOISE_ORM,
        generate_schemas=False,
        add_exception_handlers=True,
    )
