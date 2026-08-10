import { useState, useMemo, useEffect } from "react";
import { Search, BookOpen, ChevronRight, X } from "lucide-react";
import "./home.css";

import { apiRequest } from "../axiosinit";
import { useGlobalVar, type VERSE_OF_DAY } from "../globalvar";
import { useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// Data: the 66 canonical books, grouped the way a printed Bible's own
// thumb-index groups them. Real content — this drives the tabs/chips.
// ---------------------------------------------------------------------------
const SECTIONS = [
    {
        id: "law",
        label: "Law",
        testament: "OT",
        books: ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"],
    },
    {
        id: "history",
        label: "History",
        testament: "OT",
        books: [
            "Joshua",
            "Judges",
            "Ruth",
            "1 Samuel",
            "2 Samuel",
            "1 Kings",
            "2 Kings",
            "1 Chronicles",
            "2 Chronicles",
            "Ezra",
            "Nehemiah",
            "Esther",
        ],
    },
    {
        id: "wisdom",
        label: "Wisdom",
        testament: "OT",
        books: ["Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Songs"],
    },
    {
        id: "prophets",
        label: "Prophets",
        testament: "OT",
        books: [
            "Isaiah",
            "Jeremiah",
            "Lamentations",
            "Ezekiel",
            "Daniel",
            "Hosea",
            "Joel",
            "Amos",
            "Obadiah",
            "Jonah",
            "Micah",
            "Nahum",
            "Habakkuk",
            "Zephaniah",
            "Haggai",
            "Zechariah",
            "Malachi",
        ],
    },
    {
        id: "gospels",
        label: "Gospels",
        testament: "NT",
        books: ["Matthew", "Mark", "Luke", "John", "Acts"],
    },
    {
        id: "epistles",
        label: "Epistles",
        testament: "NT",
        books: [
            "Romans",
            "1 Corinthians",
            "2 Corinthians",
            "Galatians",
            "Ephesians",
            "Philippians",
            "Colossians",
            "1 Thessalonians",
            "2 Thessalonians",
            "1 Timothy",
            "2 Timothy",
            "Titus",
            "Philemon",
            "Hebrews",
            "James",
            "1 Peter",
            "2 Peter",
            "1 John",
            "2 John",
            "3 John",
            "Jude",
        ],
    },
    {
        id: "revelation",
        label: "Revelation",
        testament: "NT",
        books: ["Revelation"],
    },
];

// ---------------------------------------------------------------------------
// Chapter counts per book — real, fixed values, so the chapter picker can
// render instantly without a round-trip. Verse counts vary per chapter and
// aren't worth hardcoding, so those are fetched from the backend once a
// chapter is picked (see handleChapterClick).
// ---------------------------------------------------------------------------

const DEFAULT_VERSE_COUNT = 31; // fallback shown briefly while the real count loads

export default function BibleHomepage() {
    const [activeSection, setActiveSection] = useState("all");
    const [query, setQuery] = useState("");
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const navigate = useNavigate();
    const currentUser = useGlobalVar((state) => state.user);
    const setUserData = useGlobalVar((state) => state.setUserData);
    const [verse_of_the_day, setVerseDay] = useState<VERSE_OF_DAY>();
    const [chapter_count, setChapterCount] = useState<Record<string, number>>();

    // --- Book -> Chapter -> Verse picker state ------------------------------
    const [pickerBook, setPickerBook] = useState<string | null>(null);
    const [pickerChapter, setPickerChapter] = useState<number | null>(null);
    const [verseCount, setVerseCount] = useState<number>(DEFAULT_VERSE_COUNT);
    const [loadingVerses, setLoadingVerses] = useState(false);

    useEffect(() => {
        apiRequest("get", "/bible/day-verse").then((resp) => { setVerseDay(resp.data) });
        apiRequest("get", "/bible/book-count").then((resp)=>{ setChapterCount(resp.data) });
        apiRequest("get", "/auth/me").then((resp) => {
            setUserData(resp.data)
        });
    }, []);

    const VERSE_OF_DAY = verse_of_the_day;

    const visibleSections = useMemo(() => {
        if (activeSection === "all") return SECTIONS;
        return SECTIONS.filter((s) => s.id === activeSection);
    }, [activeSection]);

    const filteredSections = useMemo(() => {
        if (!query.trim()) return visibleSections;
        const q = query.trim().toLowerCase();
        return visibleSections
            .map((s) => ({
                ...s,
                books: s.books.filter((b) => b.toLowerCase().includes(q)),
            }))
            .filter((s) => s.books.length > 0);
    }, [visibleSections, query]);

    const navigate_to_bible = (bible: string, chapter: number = 1, verse: number = 1) => {
        apiRequest("post", "/bible/passage/book", { bible: bible, chapter: chapter, verse: verse });
        navigate(`/bible?book=${bible}&chapter=${chapter}&verse=${verse}`);
    }

    // Step 1: click a book -> open the chapter picker
    const handleBookClick = (book: string) => {
        setPickerBook(book);
        setPickerChapter(null);
    };

    // Step 2: click a chapter -> fetch its verse count, open the verse picker
    const handleChapterClick = async (chapter: number) => {
        setPickerChapter(chapter);
        setLoadingVerses(true);
        try {
            const resp = await apiRequest("get", `/bible/verse-count?book=${pickerBook}&chapter=${chapter}`);
            setVerseCount(resp.data?.verse ?? DEFAULT_VERSE_COUNT);
        } catch {
            setVerseCount(DEFAULT_VERSE_COUNT);
        } finally {
            setLoadingVerses(false);
        }
    };

    // Step 3: click a verse -> navigate to the reader
    const handleVerseClick = (verse: number) => {
        if (!pickerBook || pickerChapter === null) return;
        navigate_to_bible(pickerBook, pickerChapter, verse);
        closePicker();
    };

    const closePicker = () => {
        setPickerBook(null);
        setPickerChapter(null);
    };

    const CHAPTER_COUNTS: Record<string, number> = chapter_count ?? {};

    return (
        <div className="w-full min-h-screen bg-white">
            {/* ----------------------------------------------------------------- */}
            {/* Header: logo, nav, persistent search (desktop) / toggle (mobile) */}
            {/* ----------------------------------------------------------------- */}
            <header className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 pt-6 sm:pt-8">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => navigate("/")}>
                        <BookOpen size={20} className="text-[#7B2942]" strokeWidth={1.5} />
                        <span className="bh-mono text-[20px] uppercase py-3 text-stone-900">
                            Holy Bible
                        </span>
                    </div>

                    {currentUser && 
                        (<nav className="hidden md:flex items-center gap-6 bh-mono text-[13px] uppercase text-stone-500 shrink-0 cursor-pointer p-3">
                            <a
                                onClick={() => { navigate("/profile") }}
                                className="hover:text-[#7B2942] transition-colors"
                            >
                                {currentUser?.username}
                            </a>
                        </nav>)
                    }

                    {/* Desktop/tablet inline search */}
                    <div className="hidden sm:block relative flex-1 max-w-xs ml-auto">
                        <Search
                            size={15}
                            strokeWidth={2}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7B2942]"
                        />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search a book…"
                            aria-label="Search a book"
                            className="bh-mono w-full text-[14px] uppercase tracking-widest pl-9 pr-3 py-2.5 rounded-sm border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B2942] transition-colors"
                        />
                    </div>

                    {/* Mobile search toggle */}
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

                {/* Mobile search field */}
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
            {/* Hero: illuminated opening line + verse-of-day                     */}
            {/* ----------------------------------------------------------------- */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 pt-10 sm:pt-16 md:pt-20 pb-8 sm:pb-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                    <div className="max-w-2xl bh-fade-in bh-fade-in-1">
                        <p className="bh-mono text-[14.5px] sm:text-[12.5px] uppercase mb-4 sm:mb-5 text-[#7B2942]">
                            Genesis 1:1
                        </p>
                        <p className="bh-body text-base sm:text-xl md:text-2xl leading-relaxed text-stone-800">
                            <span className=" bh-dropcap text-[#7B2942]">I</span>n the
                            beginning God created the heavens and the earth. Now the earth was
                            formless and empty, darkness was over the surface of the deep, and
                            the Spirit of God was hovering over the waters.
                        </p>
                    </div>

                    {/* Verse-of-the-day: inline card on mobile/tablet, ribbon on desktop */}
                    <div className="w-full sm:w-64 lg:w-44 shrink-0 bh-fade-in bh-fade-in-3">
                        <div className="bh-ribbon px-4 pt-4 pb-6 bg-[#7B2942] font-bold">
                            <p className="bh-mono text-[11px] uppercase mb-2 text-[#e9c6ce]">
                                Verse of the day
                            </p>
                            <p className="bh-body text-[13px] leading-snug text-white">
                                &ldquo;{VERSE_OF_DAY ? VERSE_OF_DAY.text : "Daily verse text"}&rdquo;
                            </p>
                            <p className="bh-mono text-[11px] uppercase mt-3 mb-10 text-white py-3">
                                {VERSE_OF_DAY ? VERSE_OF_DAY.book : "Daily verse book"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* Book index: horizontal chips on mobile/tablet, edge tabs on desktop */}
            {/* ----------------------------------------------------------------- */}
            <section
                id="read"
                className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 pb-16 sm:pb-20"
            >
                {/* Mobile/tablet: horizontal scrollable chips */}
                <div className="lg:hidden flex gap-2 overflow-x-auto bh-chip-row pb-4 mb-2 -mx-4 px-4 sm:-mx-6 sm:px-6">
                    <button
                        onClick={() => setActiveSection("all")}
                        className={`bh-mono text-[11px] uppercase px-3.5 py-2 rounded-full whitespace-nowrap transition-colors shrink-0 ${activeSection === "all"
                            ? "bg-[#7B2942] text-white"
                            : "bg-stone-100 text-stone-500"
                            }`}
                    >
                        All
                    </button>
                    {SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            onClick={() =>
                                setActiveSection(
                                    activeSection === section.id ? "all" : section.id,
                                )

                            }
                            className={`bh-mono text-sm uppercase px-3.5 py-2 rounded-full whitespace-nowrap transition-colors shrink-0 ${activeSection === section.id
                                ? "bg-[#7B2942] text-white"
                                : "bg-stone-100 text-stone-500"
                                }`}
                        >
                            {section.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between mb-5">
                            <h2 className="bh-display text-base sm:text-lg text-stone-900">
                                {activeSection === "all"
                                    ? "All books"
                                    : SECTIONS.find((s) => s.id === activeSection)?.label}
                            </h2>
                            {activeSection !== "all" && (
                                <button
                                    onClick={() => setActiveSection("all")}
                                    className="bh-mono text-[10px] uppercase text-[#7B2942] hover:opacity-70"
                                >
                                    Clear filter
                                </button>
                            )}
                        </div>

                        <div className="space-y-8">
                            {filteredSections.length === 0 && (
                                <p className="bh-body text-sm text-stone-400">
                                    No books match &ldquo;{query}&rdquo;.
                                </p>
                            )}
                            {filteredSections.map((section) => (
                                <div key={section.id}>
                                    <p className="bh-mono text-[10px] uppercase mb-3 flex items-center gap-2 text-stone-400">
                                        <span className="inline-block w-3.5 h-px bg-stone-300" />
                                        {section.testament === "OT"
                                            ? "Old Testament"
                                            : "New Testament"}{" "}
                                        — {section.label}
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1">
                                        {section.books.map((book) => (
                                            <button
                                                key={book}
                                                onClick={() => handleBookClick(book)}
                                                className="bh-body text-left text-sm py-1.5 flex items-center gap-1.5 group text-stone-700 hover:text-[#7B2942]"
                                            >
                                                <ChevronRight
                                                    size={15}
                                                    strokeWidth={2}
                                                    className="opacity-0 group-hover:opacity-100 -ml-4 transition-opacity text-[#7B2942]"
                                                />
                                                <span className="group-hover:translate-x-1 transition-transform">
                                                    {book}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop-only edge tabs */}
                    <div className="hidden lg:flex flex-col shrink-0 pt-1">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() =>
                                    setActiveSection(
                                        activeSection === section.id ? "all" : section.id,
                                    )
                                }
                                className={`bh-tab bh-mono text-sm uppercase px-1.5 py-3 mb-0.7 rounded-l-sm transition-colors ${activeSection === section.id
                                    ? "bg-[#7B2942] text-white"
                                    : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                                    }`}
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ----------------------------------------------------------------- */}
            {/* Chapter picker popup                                              */}
            {/* ----------------------------------------------------------------- */}
            {pickerBook && pickerChapter === null && (
                <PickerModal
                    title={pickerBook}
                    subtitle="Choose a chapter"
                    count={CHAPTER_COUNTS[pickerBook] ?? 1}
                    onSelect={handleChapterClick}
                    onClose={closePicker}
                />
            )}

            {/* ----------------------------------------------------------------- */}
            {/* Verse picker popup                                                */}
            {/* ----------------------------------------------------------------- */}
            {pickerBook && pickerChapter !== null && (
                <PickerModal
                    title={`${pickerBook} ${pickerChapter}`}
                    subtitle={loadingVerses ? "Loading verses…" : "Choose a verse"}
                    count={verseCount}
                    onSelect={handleVerseClick}
                    onBack={() => setPickerChapter(null)}
                    onClose={closePicker}
                />
            )}

            {/* ----------------------------------------------------------------- */}
            {/* Footer                                                            */}
            {/* ----------------------------------------------------------------- */}
            <footer id="about" className="border-t border-stone-100">
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

// ---------------------------------------------------------------------------
// Shared popup — renders a grid of numbers 1..count. Used for both the
// chapter step and the verse step; onSelect fires with the number clicked.
// ---------------------------------------------------------------------------
function PickerModal({
    title,
    subtitle,
    count,
    onSelect,
    onClose,
    onBack,
}: {
    title: string;
    subtitle: string;
    count: number;
    onSelect: (n: number) => void;
    onClose: () => void;
    onBack?: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md max-h-[80vh] bg-white border border-stone-200 rounded-sm flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-stone-100 shrink-0">
                    <div>
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="bh-mono text-[9px] uppercase text-[#7B2942] hover:opacity-70 mb-1.5 block"
                            >
                                ← Back to chapters
                            </button>
                        )}
                        <h3 className="bh-display text-lg text-stone-900">{title}</h3>
                        <p className="bh-mono text-[10px] uppercase text-stone-400 mt-0.5">
                            {subtitle}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="text-stone-400 hover:text-[#7B2942] transition-colors p-1"
                    >
                        <X size={16} strokeWidth={1.5} />
                    </button>
                </div>

                <div className="overflow-y-auto px-5 py-4">
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
                        {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                onClick={() => onSelect(n)}
                                className="bh-mono text-xs aspect-square flex items-center justify-center rounded-sm border border-stone-200 text-stone-700 hover:bg-[#7B2942] hover:text-white hover:border-[#7B2942] transition-colors"
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}