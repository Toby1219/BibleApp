from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "search_history" RENAME COLUMN "pharse" TO "phrase";"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "search_history" RENAME COLUMN "phrase" TO "pharse";"""


MODELS_STATE = (
    "eJztml1v2zYUhv+K4asU6Irai9tid7bnLF5jq0jUregwELREW4Ql0iWpJEaX/z6S+v6M3T"
    "lO5OnOPjxHIh8dki+P9L0LfeEAj9rI5W9uEGSWc4m5oGzb/aXzvUugh+SPGq/XsnGzyfko"
    "q4ALV8dy7Q+cVMCCCwYtIVuX0OVImmzELYY3AlMircR3XWWklnTEZJWYfIK/+QgIukLCQU"
    "w2/PW3NGNio3vEo7+bNVhi5NqZMWBb3VvbgdhutG1KxIV2VHdbAIu6vkcS581WOJTE3pgI"
    "ZV0hghgUSF1eMF91X/UuHG80oqCniUvQxVSMjZbQd0VquAuQ2LoAzA0T3ExMALp7ALIoUX"
    "BlV7ke/Up14ad+7/z9+Yef351/kC66m7Hl/UNw6wRMEKjxzM3ug26HAgYemnECdeMwyFER"
    "7NiBrJxsEpGjK7udpxuxTOEN4cV0I5cEb5JSx+DrwXvgIrISjoL69m0NzT+G1+PL4fWZ9H"
    "qlbknlHAimyDxs6gdtCnmC2GJI4QBQFDH/KlsE9lA56mxkDrcdhr6JfuwAv5Dbz01fDtA2"
    "iLsNE6MGvjmdTW7M4eyTup3H+TdX8xuaE9XS19Ztznr2Lvec4ot0/pyalx31t/PVmE80Xs"
    "rFiuk7Jn7m167qk1waKSD0DkA7tQBE1oha5qkvKF2DvZasVMTj61YTHu5Blq6EqM8R249o"
    "KqIlGhJV2+tyXboXKFxFuheUIbwiH9FWQ57KHkFilW0AaZHxObxWwwg/RCkUWZPZzuBdLE"
    "rSmSUByBEjEWwERmc4NqfGvFtYDP4L2QWWuCK0I/VnTIlAjUziMsRRBzKMU+thFWOVzAto"
    "re8gs0Emq1UL7dOcJfYtNnl9L2+BBK40HzWQcBvIJniVxI6y/xFlrbKIt4L6pAS1eqb69x"
    "6SOh3zQ6L6hSHOaOrBLpJ6UK2oBwVBjTyI3X34xgEnB7c/GOxyYBkMqg8sqi3L14HckaeO"
    "DeT8jrKSRaKadEnoYZg/t/J6euqYA7kD4NuSlWNEqYsgqViY03F53SADn4p2lPRPJxHK4I"
    "4M4ypzAhxNzRzkz7PR5Pqsp9lLJxyohuJ5QoLj/gaxctn7GPNM6BGxx5bGcm/rIdXLzGnV"
    "QwpnzWq9nqRHsdycm5hh/MXHa+RCTbiYDLX17oYlRdWZtHDC9CBb8wMAU6cXufytZ/J6p8"
    "pL0DUih4JlqoudEqmjnJ7jFKs7RafzcIfTNIjmQXuqPqlTdasZ/i+aoX2H0r5DeelE23co"
    "7TuUF4e4oe9QAu1cJwFjdb2D/hOxb6v9mrSi1mk/aFmIcxA/2ixeE91X8M3HnUQhuk7dTb"
    "6YGWEXlZvPZsMvrzLi7sqY/xa5pyp44ytjlBMMDC2lnnP2p18IbPH/EP5bya9kVaktT6ei"
    "jliZfh7sByxMt+K4FccNEsfPKNyGiGHLqVRtYfPjkg0mjq1ea9Ikr9Nrt4jxsG6+62cDqZ"
    "CTkAlH+FxAzaw9CIfuJ0i3t9M3+72ab/Z7Jd/sJ6WBLOHfb4x5RaE5CclXmbElOv90XMyb"
    "qAlq4CoY9ZI3r25fZ2vE6gKjMs1wzL3t4V+DDiLp"
)
