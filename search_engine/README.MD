# 🔍 Search engine

> Hybrid semantic search powered by rust tantivy and served through actix-web 

![Rust](https://img.shields.io/badge/Rust-Search_Engine-000000?style=flat-square&logo=rust&logoColor=white)

## 🗂️ Folder Structure
```bash
|
├── bible_index/ ()
│   
├── Cargo.lock
├── Cargo.toml
└── src
    ├── bin
    │   └── index_bible.rs
    ├── cache.rs
    ├── entity
    │   ├── mod.rs
    │   └── schemas.rs
    ├── handlers
    │   ├── mod.rs
    │   └── search.rs
    ├── lib.rs
    └── main.rs
```