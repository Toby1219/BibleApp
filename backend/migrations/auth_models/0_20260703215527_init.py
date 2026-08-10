from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "username" VARCHAR(50) NOT NULL UNIQUE,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "hashed_password" VARCHAR(255) NOT NULL,
    "is_active" BOOL NOT NULL DEFAULT True,
    "is_superuser" BOOL NOT NULL DEFAULT False,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """


MODELS_STATE = (
    "eJztl1Fv2jAQx78K4olJXVUYtNXegDKVqcDUptvUqopMYhILx05jpy2q+O47m4QkhjCYtl"
    "GkviX/u4vvfol9l9cqiqVvB9zFVBzfChxVP1deqwwFGC5WjUeghaFhUqpEY6pDYnDTChoL"
    "GSFHgjhBVGCQXCyciISScAYqiylVInfAkTAvk2JGHmNsS+5h6euU7h9AJszFL1ikt+HUnh"
    "BM3ULGxFVra92Ws1BrfSa/aEe12th2OI0DljmHM+lztvQmTCrVwwxHSGL1eBnFKn2VXVJm"
    "WtEi08xlkWIuxsUTFFOZK3dLBg5nih9kI3SBnlrlY6PePGuefzptnoOLzmSpnM0X5WW1Lw"
    "I1gaFVnWs7kmjhoTFm3NRr09cr9Lo+itbjy8cYECF1E2KKbK8UA/RiU8w86cNt62QDsu/t"
    "6+5l+7rWOvmgKuHwKS8+8GFiaWiToppRxAEidBeEy4BD5NdotbYACF6lBLWtiNBHwseuHS"
    "Ihnnm0ZjeXw1wT+newpkLGNTvRDgYsETacxuRpzRbvcE4xYiWHZD7O4DmGwH8FdPnp/hHQ"
    "Dfw6o9GVSjoQ4pFqoW8ZHG8Hnd51ra7xghOROH+KFpiKOMRRnPTG3bAWQv8j2V3b8V7QOh"
    "FWZdtIroK9AIskAV5PthhpcHWT0OP04o2eB1CDO2J0lmyEDcyt/qB3Y7UH3wrgL9pWT1ka"
    "Wp0Zau3UODmWD6n86FuXFXVbuRsNe5ogF9KL9IqZn3VXVTnBFMhtxp9t5ObaTaqmYOZqXJ"
    "tMc4OHEsbImT6jyLVXLLzBy3xXTUEjMBXEkKdfi4KbpLmcY9s4Io5fLRtzE/PvB12UOb5P"
    "ugc06T7B/4lKaYfBIhfyPlBkuwb2xw4QE/fDBFg/2eZfAbxKAWqb0eI4k5it6W9fb0bDkt"
    "6WhRggbxkUeO8SRx5VKBHy4W1i3UBRVV3oYSm82qD90+TavRp1zOakHtABxnvtNvNfx2mK"
    "Dg=="
)
