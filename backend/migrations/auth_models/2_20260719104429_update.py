from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "seatch_history" ADD "passage_id" INT NOT NULL;"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "seatch_history" DROP COLUMN "passage_id";"""


MODELS_STATE = (
    "eJztmm1v2jAQgP8K4lMndVVhpa32DRhV2QZMLd2mVlVkEpdYJHZqO2Vo6n+f7bw4r7ysHY"
    "Mt3+B8l/gen8/nU37Wgc9twyUWdNjRNQTUtC8R44Qu6u9rP+sYuFD8WKJ1KAY9L6MjpRxM"
    "HGXLIOCmbdgJgwnjFJhcjD4Ah0EhsiAzKfI4IlhIse84UkhMoYjwVIt8jB59aHAyhdyGVA"
    "zc3Qsxwhb8AVn015sZDwg6VsoHZMl3K7nBF56S9TG/UIrybRPDJI7vYq3sLbhNcKyNMJfS"
    "KcSQAg7l4zn15fTl7EJ/I4+CmWqVYIoJGws+AN/hCXfXZGASLPmJ2TDl4FS+5W2zcXJ2cv"
    "7u9ORcqKiZxJKz58A97XtgqAgMx/VnNQ44CDQURs3NswFlMM+uK+TF8LRFBqCYdhZghCtB"
    "MOQTA4xUNEEdNa+E0AU/DAfiKbclt+PjJcC+tq+6l+2rA6H1RjpDRCQHgT4Mh5rBmKSqKZ"
    "oUSo8NwPMkP4gRjlxYTDNtmSFqhaZH0Y81+OYidAuAhQ/WCDuLcHmX8B33B73rcXvwRXri"
    "MvboKETtcU+ONJV0kZEenGaWIn5I7Vt/fFmTf2u3o2FPESSMT6l6o9Yb39blnEQOIwYmcw"
    "NYiZ0aSSMwqYX1AGNgCo2N0kvaaHWa2ZFVfJVMo9H5DNLNuCUs/ido8kx7mBVmZ0kkD/CC"
    "UIim+BNcKI59MSOAzaKUnDzZb8Jn7R7E5ygQIqnenBTM48M+GR/CR+EU5EFqHtXa3XF/NK"
    "wX7d2X8JsgASUC2JF/ugRzuKvRWAQyekeKZDpDlcGUgTkB5mwOqGWkIlSOkCbJSGLd/JDb"
    "dLMSgMUMrNCXMD2ng7WsRo0ieUVpKsOFVRXpvlWkctnU7w1q0qTNb1Wl26eYKkpb69Skrf"
    "KStJWrSKELkLMJwthgH/k1W611ivpWq7yol2NphDZgtqjMZa6cE1qwm8thFpi+Dtat35b+"
    "BFjEDJGN0VPBFu8Q4kCAS5Jk0i57UgvDPwU0Dt2XHMpF/Dqj0efURajTH2c43gw6vauDhs"
    "IrlFBwSOerbcGG+R6kxRXjKqwp0y2S3fQ4/itoq8v9P3S5z122yotcHQFMNUWTTc7M9grt"
    "Lz5dQQcowvn1Xtpl3b11L7uUpbaGyA0zF9AZewUmsqoXeWo2EM/bMyRbuQ7FbJZdi5IA17"
    "geGdECVtekfbsmVafSP3QqZXPqZn3ThMX/1Detms2/Aa1qNpcc4ocvazbLPVh1mvOd5kRu"
    "2sE2cxtSZNqlFVU4vLqWAlqxKqJ2LOMtK6KeIGXhzWTd1l7CpGrp6V0j9scGEEP1/QTYWO"
    "sLksaSL0gaBV+Q6GyfhvjxejQsqeO1SQbkDRYO3lnI5Ic1BzF+v5tYl1CUXqfq9QjewaD9"
    "Pcu1+3nUyRbi8gGdonpnm6fN8y9EXr9U"
)
