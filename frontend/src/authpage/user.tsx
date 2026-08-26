import { BookOpen, Bookmark, Search, Clock, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";
import { apiRequest } from "../axiosinit";
import { useGlobalVar, type Bookmarks, type SearchHistory, type VERSE_OF_DAY } from "../globalvar";
// ---------------------------------------------------------------------------
// Placeholder data — swap for real user/session data from your API.
// ---------------------------------------------------------------------------

export default function ProfilePage() {
    const currentUser = useGlobalVar((state)=>state.user);
    const setUserData = useGlobalVar((state)=>state.setUserData);
    const [bookmark_passage, setBookmarks] = useState<Bookmarks | []>([]);
    const [bookmark_count, setBookmarkCount] = useState(0);
    const [search_history, setSearchHistory] = useState<SearchHistory | []>([]);
    const [search_count, setSearchCount] = useState(0);
    const navigate = useNavigate();
    const [verse_of_the_day, setVerseDay] = useState<VERSE_OF_DAY>();

    useEffect(() => {
        apiRequest("get", "/bible/day-verse").then((resp)=>{ setVerseDay(resp.data) });
        apiRequest("get", "/auth/me").then((resp)=>{
            if (resp.status === 401){
                navigate("/login");
            }
            setUserData(resp.data);
            setSearchHistory(resp.data.search_history);
            setSearchCount(resp.data.search_count)
            apiRequest("get", "/auth/bookmark").then((resp)=>{
                setBookmarks(resp.data.bookmark_passage);
                setBookmarkCount(resp.data.bookmark_count);
            });

        });
    }, []);

    const USER = {
        name: currentUser?.username,
        email: currentUser?.email,
        memberSince: currentUser?.created_at,
        initials: "EA",
        stats: { bookmarks: bookmark_count, searches: search_count},
    };

    const VERSE_OF_DAY = verse_of_the_day;

    const BOOKMARKS = bookmark_passage;

    const SEARCH_HISTORY = search_history;

    const parseRef = (ref: string): { book: string; chapter: number; verse: number } => {
        const match = ref.match(/^(.+)\s(\d+):(\d+)$/);
        if (!match) throw new Error(`Invalid reference format: "${ref}"`);

        const [, book, chapter, verse] = match;
        return {
            book,
            chapter: parseInt(chapter, 10),
            verse: parseInt(verse, 10),
        };
    }

    const handleBookmarkNav = (ref:string)=>{
        const passage_ = parseRef(ref);
        apiRequest("post", "/bible/passage/book", {book_name:passage_.book, chapter:passage_.chapter, verse:passage_.verse}).then((resp)=>{
            if (resp.status === 200){
                navigate(`/bible?book=${passage_.book}&chapter=${passage_.chapter}&verse=${passage_.verse}`);
            }
        })
    }

    const handleSearchNav = (ref:string)=>{
        const passage_ = parseRef(ref);
        apiRequest("post", "/bible/passage/book", {book_name:passage_.book, chapter:passage_.chapter, verse:passage_.verse}).then((resp)=>{
            if (resp.status === 200){
                navigate(`/bible?book=${passage_.book}&chapter=${passage_.chapter}&verse=${passage_.verse}`);
            }
        })
    }

    const handleLogout = ()=>{
        apiRequest("post", "/auth/logout").then((resp)=>{
            if(resp.status === 200){
                navigate("/login")
            }
        })
    }

    return (
        <div className="w-full min-h-screen bg-grey">
            {/* ----------------------------------------------------------------- */}
            {/* Header                                                            */}
            {/* ----------------------------------------------------------------- */}
            <header className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 flex items-center justify-between">
                <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
                    <BookOpen size={20} className="text-[#7B2942]" strokeWidth={1.5} />
                    <span className="bh-mono text-xs uppercase text-stone-900">
                        Holy Bible
                    </span>
                </div>
                <nav className="flex items-center gap-6 bh-mono text-[10px] sm:text-[11px] uppercase text-stone-500">
                    <a onClick={()=>navigate("/bible")} className="hover:text-[#7B2942] transition-colors cursor-pointer">
                        Read
                    </a>
                    <a onClick={()=>handleLogout()} className="text-[#7B2942] cursor-pointer">
                        logout
                    </a>
                </nav>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 pt-10 sm:pt-14 pb-20 space-y-12 sm:space-y-16">
                {/* ------------------------------------------------------------- */}
                {/* User details — styled as a bookplate / flyleaf inscription    */}
                {/* ------------------------------------------------------------- */}
                <section id="profile" className="bh-fade-in bh-fade-in-1">
                    <div className="relative border border-stone-200 px-6 sm:px-10 py-10 sm:py-12 text-center">
                        <span className="bh-corner bh-corner-tl border-[#7B2942]/40" />
                        <span className="bh-corner bh-corner-tr border-[#7B2942]/40" />
                        <span className="bh-corner bh-corner-bl border-[#7B2942]/40" />
                        <span className="bh-corner bh-corner-br border-[#7B2942]/40" />

                        <p className="bh-mono text-[13px] uppercase text-stone-400 mb-6">
                            This Bible belongs to
                        </p>

                        <div className="w-16 h-16 rounded-full bg-[#7B2942] text-white flex items-center justify-center mx-auto mb-5">
                            <span className="bh-display text-xl">{USER.initials}</span>
                        </div>

                        <h1 className="bh-display text-2xl sm:text-3xl text-stone-900 mb-1.5">
                            {USER.name}
                        </h1>
                        <p className="bh-body text-sm text-stone-500 mb-8">{USER.email}</p>

                        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-stone-100 pt-6">
                            <div>
                                <p className="bh-display text-lg text-[#7B2942]">
                                    {USER.stats.bookmarks}
                                </p>
                                <p className="bh-mono text-[10px] uppercase text-stone-400 mt-0.5">
                                    Bookmarks
                                </p>
                            </div>
                            <div>
                                <p className="bh-display text-lg text-[#7B2942]">
                                    {USER.stats.searches}
                                </p>
                                <p className="bh-mono text-[10px] uppercase text-stone-400 mt-0.5">
                                    Searches
                                </p>
                            </div>
                            
                            <div>
                                <p className="bh-display text-lg text-stone-700">
                                    {USER.memberSince ? new Date(USER.memberSince).toLocaleDateString() : ""}
                                </p>
                                <p className="bh-mono text-[10px] uppercase text-stone-400 mt-0.5">
                                    Member since
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* Verse of the day                                               */}
                {/* ------------------------------------------------------------- */}
                <section className="bh-fade-in bh-fade-in-2">
                    <p className="bh-mono text-1xl uppercase text-stone-400 mb-4">
                        Verse of the day
                    </p>
                    <div className="bh-ribbon px-6 sm:px-8 pt-6 pb-9 bg-[#7B2942] max-w-md">
                        <p className="bh-body text-base sm:text-lg leading-relaxed text-white mb-3">
                            &ldquo;{VERSE_OF_DAY ? VERSE_OF_DAY.text : "Daily verse text"}&rdquo;
                        </p>
                        <p className="bh-mono text-[13px] uppercase text-[#E8B4C0] py-3">
                            {VERSE_OF_DAY ? VERSE_OF_DAY.book : "Daily verse book"}
                        </p>
                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* Bookmarked passages                                            */}
                {/* ------------------------------------------------------------- */}
                <section className="bh-fade-in bh-fade-in-2">
                    <div className="flex items-center gap-2 mb-5">
                        <Bookmark size={15} strokeWidth={2} className="text-[#7B2942]" />
                        <p className="bh-mono text-1xl uppercase text-stone-400">
                            Bookmarked passages
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                        {BOOKMARKS.length > 0 ?(
                            BOOKMARKS.map((b) => (
                                <button
                                    onClick={()=>handleBookmarkNav(b.ref)}
                                    key={b.ref}
                                    className="group text-left border-l-2 border-stone-200 hover:border-[#7B2942] pl-4 py-1 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="bh-display text-sm text-stone-900 group-hover:text-[#7B2942] transition-colors">
                                            {b.ref}
                                        </p>
                                        <ArrowUpRight
                                            size={14}
                                            strokeWidth={2}
                                            className="text-stone-300 group-hover:text-[#7B2942] opacity-0 group-hover:opacity-100 transition-all"
                                        />
                                    </div>
                                    <p className="bh-body text-[14px] leading-snug text-stone-500 mb-1.5">
                                        {b.snippet}
                                    </p>
                                    <p className="bh-mono text-[11px] uppercase text-stone-400">
                                        Saved {new Date(b.created_at).toLocaleString()}
                                    </p>
                                </button>
                            ))
                            ):(
                                <p className="text-stone-400 text-xl p-3">No Bookmarked Passage ...</p>
                            )}
                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* Search history — concordance-style log                        */}
                {/* ------------------------------------------------------------- */}
                <section className="bh-fade-in bh-fade-in-3">
                    <div className="flex items-center gap-2 mb-5">
                        <Clock size={15} strokeWidth={2} className="text-[#7B2942]" />
                        <p className="bh-mono text-1xl uppercase text-stone-400">
                            Search history
                        </p>
                    </div>

                    <div className="border border-stone-200 divide-y divide-stone-100">
                        {/* header row — desktop only */}
                        <div className="hidden sm:grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-3 bg-stone-50">
                            <p className="bh-mono text-sm uppercase text-stone-400">
                                Search phrase
                            </p>
                            <p className="bh-mono text-sm uppercase text-stone-400">
                                Passage viewed
                            </p>
                            <p className="bh-mono text-sm uppercase text-stone-400">
                                When
                            </p>
                        </div>

                        {SEARCH_HISTORY.length > 0 ? (
                            SEARCH_HISTORY.map((h, i) => (
                                <button
                                    onClick={()=>{handleSearchNav(h.book)}}
                                    key={i}
                                    className="group w-full text-left grid sm:grid-cols-[1fr_1fr_auto] gap-1.5 sm:gap-4 sm:items-center px-5 py-4 hover:bg-stone-50 transition-colors"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Search
                                            size={15}
                                            strokeWidth={2}
                                            className="text-stone-300 shrink-0 sm:hidden"
                                        />
                                        <p className="bh-mono text-sm text-stone-600 truncate">
                                            {h.phrase.toUpperCase()}
                                        </p>
                                    </div>
                                    <p className="bh-body text-sm text-stone-600 group-hover:text-[#7B2942] transition-colors truncate">
                                        {h.book}
                                    </p>
                                    <p className="bh-mono text-sm uppercase text-stone-600 whitespace-nowrap">
                                        {new Date(h.created_at).toLocaleDateString()}
                                    </p>
                                </button>
                            ))
                        ) : (
                            <p className="text-stone-400 text-xl text-center p-3">No Search History ...</p>
                        )}
                    </div>
                </section>
            </main>

            <footer className="border-t border-stone-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-8">
                    <p className="bh-mono text-[11px] uppercase text-stone-400">
                        Holy Bible — a quiet place to read
                    </p>
                </div>
            </footer>
        </div>
    );
}
