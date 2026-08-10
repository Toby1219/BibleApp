from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "seatch_history" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "pharse" VARCHAR(200),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE NO ACTION
);
        CREATE TABLE IF NOT EXISTS "user_bookmark" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "book_id" INT NOT NULL,
    "user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE NO ACTION
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "seatch_history";
        DROP TABLE IF EXISTS "user_bookmark";"""


MODELS_STATE = (
    "eJztmV1v2jAUhv8K4opJ3VRYaavdAaMqa4GJ0m1qVUUmMcQisVPbKUUV/3228x0SPlrKoO"
    "MOjs9JfB7bx6+dlyJwuanZxIAW+3IDAdXNS8Q4odPit8JLEQMbih8LvI5Eo+OkfKSVg4Gl"
    "YhkEXDc1MxYwYJwCnYvWIbAYFCYDMp0ihyOChRW7liWNRBeOCI8ik4vRows1TkaQm5CKhv"
    "sHYUbYgM+QBX+dsTZE0DISOSBDvlvZNT51lK2F+YVylG8baDqxXBtHzs6UmwSH3ghzaR1B"
    "DCngUD6eU1d2X/bOzzfIyOtp5OJ1MRZjwCFwLR5Ld0UGOsGSn+gNUwmO5Fs+V8onZyfnX0"
    "9PzoWL6kloOZt56UW5e4GKQKdfnKl2wIHnoTBG3BwTUAbn2TWEPRteFJECKLqdBhjgihH0"
    "+YQAA5eIYDRrNoTQBs+aBfGIm5Lb8fECYL9qvcZlrVcSXp9kMkTMZG+id/ymitcmqUYUdQ"
    "plxhrg8yS/ixaObJhNMxmZImr4oV+CHyvwnZuhWwAscjC62Jr6w7uAb7/Vbt70a+2fMhOb"
    "sUdLIar1m7KloqzTlLV0mhqK8CGF363+ZUH+Ldx1O01FkDA+ouqNkV//rij7JGoY0TCZaM"
    "CIrdTAGoBJDKzLINXWqi2xiOUFZkfGbwM1Rhbm4TizxEgi8wAvCIVohK/gVHFsiR4BrGfV"
    "lfj2dOs/a/cgzoKJEFijGUbBJNyx4vND5CiSgtyrL91CrdFvdTtFxXIA9PEEUENLQJUtpE"
    "JSltB3vsmu2GkLwGCkCMg8/GWR5JunDQL4SySBzJAdlMC+KQE5bOr3GlogHvMqNbB9igkx"
    "UF1FC1TzpUB1TglAGyBrHYRhwD7yq1Srq4ipajVfTMm2JEITMFMoIgcwNiE0YzXnw8wI3Q"
    "zWravU9wCLmCaqMXrKWOJ1QiwIcE6RjMeleA5E4HsBDafuWzbkLH71bvc6IUDrrX6K4227"
    "3uyVygqvcELeJh1U0QRT5jqQZoucZVgToVsku+52/E/QHg5VH+hQNXc+yBe50Qxg6jIqfr"
    "mUWl5+/MVVD1pAEZ4f74W3W7s37nnniMTSELVhbAM6ZhtgIlW9qFPjtnjeniHZynEoZLPo"
    "WBQHuMLxSAsG8HBM2rdj0mFX+kC7UrqmrnfVF4v4n676Dvejr4B2uB/N2cSP1r8fTa/at8"
    "AbIEEkoFeXfxoEc7irUzGLYvCOBMZYbdrBa+YapEg3cxWV37xcS4HI8SCidqziLRJRT5Ay"
    "/2Sy6tVeLORwpRetGrE+1oDou+8nwPJKX+7LC77clzO+3EfVPgnxx023k6Pjo5AUyFssEr"
    "w3kM6PChZi/GE3sS6gKLNO6PUAXqld+5Pm2rju1tNCXD6gnqV3trnbzP4C3pPsTQ=="
)
