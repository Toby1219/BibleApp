use anyhow::{Context, Result};
use sqlx::postgres::PgPoolOptions;
use tantivy::{Index, doc};

use search_engine::entity::schemas::BibleSchema;

struct VerseRow {
    book_name: String,
    chapter: i32,
    verse: i32,
    text: String,
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenvy::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

    let db_url = std::env::var("DATABASE_URL").expect("Invalid data base url ...");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
        .context("failed to connect to bible postgres database")?;

    let rows: Vec<VerseRow> = sqlx::query_as!(
        VerseRow,
        r#"
        SELECT
           bb.name          AS "book_name!",
           bc.chapter       AS "chapter!",
           bc.verse         AS "verse!",
           bc.text          AS "text!"
        FROM bible_content bc
        JOIN bible_books bb on bb.id = bc.passage_id
        WHERE bc.text IS NOT NULL AND bc.chapter IS NOT NULL AND bc.verse IS NOT NULL
        "#
    )
    .fetch_all(&pool)
    .await
    .context("failed to fetch verses")?;

    log::info!("fetched {} verses to index", rows.len());

    let bible_schema = BibleSchema::build_schema();
    let index_path = "./bible_index";
    std::fs::create_dir_all(index_path)?;
    let index = Index::create_in_dir(index_path, bible_schema.schema.clone()).context("failed to create tantivy index (does ./bible_index already exist with a different schema? delete it and retry)")?;

    let mut writer = index
        .writer(50_000_000)
        .context("failed to create index writer")?;

    for row in &rows {
        writer.add_document(doc!(
            bible_schema.book => row.book_name.clone(),
            bible_schema.chapter => row.chapter as u64,
            bible_schema.verse => row.verse as u64,
            bible_schema.text => row.text.clone(),
        ))?;
    }

    writer.commit().context("failed t commit index")?;

    log::info!("indexed {} verses into {}", rows.len(), index_path);

    Ok(())
}
