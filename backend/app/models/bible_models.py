from tortoise import fields
from tortoise.models import Model


class BibleTestament(Model):
    id = fields.IntField(primary_key=True)
    name = fields.CharField(max_length=100)
    short_name = fields.CharField(max_length=2)

    class Meta:
        table = "bible_testaments"
        using_db = "bible"

    def __str__(self):
        return f"Testament {self.name}"


class BibleBook(Model):
    # Genesis, exodus etc
    id = fields.IntField(primary_key=True)
    name = fields.CharField(max_length=100, unique=True)
    testament = fields.ForeignKeyField(
        "bible_models.BibleTestament", related_name="books", on_delete=fields.NO_ACTION
    )
    author = fields.CharField(max_length=100, null=True)
    date = fields.CharField(max_length=100, null=True)
    genre = fields.CharField(max_length=100, null=True)
    chapters = fields.IntField(null=True)
    summary = fields.TextField(null=True)

    class Meta:
        table = "bible_books"
        using_db = "bible"

    def __str__(self):
        return f"Bible Book {self.name}"


class BibleVersion(Model):
    id = fields.IntField(primary_key=True)
    name = fields.CharField(max_length=100)
    short_name = fields.CharField(max_length=50, null=True)

    class Meta:
        table = "bible_versions"
        using_db = "bible"

    def __str__(self):
        return f"Bible Version {self.name}"


class BibleContent(Model):
    id = fields.IntField(primary_key=True)
    heading = fields.CharField(max_length=300, null=True)
    passage = fields.ForeignKeyField(
        "bible_models.BibleBook", related_name="passages", on_delete=fields.NO_ACTION
    )
    chapter = fields.IntField(null=True)
    verse = fields.IntField(null=True)
    text = fields.TextField(null=True)
    version = fields.ForeignKeyField(
        "bible_models.BibleVersion", related_name="versions", on_delete=fields.NO_ACTION
    )

    class Meta:
        table = "bible_content"
        unique_together = (("chapter", "verse"),)
        using_db = "bible"

    def __str__(self):
        return f"{self.passage.id} {self.chapter}:{self.verse}"


class DailyVerse(Model):
    id = fields.IntField(primary_key=True)
    book = fields.ForeignKeyField(
        "bible_models.BibleContent", related_name="bible_book", on_delete=fields.CASCADE
    )
    created_at = fields.DatetimeField(auto_now_add=True)
    
    class Meta:
        table = "daily_verse"
        ordering = "created_at"
        using_db = "bible"