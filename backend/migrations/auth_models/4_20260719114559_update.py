from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "seatch_history" RENAME TO "search_history";"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "search_history" RENAME TO "seatch_history";"""


MODELS_STATE = (
    "eJztmm1P2zAQgP9K1U9MYhPtKKB9azsQHbSdoGwTCEVuYhqriR1sB6gQ/3228+K8lpaXrm"
    "X51p7vEt/j8/nOymMd+Nw2XGJBh305h4Ca9jFinNBZ/VvtsY6BC8WPOVrbYtDzMjpSysHY"
    "UbZM6Rt2wmDMOAUmF6M3wGFQiCzITIo8jggWUuw7jhQSUygiPNEiH6NbHxqcTCC3IRUDV9"
    "dCjLAFHyCL/npT4wZBx0r5gCz5biU3+MxTsh7mR0pRvm1smMTxXayVvRm3CY61EeZSOoEY"
    "UsChfDynvpy+nF3ob+RRMFOtEkwxYWPBG+A7POHuggxMgiU/MRumHJzIt3xuNnb3dw++7u"
    "0eCBU1k1iy/xS4p30PDBWBwaj+pMYBB4GGwqi5eTagDObZdYW8GJ62yAAU084CjHAlCIZ8"
    "YoCRiiaoo+aNELrgwXAgnnBbctvZmQPsV/use9w+2xJan6QzRERyEOiDcKgZjEmqmqJJof"
    "TYADxP8rsY4ciFxTTTlhmiVmj6JfqxAN9chK4AsPDBGmJnFi7vHL6jXv/wfNTu/5SeuIzd"
    "OgpRe3QoR5pKOstIt/YySxE/pPa7Nzquyb+1y+HgUBEkjE+oeqPWG13W5ZxEDiMGJvcGsB"
    "I7NZJGYFILOyZkaiyVWxIWzyeYNVm/N8kxGprPIF0OWsLif4ImT7ObaWFelkTyAI8IhWiC"
    "T+BMceyJGQFsFiXj5Jl+ET5r/SA+RYEQSfW2pOA+PuaT8SF8FE5BHiTlYa3dHfWGg3pu17"
    "4G3hgJIhG9jvzTJZjDdQ3FIorRO1IYE7mpDKMMyTEwp/eAWkYqNuUIaZKMJNbND7lNNysB"
    "GEwUAulImJLTYVpWl0Yx/Ew5KgOFVVXoplWhctnU7yXq0KTNiyrR1VNMFaKtRerQVnkZ2s"
    "pVodAFyFkGYWywifyardYihXyrVV7Iy7E0QhswW1TjHmDsntCC3VwOs8D0bbCuvEN6D7CI"
    "GSIbo7uCLd4hxIEAlyTJpF32mBaG7wU0Dt3XnMhF/DrD4Wmq+en0RhmOF/3O4dlWQ+EVSi"
    "g4pPN1tmDDfA/S4lrxOawp0xWSXfY4/idoq4b+AzX0uTarvMjVEZC/2Mxsr9D+6OQMOkAR"
    "zq/33JvV9Vv3snYs11y5gE7ZGzCRVb3IU9O+eN6GIVlJOxSzmdcWJQEu0B4Z0QJWbdKmtU"
    "nVqfSBTqXqmvlFu6O6Zq6umatr5nWhuIHXzG1IkWmXVlTh8PO1FNCKVRG1ZhlvXhF1BykL"
    "O5NFr/YSJtWVnt41Yn8sATFU30yAjYW+GmnM+WqkUfDViM72aYg/zoeDkjpem2RAXmDh4J"
    "WFTL5dcxDj1+uJdQ5F6XWqXo/gbfXbf7Jcu6fDTrYQlw/oFNU7qzxtnv4CfhK6bg=="
)
