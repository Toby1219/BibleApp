use crate::cache::SearchCache;
use crate::entity::schemas::BibleSchema;
use actix_web::{HttpResponse, Responder, web};
use serde::{Deserialize, Serialize};
use tantivy::collector::{Collector, TopDocs};
use tantivy::snippet::{Snippet, SnippetGenerator};
use tantivy::{Index, IndexReader, TantivyDocument};
use tantivy::query::QueryParser;


pub struct AppState {
    pub index: Index,
    pub reader: IndexReader,
    pub schema: BibleSchema,
    pub cache: SearchCache,
}

#[derive(Deserialize)]
pub struct SearchQuery {
    q: String,
    limit: Option<usize>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct VerseResult {
    reference: String,
    snippet: String,
    score: f32,
}

pub async fn search(
    state: web::Data<AppState>,
    query: web::Query<SearchQuery>,
) -> actix_web::Result<impl Responder> {
    let limit = query.limit.unwrap_or(10);
    let cache_key = SearchCache::key_for(&query.q, limit);

    if let Some(cached) = state.cache.get::<Vec<VerseResult>>(&cache_key).await {
        return Ok(HttpResponse::Ok().json(cached));
    }

    let query_parser = QueryParser::for_index(&state.index, vec![state.schema.text]);
    let parsed_query = query_parser
        .parse_query(&query.q)
        .map_err(|e| actix_web::error::ErrorBadRequest(format!("invalid search query: {e}")))?;

    let searcher = state.reader.searcher();
    let top_docs = searcher
        .search(&parsed_query, &TopDocs::with_limit(limit))
        .map_err(|e| actix_web::error::ErrorInternalServerError(format!("search failed: {e}")))?;

    Ok(HttpResponse::Ok().json(results))
}
