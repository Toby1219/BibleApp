use crate::cache::SearchCache;
use crate::entity::schemas::BibleSchema;
use actix_web::{HttpResponse, Responder, web};
use serde::{Deserialize, Serialize};
use tantivy::collector::TopDocs;
use tantivy::snippet::SnippetGenerator;
use tantivy::{Index, IndexReader, TantivyDocument};
use tantivy::query::QueryParser;
use tantivy::schema::Value;


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
        .search(&parsed_query, &TopDocs::with_limit(limit).order_by_score())
        .map_err(|e| actix_web::error::ErrorInternalServerError(format!("search failed: {e}")))?;
    
    // 4. Build a snippet generator once — this is what produces the highlighted excerpt
    //    around the matched terms, instead of the whole verse or a manual find/replace.
    let mut snippet_generator = SnippetGenerator::create(&searcher, &parsed_query, state.schema.text)
        .map_err(|e| actix_web::error::ErrorInternalServerError(format!("snippet generator failed: {e}")))?;
    snippet_generator.set_max_num_chars(200); // cap excerpt length

    // 5. Turn each hit into a VerseResult.
    let mut results = Vec::with_capacity(top_docs.len());
    for (score, doc_address) in top_docs {
        let retrieved: TantivyDocument = searcher.doc(doc_address)
            .map_err(|e| actix_web::error::ErrorInternalServerError(format!("doc fetch failed: {e}")))?;

        let book = retrieved
            .get_first(state.schema.book)
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string();
        let chapter = retrieved.get_first(state.schema.chapter).and_then(|v| v.as_u64()).unwrap_or(0);
        let verse = retrieved.get_first(state.schema.verse).and_then(|v| v.as_u64()).unwrap_or(0);

        let snippet = snippet_generator.snippet_from_doc(&retrieved);
        let highlighted = snippet.to_html(); // wraps matched terms in <b>...</b>

        results.push(VerseResult {
            reference: format!("{book} {chapter}:{verse}"),
            snippet: highlighted,
            score,
        });
    }

    // 6. Cache and return.
    state.cache.set(&cache_key, &results, 300).await.ok();
    Ok(HttpResponse::Ok().json(results))
}
