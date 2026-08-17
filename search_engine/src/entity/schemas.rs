use tantivy::schema::{Field, INDEXED, STORED, STRING, Schema, TEXT};

pub struct BibleSchema {
    pub schema: Schema,
    pub book: Field,
    pub chapter: Field,
    pub verse: Field,
    pub text: Field,
}

impl BibleSchema {
    pub fn build_schema() -> Self {
        let mut builder = Schema::builder();
        let book = builder.add_text_field("book", STRING | STORED);
        let chapter = builder.add_u64_field("chapter", STORED | INDEXED);
        let verse = builder.add_u64_field("verse", STORED | INDEXED);
        let text = builder.add_text_field("text", TEXT | STORED);
        let schema = builder.build();
        Self {
            schema,
            book,
            chapter,
            verse,
            text,
        }
    }
}
