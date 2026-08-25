#!/bin/sh
set -e
# STop if indexing fails and never served queries

if [ ! -f ./bible_index/meta.json ]; then
    # meta.json is tantivy's index manifest — its absence means no index exists yet
    echo "no index found, building..."
    ./index_bible
else
    echo "existing index found, skipping build"
fi

exec ./search_engine

