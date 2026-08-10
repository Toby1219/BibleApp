from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "bible_testaments" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "short_name" VARCHAR(2) NOT NULL
);
CREATE TABLE IF NOT EXISTS "bible_books" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "author" VARCHAR(100),
    "date" VARCHAR(100),
    "genre" VARCHAR(100),
    "chapters" INT,
    "summary" TEXT,
    "testament_id" INT NOT NULL REFERENCES "bible_testaments" ("id") ON DELETE NO ACTION
);
CREATE TABLE IF NOT EXISTS "bible_versions" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "short_name" VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS "bible_content" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "heading" VARCHAR(300),
    "chapter" INT,
    "verse" INT,
    "text" TEXT,
    "passage_id" INT NOT NULL REFERENCES "bible_books" ("id") ON DELETE NO ACTION,
    "version_id" INT NOT NULL REFERENCES "bible_versions" ("id") ON DELETE NO ACTION,
    CONSTRAINT "uid_bible_conte_chapter_a82902" UNIQUE ("chapter", "verse")
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """


MODELS_STATE = (
    "eJztmV9vmzAQwL9KxVMrbVNL2q3aWxKtW9UukaqoqlRVyAEHUMCm2KyNqnz32QZj/gQGVd"
    "aGhqeE8x2+++nM3cGLNnfnHjR8bEGPfBnxixHGS+37wYuGgA/ZnyqVTwcaCIKiAhdTwK7V"
    "wpxpCzmYExoCk7KlBfAIZCILEjN0A+pixKQo8jwuxCZTdJGtRBFyHyNoUGxD6sCQLdw/ML"
    "GLLPgMibwMlsbChZ6Vc9+1+N5CbtBVIGSXiF4IRb7b3DCxF/lIKQcr6mCUaruIcqkNEQwB"
    "hfz2NIy4+9y7JFgZUeypUoldzNhYcAEij2bCbcjAxIjzY94QEaDNd/msn5x+Oz0ffD09Zy"
    "rCk1TybR2Hp2KPDQWByUxbi3VAQawhMCpu4rdEbuyAcDM6qV+Ax1wuwpOo3pWeD54NDyKb"
    "Ouzy5Pi4htXt8Gb8a3hzyLSOeCyYJXGc4JNkSY/XOFAFEEQMRNgGobJ4FcQEUcpQqiiI6t"
    "h1hiLLz1ZpKPV7gpIgizlshTA16BlKhqYDAgpD0qKUZE3+XVB2A+RWSoqiRiLfB+GqDG0G"
    "nyuoZUw6kn01RGY/7mbcZ5+QRy+bY4e/h3ci/fxVsnI9nfyU6pmcHF9PRwWoFBLK/iJqtO"
    "psimavSslSme5GTvLecLHc2OWkWMooL3AIXRtdwZUgesncAsjc9GAsd8iz7G13D+paZoeU"
    "qpMTgqe0iS4lDYuZxQhpnJzTg+F4djmdaALwHJjLJxBaRgXpABACbLjhETpKLC+ubqAHRC"
    "xNGI8xop0jLFBhHWcQ5eCVl3zdL0oAYiCtZG++UzWc+kEug7DZLGdmDLY6zd3Leslv/YeV"
    "Tag99BPe/53wHAgsvn+L1jBj0pHynG8OB42aw0FNcziobA7b94Z73BrGR7w5sVR/T3lR1j"
    "G36aOlfkdO6Vs30Ukz0q6FzhvtUwNdPLnMhXbo8kb7hK5m9kjyabuTh3w3v3s0mw4d+WNW"
    "NXJsSMntgrxVN+0uy/y5az++vdG0osbl+nklN1Y3m1jSEbb/BNW5AeV9P0F9iBfXxMEhNd"
    "qCzFt1E6feAKZeiVI/2lS7m7znSj93b+UlV/fK+Vu94ZL1ub5iZKp4s3qRVMy+WvTVYscO"
    "3EeuFu/9XvCsCcyzapZnx6+uF9kHTv9dZItVY/0XyXqICQ=="
)
