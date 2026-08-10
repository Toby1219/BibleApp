from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "dailyverse" RENAME TO "daily_verse";"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "daily_verse" RENAME TO "dailyverse";"""


MODELS_STATE = (
    "eJztmltP2zAUgP9KlSeQ2ATlqr2VUkYFtBNkDIFQ5CamjZrYxXYHFeK/z3bixEmbkrACDc"
    "0TzfE5jv3pOOdino2e2/Og5WMHevT7oXg4xHho/Kg9Gwj4kP/IUtmoGWA0SisIMQP8OR7o"
    "cW0pBz3KCLAZH7oHHoVc5EBqE3fEXIy4FI09TwixzRVd1I9FY+Q+jKHFcB+yASR84PaOi1"
    "3kwCdI1eNoaN270HMSy3cd8W4pt9hkJGVtxI6lonhbz7KxN/ZRrDyasAFGkbaLmJD2IYIE"
    "MCimZ2Qsli9WF25W7ShYaawSLFGzceA9GHtM225OBjZGgh9fDZUb7Iu3fKtv7ezvHGzv7R"
    "xwFbmSSLL/Emwv3ntgKAl0TONFjgMGAg2JMeYm/06Raw4AmY1O6afg8SWn4SlUn0rPB0+W"
    "B1GfDfjj1ubmHFZXjYvmSeNijWuti71g7sSBg3fCoXowJoDGAMGYgyBFEMYWb4IYIooYKp"
    "UYYnzsSkOR+2chN1T6FUFFkO+ZFEIYGVQMFUN7AEYMEloglOgmrweU5QC5kJASU6Nj3wdk"
    "Mg3NhE8Z1DSTknjfHCJm69oUa/YpffB0H1s7b1xL9/Mn4chZt/NTqWs+2TzrHqagMkgZ/4"
    "mYVSizSZu9ySWnwnQ5fFLkhvfDmVlOhGUa5TEm0O2jUziRRNt8WQDZsz6M0xmyqU+7fFBf"
    "lHcoaXxyCHiMkugpp+F75nuELHDObq3RNNvdjiEB94A9fATEsTJIjwCloA9nfEIPQ8vj0w"
    "voAbmXPIybGLHSEZaocB1riBLwpof8up+WAMRBOuG7xZuy4cwv5DSE+Wo5WzNYaDV3q+Kl"
    "mPovD5vQuKsqvPet8AYQOOL9BVJDzaQk4TmZHG7nSg635ySH25nJYfHccIVTw+CI5ycW6a"
    "8oL8Yz5iJ5tNIvySn96CQ6TEaKpdBJo1VKoNMnly+hGLqk0Sqhm1N7hP602MpD9eaXj2be"
    "oiN5zLJKjhkuuViQV/Gk5WWZPHf/U75RCIg9sDJ9NlcRJxrcCvKlnPDEpQwH/Z7yUE44n7"
    "jesnxAhm+tbHUovykk4gSf8/nKzCS6+FtEtX8EXG9ypRLAEiH5oFo/bjbNr/YTTal89X7U"
    "AKoucEtX3n/uBe6XuPahA0yYVRRk0qqcOOs5YNYzUdbXZ2W+edKM6J9FFtIiLl8y/FExQ2"
    "W38yOGlgPnixdhvllFiypaLNmB+8rR4rO76rt5YO5ms9zdfHO80D841a3iO0YNrQjLjBnJ"
    "Qu21iOEIbStq7FfhokzhwiZQbNYCM24ljvgIc32YcfeVsEzBdELT7+rHcp5Dg+/B6SJvYk"
    "TNj8zri/Z569JsnP9K3GEcNcyWGKkn7i+UdG0v9amMJqn9aZsnNfFYu+l2WpIgpqxP5Btj"
    "PfNGdEhFawlbCD9awNF8TEkVmOl2VqFToVlUjf2I4WKb0aWMShupZrTmKIlOdLNx2Wwcte"
    "b1oRcf317+ATQj2s8="
)
