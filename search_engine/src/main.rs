use actix_web::{App, HttpServer, middleware::Logger, web};
use tantivy::Index;

pub mod cache;
pub mod entity;
pub mod handlers;

use cache::SearchCache;
use entity::schemas::BibleSchema;
use handlers::search::{AppState, search};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));

    // --- open the index built by index_bible ---
    let bible_schema = BibleSchema::build_schema();
    let index = Index::open_in_dir("./bible_index")
        .expect("failed to open ./bible_index — did you run `cargo run --bin index_bible` first?");

    // reader gives you a searchable snapshot; ReloadPolicy::OnCommitWithDelay auto-refreshes
    // it if you re-run the indexer while the server is up
    let reader = index
        .reader_builder()
        .reload_policy(tantivy::ReloadPolicy::OnCommitWithDelay)
        .try_into()
        .expect("failed to build index reader");

    // --- Redis cache, same as your existing setup ---
    let redis_url = std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1/".into());
    let cache = SearchCache::connect(&redis_url)
        .await
        .expect("failed to connect to Redis");

    let state = web::Data::new(AppState {
        index,
        reader,
        schema: bible_schema,
        cache,
    });

    log::info!("starting server on 127.0.0.1:8081");

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(state.clone())
            .route("/search", web::get().to(search))
    })
    .bind(("127.0.0.1", 8081))?
    .run()
    .await
}
