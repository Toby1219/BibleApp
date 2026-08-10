from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "seatch_history" RENAME COLUMN "passage_id" TO "book_id";"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "seatch_history" RENAME COLUMN "book_id" TO "passage_id";"""


MODELS_STATE = (
    "eJztmm1P2zAQgP9K1U9MYhPtKKB9azsQHbSdoGwTCEVuYhqriR1sB6gQ/3228+K8lpaXrm"
    "X51p7vEt/j8/nOymMd+Nw2XGJBh305h4Ca9jFinNBZ/VvtsY6BC8WPOVrbYtDzMjpSysHY"
    "UbYMAm7ahp0wGDNOgcnF6A1wGBQiCzKTIo8jgoUU+44jhcQUighPtMjH6NaHBicTyG1Ixc"
    "DVtRAjbMEHyKK/3tS4QdCxUj4gS75byQ0+85Ssh/mRUpRvGxsmcXwXa2Vvxm2CY22EuZRO"
    "IIYUcCgfz6kvpy9nF/obeRTMVKsEU0zYWPAG+A5PuLsgA5NgyU/MhikHJ/Itn5uN3f3dg6"
    "97uwdCRc0kluw/Be5p3wNDRWAwqj+pccBBoKEwam6eDSiDeXZdIS+Gpy0yAMW0swAjXAmC"
    "IZ8YYKSiCeqoeSOELngwHIgn3JbcdnbmAPvVPuset8+2hNYn6QwRkRwE+iAcagZjkqqmaF"
    "IoPTYAz5P8LkY4cmExzbRlhqgVmn6JfizANxehKwAsfLCG2JmFyzuH76jXPzwftfs/pScu"
    "Y7eOQtQeHcqRppLOMtKtvcxSxA+p/e6Njmvyb+1yODhUBAnjE6reqPVGl3U5J5HDiIHJvQ"
    "GsxE6NpBGY1MKOCZkaS+WWhMXzCWZN1u9NcoyG5jNIl4OWsPifoMnT7GZamJclkTzAI0Ih"
    "muATOFMce2JGAJtFyTh5pl+Ez1o/iE9RIERSvS0puI+P+WR8CB+FU5AHSXlYa3dHveGgnt"
    "u1r4E3RoJIRK8j/3QJ5nBdQ7GIYvSOFMZEbirDKENyDMzpPaCWkYpNOUKaJCOJdfNDbtPN"
    "SgAGE4VAOhKm5HSYltWlUQw/U47KQGFVFbppVahcNvV7iTo0afOiSnT1FFOFaGuROrRVXo"
    "a2clUodAFylkEYG2wiv2artUgh32qVF/JyLI3QBswW1bgHGLsntGA3l8MsMH0brCvvkN4D"
    "LGKGyMbormCLdwhxIMAlSTJplz2mheF7AY1D9zUnchG/znB4mmp+Or1RhuNFv3N4ttVQeI"
    "USCg7pfJ0t2DDfg7S4VnwOa8p0hWSXPY7/Cdqqof9ADX2uzSovcnUEMHURmrzYzGyv0P7o"
    "5Aw6QBHOr/fcm9X1W/eydizXXLmATtkbMJFVvchT07543oYhWUk7FLOZ1xYlAS7QHhnRAl"
    "Zt0qa1SdWp9IFOpeqa+UW7o7pmrq6Zq2vmdaG4gdfMbUiRaZdWVOHw87UU0IpVEbVmGW9e"
    "EXUHKQs7k0Wv9hIm1ZWe3jVifywBMVTfTICNhb4aacz5aqRR8NWIzvZpiD/Oh4OSOl6bZE"
    "BeYOHglYVMvl1zEOPX64l1DkXpdapej+Bt9dt/sly7p8NOthCXD+gU1TurPG2e/gLMMLpw"
)
