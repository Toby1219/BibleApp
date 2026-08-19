import { useState, useEffect, type KeyboardEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, ChevronRight, X, Loader } from "lucide-react";
import "./search.css";

import { apiRequest } from "../axiosinit";
import { useGlobalVar } from "../globalvar";


interface SearchResult {
  book: string; // Name of the Bible book (e.g., "Genesis")
  chapter: number; // Chapter number
  verse: number; // Verse number
  text: string; // The actual Bible verse text
}

interface SearchState {
  results: SearchResult[]; // Array of matching verses
  isLoading: boolean; // True while API is fetching
  error: string | null; // Error message if search fails
  totalCount: number; // Total number of results found
}


export default function SearchResults() {
    const MIN = 20;
    const MAX = 100;
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    // Retrieve current user from global state
    const currentUser = useGlobalVar((state) => state.user);

    // Local search input — user can refine their search on this page
    const [localQuery, setLocalQuery] = useState("");
    // Track whether the user has performed a new search (beyond the initial URL param)
    const [hasSearched, setHasSearched] = useState(false);
    // Store search results, loading state, errors, and total count
    const [searchState, setSearchState] = useState<SearchState>({
        results: [],
        isLoading: false,
        error: null,
        totalCount: 0,
    });
    // Mobile search visibility toggle
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    // Current active query being displayed (used to show "Search for: ___")
    const [activeQuery, setActiveQuery] = useState("");

    const q = searchParams.get("q") || "";
    const [limit, setLimit]  = useState(Number(searchParams.get("limit")) || 30);


    // -------------------------------------------------------------------------
    // FETCH SEARCH RESULTS
    // -------------------------------------------------------------------------

    const performSearch = async (query: string, limit: number) => {
        // Don't search if query is empty or only whitespace
        if (!query.trim()) {
            setSearchState({ results: [], isLoading: false, error: null, totalCount: 0 });
            setActiveQuery("");
            return;
        }

        // Set loading state to show spinner
        setSearchState((prev) => ({ ...prev, isLoading: true, error: null }));
        setActiveQuery(query.trim());

        try {
            const response = await apiRequest("get", `/bible/search?q=${query}&limit=${limit }`,);
            console.log(response.data);
            setSearchState({
                results: response.data || [],
                isLoading: false,
                error: null,
                totalCount: response.data.length || 0,
            });
            setHasSearched(true);
            window.history.replaceState(null, "", `?q=${query}&limit=${limit}`);
        } catch (err) {
            setSearchState({
                results: [],
                isLoading: false,
                error: "Failed to search. Please try again.",
                totalCount: 0,
            });
            setHasSearched(true);
        }
    };

    useEffect(() => {
        setLocalQuery(q);
        if (q) {
            performSearch(q, limit);
        }
    }, []);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (localQuery.trim()) {
            console.log(localQuery);
            performSearch(localQuery, limit);
            setMobileSearchOpen(false);
        }
    };

    const handleResultClick = (result: SearchResult) => {
        apiRequest("post", "/bible/passage/book", {
            bible: result.book,
            chapter: result.chapter,
            verse: result.verse,
        });
        navigate(
        `/bible?book=${encodeURIComponent(result.book)}&chapter=${result.chapter}&verse=${result.verse}`
        );
    };

    const highlightText = (text: string, query: string): React.ReactNode => {
        if (!query.trim()) return text;

        const parts = text.split(new RegExp(`(${query})`, "gi"));

        return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-100 font-semibold text-stone-900">
            {part}
            </mark>
        ) : (
            <span key={i}>{part}</span>
        )
        );
    };

    const limitHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (!localQuery.trim()){ return }
        if (event.key == "Enter" && localQuery.length > 1){
            performSearch(localQuery, limit);

        }
    };
    
    const handleChange = (e: any) => {
        const value = e.target.value;

        if (value === ""){setLimit(30); return;}

        const numValue = Number(value);
        if (numValue >= MIN && numValue <= MAX){
            setLimit(numValue);
        }
    };


    return (
        <div className="w-full min-h-screen bg-white">
        <header className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 pt-6 sm:pt-8">
            <div className="flex items-center justify-between gap-3">
            {/* Logo & branding — clickable to return home */}
            <div
                className="flex items-center gap-2.5 shrink-0 cursor-pointer"
                onClick={() => navigate("/")}
            >
                <BookOpen size={20} className="text-[#7B2942]" strokeWidth={1.5} />
                <span className="bh-mono text-[20px] uppercase py-3 text-stone-900">
                Holy Bible
                </span>
            </div>

            {/* User navigation — desktop only */}
            {currentUser && (
                <nav className="hidden md:flex items-center gap-6 bh-mono text-[13px] uppercase text-stone-500 shrink-0 cursor-pointer p-3">
                <a
                    onClick={() => {
                    navigate("/profile");
                    }}
                    className="hover:text-[#7B2942] transition-colors"
                >
                    {currentUser?.username}
                </a>
                </nav>
            )}

            {/* Desktop search form — visible on tablets and larger screens */}
            <form
                onSubmit={handleSearchSubmit}
                className="hidden sm:block relative flex-1 max-w-xs ml-auto"
            >
                {/* Search icon overlay */}
                <Search
                size={15}
                strokeWidth={2}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7B2942]"
                />
                {/* Search input field */}
                <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search a verse…"
                aria-label="Search for a verse"
                className="bh-mono w-full text-[14px] uppercase tracking-widest pl-9 pr-3 py-2.5 rounded-sm border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B2942] transition-colors"
                />
            </form>

            {/* Mobile search toggle — visible on phones only */}
            <button
                className="sm:hidden shrink-0 p-2 -mr-2 text-[#7B2942]"
                onClick={() => setMobileSearchOpen((v) => !v)}
                aria-label={mobileSearchOpen ? "Close search" : "Open search"}
                aria-expanded={mobileSearchOpen}
            >
                {/* Toggle between X and search icons */}
                {mobileSearchOpen ? (
                <X size={18} strokeWidth={1.5} />
                ) : (
                <Search size={18} strokeWidth={1.5} />
                )}
            </button>
            </div>

            {/* Mobile search form — slides in below header on phones */}
            {mobileSearchOpen && (
            <form
                onSubmit={handleSearchSubmit}
                className="sm:hidden relative mt-4 bh-fade-in"
            >
                {/* Search icon overlay */}
                <Search
                size={14}
                strokeWidth={1.5}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7B2942]"
                />
                {/* Mobile search input */}
                <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search a verse…"
                aria-label="Search for a verse"
                autoFocus
                className="bh-mono w-full text-[11px] tracking-widest pl-9 pr-3 py-3 rounded-sm border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B2942] transition-colors"
                />
            </form>
            )}
        </header>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-10 sm:py-16">
            {/* Search heading */}
            <div className="mb-8 bh-fade-in">
            <h1 className="bh-display text-2xl sm:text-3xl text-stone-900 mb-2">
                Search Results
            </h1>
            {activeQuery && (
                <p className="bh-mono text-sm text-stone-500 uppercase">
                Results for{" "}
                <span className="font-semibold text-[#7B2942]">"{activeQuery}"</span>
                </p>
            )}
            </div>

            {/* LOADING STATE: Show spinner while fetching */}
            {searchState.isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
                {/* Loading spinner animation */}
                <Loader size={32} className="text-[#7B2942] animate-spin mb-4" />
                <p className="bh-mono text-sm text-stone-500 uppercase">
                Searching the Bible…
                </p>
            </div>
            )}

            {/* ERROR STATE: Show error message if search failed */}
            {!searchState.isLoading && searchState.error && (
            <div className="p-6 bg-red-50 border border-red-200 rounded-sm">
                <p className="bh-body text-red-700">{searchState.error}</p>
                <button
                onClick={() => performSearch(activeQuery, limit)}
                className="mt-3 bh-mono text-xs uppercase px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors"
                >
                Retry
                </button>
            </div>
            )}

            {/* EMPTY STATE: No results found */}
            {!searchState.isLoading &&
            !searchState.error &&
            searchState.results.length === 0 &&
            hasSearched && (
                <div className="text-center py-16">
                <p className="bh-body text-stone-500 mb-4">
                    No verses found for "{activeQuery}".
                </p>
                <p className="bh-mono text-xs uppercase text-stone-400">
                    Try a different search term
                </p>
                </div>
            )}

            {/* INITIAL STATE: Guide user to search */}
            {!searchState.isLoading &&
            !searchState.error &&
            !hasSearched &&
            searchState.results.length === 0 && (
                <div className="text-center py-16">
                <Search size={48} className="mx-auto mb-4 text-stone-300" />
                <p className="bh-body text-stone-500 mb-2">
                    Start typing to search the Bible
                </p>
                <p className="bh-mono text-xs uppercase text-stone-400">
                    Search by keyword, book name, or reference
                </p>
                </div>
            )}

            {/* RESULTS LIST: Display all matching verses */}
            {!searchState.isLoading && searchState.results.length > 0 && (
            <div className="space-y-4 bh-fade-in">
                {/* Result count summary */}
                <div>
                    <input
                        onKeyDown={limitHandler}
                        onChange={handleChange}
                        type="number"
                        value={limit}
                        min={MIN}
                        max={MAX}
                        className="flex items-center gap-2 py-1.5 px-3 bg-white border border-gray-300 rounded cursor-pointer w-16.5"
                    />
                
                </div>
                <p className="bh-mono text-xs uppercase text-stone-400 mb-6">
                Found {searchState.totalCount} result{searchState.totalCount !== 1 ? "s" : ""}
                </p>

                {/* Map through results and render each as a clickable card */}
                {searchState.results.map((result, index) => (
                <button
                    key={`${result.book}-${result.chapter}-${result.verse}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-4 sm:p-5 border border-stone-200 rounded-sm hover:border-[#7B2942] hover:bg-stone-50 transition-all group"
                >
                    {/* Result header: Book, Chapter:Verse reference */}
                    <div className="flex items-baseline justify-between mb-2.5">
                    {/* Book name and reference (e.g., "Genesis 1:1") */}
                    <p className="bh-mono text-sm sm:text-base font-semibold text-[#7B2942] flex items-center gap-2">
                        {result.book}
                        {/* Separator dot */}
                        <span className="text-stone-300">•</span>
                        {result.chapter}:{result.verse}
                        {/* Hover indicator chevron */}
                        <ChevronRight
                        size={16}
                        strokeWidth={2}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                        />
                    </p>
                    </div>

                    {/* Verse text with highlighted search query */}
                    <p className="bh-body text-sm sm:text-base leading-relaxed text-stone-700 line-clamp-3">
                    "{highlightText(result.text, activeQuery)}"
                    </p>
                </button>
                ))}
            </div>
            )}
        </section>

        <footer className="border-t border-stone-100 mt-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="bh-mono text-[11px] uppercase text-stone-400">
                Holy Bible — a quiet place to read
            </p>
            <p className="bh-mono text-[11px] uppercase text-stone-400">
                66 books · Old &amp; New Testament
            </p>
            </div>
        </footer>
        </div>
    );
}
