import { useState, useEffect } from "react";
import {
    BookOpen,
    Search,
    X,
    Bookmark,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
} from "lucide-react";
import "./bible.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../axiosinit";
import { useGlobalVar, type Bookmarks } from "../globalvar";


const FONT_SCALE = ["text-base", "text-lg", "text-xl"];

type VerseTexts = {
    num: number,
    text: string,
    bookmarked: boolean
}[];

export default function ReaderPage() {
    const currentUser = useGlobalVar((state)=>state.user);
    const setUserData = useGlobalVar((state)=>state.setUserData);

    const [query, setQuery] = useState("");
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<number>>(new Set());
    const [fontStep, setFontStep] = useState(1);
    const [searchParams] = useSearchParams();

    const [book, setBook] = useState(searchParams.get("book"));
    const [chapter, setChapter] = useState(searchParams.get("chapter") ? Number(searchParams.get("chapter")) : 1);
    const [verse, setVerse] = useState(searchParams.get("verse"));
    
    const [testament, setTestament] = useState("Old Testment");
    const [totalChapters, setTotalChapters] = useState<number>(1);
    const [heading, setHeading] = useState<string>();
    const [verse_text, setVerseTexts] = useState<VerseTexts>([]);

    const [bookmark_passage, setBookmarks] = useState<Bookmarks | []>([]);
    
    const navigate = useNavigate();


    useEffect(()=>{
        if (!book){
            navigate("/");
        }
        apiRequest("get", "/auth/me").then((resp)=>{
            setUserData(resp.data);
            apiRequest("get", "/auth/bookmark").then((resp)=>{
                setBookmarks(resp.data.bookmark_passage);
            });

        });

        apiRequest("post", "/bible/passage", {book_name:book, chapter:chapter}).then((response)=>{
            const data = response.data;
            const newVerse = data.data.map((item: any) => ({
                num: Number(item.verse),
                text: item.text,
                bookmarked: false
            }));
            setHeading(data.heading)
            setTestament(data.testament);
            setTotalChapters(Number(data.total_chapters));
            setVerseTexts([...newVerse]);
        })
    }, [])

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

    const CHAPTER = {
        book: book,
        testament: testament,
        chapterNumber: chapter,
        totalChapters: totalChapters,
        verses:verse_text
    }

    const isFirst = CHAPTER.chapterNumber <= 1;
    const isLast = CHAPTER.chapterNumber >= CHAPTER.totalChapters;

    const handlePage = (page_state:string)=>{
        setVerseTexts([]);
        setHeading("");
        setTestament("");
        window.scrollTo({ top: 0 });
        const nextChapter = page_state === "next" ? chapter + 1 : chapter - 1;
        
        apiRequest("post", "/bible/passage", {book_name:book, chapter:nextChapter}).then((response)=>{
            console.log(response.data)
            if (response.status === 200){
                const data = response.data;
                const newVerse = data.data.map((item: any) => ({
                    num: Number(item.verse),
                    text: item.text,
                }));
                setHeading(data.heading)
                setTestament(data.testament);
                setTotalChapters(Number(data.total_chapters));
                setVerseTexts([...newVerse]);
                setBook(searchParams.get("book"));
                setChapter(nextChapter);
                setVerse(searchParams.get("verse"));
                
                navigate(`/bible?book=${book}&chapter=${nextChapter}&verse=${verse}`);
            }
        });
    }

    const handleBookMark = () => {
        apiRequest("post", "/auth/save_bookmark", {book_name:book, chapter:chapter}).then((resp)=>{
            if (resp.status === 200){
                setBookmarked((b) => !b);
            }
        })
    }

    const handleBookMarkVerse = async (verse: number) => {
        const resp = await apiRequest("post", "/auth/save_bookmark", {
            book_name: book,
            chapter,
            verse,
        });

        if (resp.status === 200) {
            setBookmarkedVerses(prev => {
                const next = new Set(prev);

                if (next.has(verse)) {
                    next.delete(verse);
                } else {
                    next.add(verse);
                }

                return next;
            });
        }
    };

    useEffect(()=>{
        if (!currentUser) return;

        const bookmarkBooks = bookmark_passage.map((bm)=>{
            return parseRef(bm.ref);
        })

        const verses = bookmarkBooks.filter((b)=> b.book === book && b.chapter === chapter).map((b)=>b.verse);
        setBookmarkedVerses(new Set(verses))
        
    }, [bookmark_passage, book, chapter, currentUser])

    useEffect(() => {
        if (!verse || verse_text.length === 0) return;

        const element = document.getElementById(`verse-${verse}`);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [verse, verse_text]);

    
    return (
        <div className="w-full min-h-screen bg-white">
            {/* ----------------------------------------------------------------- */}
            {/* Header (shared with homepage)                                     */}
            {/* ----------------------------------------------------------------- */}
            <header className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 pt-6 sm:pt-8">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => navigate("/")}>
                        <BookOpen size={20} className="text-[#7B2942]" strokeWidth={1.5} />
                        <span className="bh-mono text-[20px] uppercase text-stone-900">
                            Holy Bible
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 bh-mono text-[11px] uppercase text-stone-500 shrink-0">
                        <a
                            onClick={()=>{navigate("/profile")}}
                            className="hover:text-[#7B2942] transition-colors"
                        >
                            Profile
                        </a>
                    </nav>

                    <div className="hidden sm:block relative flex-1 max-w-xs ml-auto">
                        <Search
                            size={14}
                            strokeWidth={1.5}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7B2942]"
                        />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search a book…"
                            aria-label="Search a book"
                            className="bh-mono w-full text-[11px] uppercase tracking-widest pl-9 pr-3 py-2.5 rounded-sm border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B2942] transition-colors"
                        />
                    </div>

                    <button
                        className="sm:hidden shrink-0 p-2 -mr-2 text-[#7B2942]"
                        onClick={() => setMobileSearchOpen((v) => !v)}
                        aria-label={mobileSearchOpen ? "Close search" : "Open search"}
                        aria-expanded={mobileSearchOpen}
                    >
                        {mobileSearchOpen ? (
                            <X size={18} strokeWidth={1.5} />
                        ) : (
                            <Search size={18} strokeWidth={1.5} />
                        )}
                    </button>
                </div>

                {mobileSearchOpen && (
                    <div className="sm:hidden relative mt-4 bh-fade-in">
                        <Search
                            size={14}
                            strokeWidth={1.5}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7B2942]"
                        />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search a book…"
                            aria-label="Search a book"
                            autoFocus
                            className="bh-mono w-full text-[11px] uppercase tracking-widest pl-9 pr-3 py-3 rounded-sm border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B2942] transition-colors"
                        />
                    </div>
                )}
            </header>

            {/* ----------------------------------------------------------------- */}
            {/* Chapter                                                           */}
            {/* ----------------------------------------------------------------- */}
            <main className="max-w-2xl mx-auto px-4 sm:px-6 md:px-10 pt-10 sm:pt-14 pb-16">
                {/* Breadcrumb + progress */}
                <div className="flex items-center justify-between mb-6 bh-fade-in">
                    <p className="bh-mono text-[10px] uppercase text-stone-400">
                        {CHAPTER.testament} <span className="text-stone-300 mx-1">/</span>{" "}
                        {CHAPTER.book} {CHAPTER.chapterNumber}
                    </p>
                    <p className="bh-mono text-[10px] uppercase text-stone-400">
                        Ch. {CHAPTER.chapterNumber} of {CHAPTER.totalChapters}
                    </p>
                </div>

                {/* Chapter title + controls */}
                <div className="flex items-center justify-between mb-8 sm:mb-10 bh-fade-in">
                    <h1 className="bh-display text-3xl sm:text-4xl text-stone-900">
                        {heading}  
                    </h1>
                  
                    <div className="flex items-center gap-4">
                        {/* Reading size controls */}
                        <div className="hidden sm:flex items-center gap-1 border border-stone-200 rounded-sm">
                            <button
                                onClick={() => setFontStep((s) => Math.max(0, s - 1))}
                                disabled={fontStep === 0}
                                aria-label="Decrease text size"
                                className="p-2 text-stone-500 hover:text-[#7B2942] disabled:opacity-30 disabled:hover:text-stone-500 transition-colors"
                            >
                                <Minus size={13} strokeWidth={1.5} />
                            </button>
                            <span className="bh-mono text-[9px] uppercase text-stone-400 px-1">
                                Aa
                            </span>
                            <button
                                onClick={() =>
                                    setFontStep((s) => Math.min(FONT_SCALE.length - 1, s + 1))
                                }
                                disabled={fontStep === FONT_SCALE.length - 1}
                                aria-label="Increase text size"
                                className="p-2 text-stone-500 hover:text-[#7B2942] disabled:opacity-30 disabled:hover:text-stone-500 transition-colors"
                            >
                                <Plus size={13} strokeWidth={1.5} />
                            </button>
                        </div>

                        <button
                            onClick={() => handleBookMark()}
                            aria-pressed={bookmarked}
                            aria-label={
                                bookmarked ? "Remove bookmark" : "Bookmark this chapter"
                            }
                            className="p-2 transition-colors"
                        >
                            <Bookmark
                                size={18}
                                strokeWidth={1.5}
                                className={
                                    bookmarked
                                        ? "text-[#7B2942]"
                                        : "text-stone-300 hover:text-[#7B2942]"
                                }
                                fill={bookmarked ? "#7B2942" : "none"}
                            />
                        </button>
                    </div>
                </div>

                {/* Verses */}
                <div
                    className={`bh-body ${FONT_SCALE[fontStep]} leading-loose text-stone-800 bh-fade-in`}
                >
                    <span className="bh-dropcap text-[#7B2942]">
                        {CHAPTER.verses.length != 0 ? CHAPTER.verses[0].text.charAt(0) : ""}
                    </span>
                    {CHAPTER.verses.map((v, i) => (
                        <div
                            key={v.num}
                            className="flex items-start gap-2 group"
                        >
                            <button
                                onClick={() => handleBookMarkVerse(v.num)}
                                className={
                                    bookmarkedVerses.has(v.num)
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100 transition"
                                }
                            >
                                <Bookmark
                                    size={16}
                                    fill={bookmarkedVerses.has(v.num) ? "#7B2942" : "none"}
                                    className={
                                        bookmarkedVerses.has(v.num)
                                            ? "text-[#7B2942]"
                                            : "text-stone-300"
                                    }
                                />
                            </button>

                            <span id={`verse-${v.num}`}>
                                {i !== 0 && (
                                    <sup className="bh-verse-num text-[#7B2942]">
                                        {v.num}
                                    </sup>
                                )}
                                {i === 0 ? v.text.slice(1) : v.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Chapter navigation */}
                <div className="flex items-center justify-between mt-14 pt-6 border-t border-stone-100">
                    <button
                        onClick={()=>{handlePage("prev")}}
                        disabled={isFirst}
                        className="flex items-center gap-1.5 bh-mono text-[10px] uppercase text-stone-500 hover:text-[#7B2942] disabled:opacity-30 disabled:hover:text-stone-500 transition-colors"
                    >
                        <ChevronLeft size={14} strokeWidth={1.5} />
                        {isFirst ? "Start of book" : "Previous"}
                    </button>
                    <button
                        onClick={()=>{handlePage("next")}}
                        disabled={isLast}
                        className="flex items-center gap-1.5 bh-mono text-[10px] uppercase text-stone-500 hover:text-[#7B2942] disabled:opacity-30 disabled:hover:text-stone-500 transition-colors"
                    >
                        {isLast
                            ? "End of book"
                            : `${CHAPTER.book} ${CHAPTER.chapterNumber + 1}`}
                        <ChevronRight size={14} strokeWidth={1.5} />
                    </button>
                </div>
            </main>

            <footer className="border-t border-stone-100">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-10 py-8">
                    <p className="bh-mono text-[11px] uppercase text-stone-400">
                        Holy Bible — a quiet place to read
                    </p>
                </div>
            </footer>
        </div>
    );
}
