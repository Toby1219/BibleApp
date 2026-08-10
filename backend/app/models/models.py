from tortoise import fields
from tortoise.models import Model


class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=50, unique=True)
    email = fields.CharField(max_length=255, unique=True)
    hashed_password = fields.CharField(max_length=255)
    is_active = fields.BooleanField(default=True)
    is_superuser = fields.BooleanField(default=False)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "users"
        using_db = "default"

    def __str__(self):
        return self.username


class SearchHistory(Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField(
        "auth_models.User", related_name="search_history", on_delete=fields.NO_ACTION
    )
    pharse = fields.CharField(max_length=200, null=True)
    book = fields.ForeignKeyField(
        "bible_models.BibleContent",
        related_name="search_passage",
        on_delete=fields.NO_ACTION,
        db_constraint=False,
    )
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "search_history"
        using_db = "default"

    def __str__(self):
        return f"{self.user.username} searched for '{self.pharse}'"


class UserBookMark(Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField(
        "auth_models.User", related_name="bookmarks", on_delete=fields.NO_ACTION
    )
    book = fields.ForeignKeyField(
        "bible_models.BibleContent",
        related_name="book_marks",
        on_delete=fields.NO_ACTION,
        db_constraint=False,
    )
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "user_bookmark"
        using_db = "default"

    def __str__(self):
        return f"{self.user.username} bookmarked {self.book.heading}"
