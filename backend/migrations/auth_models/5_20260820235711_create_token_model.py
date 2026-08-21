from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "usertoken" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "acess_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "revoked" BOOL NOT NULL,
    "user_id" INT NOT NULL REFERENCES "users" ("id") ON DELETE NO ACTION
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "usertoken";"""


MODELS_STATE = (
    "eJztml1v2zYUhv+K4asU6Irai9tid7bnLF5jq0jUregwELREW4Ql0iWpJEaX/z6S+v6M3T"
    "lO5OnOPjxHIh8dki+P9L0LfeEAj9rI5W9uEGSWc4m5oGzb/aXzvUugh+SPGq/XsnGzyfko"
    "q4ALV8dy7Q+cVMCCCwYtIVuX0OVImmzELYY3AlMircR3XWWklnTEZJWYfIK/+QgIukLCQU"
    "w2/PW3NGNio3vEo7+bNVhi5NqZMWBb3VvbgdhutG1KxIV2VHdbAIu6vkcS581WOJTE3pgI"
    "ZV0hghgUSF1eMF91X/UuHG80oqCniUvQxVSMjZbQd0VquAuQ2LoAzA0T3ExMALp7ALIoUX"
    "BlV7ke/Up14ad+7/z9+Yef351/kC66m7Hl/UNw6wRMEKjxzM3ug26HAgYemnECdeNAxlER"
    "7Fjay8kmETm6stt5uhHLFN4QXkw3cknwJil1DL4evAcuIivhKKhv39bQ/GN4Pb4cXp9Jr1"
    "fqllTOgWCKzMOmftCmkCeILYYUDgBFEfOvskVgD5WjzkbmcNth6Jvoxw7wC7n93PTlAG2D"
    "uNswMWrgm9PZ5MYczj6p23mcf3M1v6E5US19bd3mrGfvcs8pvkjnz6l52VF/O1+N+UTjpV"
    "ysmL5j4md+7ao+yaWRAkLvALRTC0BkjahlnvqC0jXYa8lKRTy+bjXh4R5k6UqI+hyx/Yim"
    "IlqiIVG1vS7XpXuBwlWke0EZwivyEW015KnsESRW2QaQFhmfw2s1jPBDlEKRNZntDN7Foi"
    "SdWRKAHDESwUZgdIZjc2rMu4XF4L+QXWCJK0I7Un/GlAjUyCQuQxx1IMM4tR5WMVbJvIDW"
    "+g4yG2SyWrXQPs1ZYt9ik9f38hZI4ErzUQMJt4FsgldJ7Cj7H1HWKot4K6hPSlCrZ6p/7y"
    "Gp0zE/JKpfGOKMph7sIqkH1Yp6UBDUyIPY3YdvHHBycPuDwS4HlsGg+sCi2rJ8HcgdeerY"
    "QM7vKCtZJKpJl4QehvlzK6+np445kDsAvi1ZOUaUugiSioU5HZfXDTLwqWhHSf90EqEM7s"
    "gwrjInwNHUzEH+PBtNrs96mr10woFqKJ4nJDjubxArl72PMc+EHhF7bGks97YeUr3MnFY9"
    "pHDWrNbrSXoUy825iRnGX3y8Ri7UhIvJUFvvblhSVJ1JCydMD7I1PwAwdXqRy996Jq93qr"
    "wEXSNyKFimutgpkTrK6TlOsbpTdDoPdzhNg2getKfqkzpVt5rh/6IZ2nco7TuUl060fYfS"
    "vkN5cYgb+g4l0M51EjBW1zvoPxH7ttqvSStqnfaDFuIcxE82S9dE9xV4c2EnUYau03aTL2"
    "ZG1kXF5rPZ8MurjLS7Mua/Re6p+t34yhjl5AJDS6nmnP3hFwJb/D+E/1byK1lTaovTqagj"
    "1qWfB/sBy9KtNG6lcYOk8TPKtiFi2HIqNVvY/Lhgg4ljq9aaNMnr1NotYjysmu/60UAq5C"
    "RkwhE+FlAzaw/CofsJ0u3t9MV+r+aL/V7JF/tJYSBL+PcbY15RZk5C8jVmbInOPx0X8yZq"
    "ghq4Cka95M2r29fZCrG6wKhMMxxzb3v4F1DYIiM="
)
