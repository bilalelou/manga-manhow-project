"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./chapterReader.module.css";
import ChapterSelector from "./ChapterSelector";
import HistoryTracker from "@/app/components/HistoryTracker";
import LogoIcon from "@/app/components/LogoIcon";
import CommentSection from "@/app/components/CommentSection";
import { ChevronLeftIcon, ChevronRightIcon, SadFaceIcon } from "@/app/components/Icons";

interface ChapterOption {
    chapterNumber: number;
    title: string;
}

interface PageType {
    pageNumber: number;
    imageUrl: string;
}

interface ChapterType {
    _id: string;
    manga: string;
    chapterNumber: number;
    title: string;
    pages: PageType[];
    views: number;
    createdAt: string;
}

interface ReaderContentProps {
    manga: {
        _id: string;
        title: string;
        titleAr?: string;
        slug: string;
        coverImage: string;
        type: string;
        status: string;
    };
    chapter: ChapterType;
    chapters: ChapterOption[];
    isConnected: boolean;
}

export default function ReaderContent({
    manga,
    chapter,
    chapters,
    isConnected,
}: ReaderContentProps) {
    const router = useRouter();
    const pages = [...(chapter.pages || [])].sort((a, b) => a.pageNumber - b.pageNumber);
    const mangaTitle = manga.titleAr || manga.title;

    // Reading preferences state
    const [readingMode, setReadingMode] = useState<"webtoon" | "slide">("webtoon");
    const [readingDirection, setReadingDirection] = useState<"rtl" | "ltr">("rtl");
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    // Navigation calculation
    const sortedChapters = [...chapters].sort((a, b) => a.chapterNumber - b.chapterNumber);
    const currentChapterIndex = sortedChapters.findIndex(
        (c) => c.chapterNumber === chapter.chapterNumber
    );
    const prevChapter = currentChapterIndex > 0 ? sortedChapters[currentChapterIndex - 1] : null;
    const nextChapter =
        currentChapterIndex < sortedChapters.length - 1
            ? sortedChapters[currentChapterIndex + 1]
            : null;

    // Load preferences from localStorage on mount
    useEffect(() => {
        const savedMode = localStorage.getItem("manga_reading_mode");
        const savedDir = localStorage.getItem("manga_reading_direction");
        
        if (savedMode === "webtoon" || savedMode === "slide") {
            setReadingMode(savedMode);
        }
        if (savedDir === "rtl" || savedDir === "ltr") {
            setReadingDirection(savedDir);
        }
    }, []);

    // Reset page index when chapter changes
    useEffect(() => {
        setCurrentPageIndex(0);
    }, [chapter.chapterNumber]);

    // Save mode preference
    const handleModeChange = (mode: "webtoon" | "slide") => {
        setReadingMode(mode);
        localStorage.setItem("manga_reading_mode", mode);
    };

    // Save direction preference
    const handleDirectionChange = (direction: "rtl" | "ltr") => {
        setReadingDirection(direction);
        localStorage.setItem("manga_reading_direction", direction);
    };

    // Navigation handlers for Slide Mode
    const goToNextPage = () => {
        if (currentPageIndex < pages.length - 1) {
            setCurrentPageIndex((prev) => prev + 1);
        } else if (nextChapter) {
            // Go to next chapter
            router.push(`/manga/${manga.slug}/${nextChapter.chapterNumber}`);
        } else {
            alert("لقد وصلت إلى نهاية الفصل الأخير!");
        }
    };

    const goToPrevPage = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex((prev) => prev - 1);
        } else if (prevChapter) {
            // Go to previous chapter
            router.push(`/manga/${manga.slug}/${prevChapter.chapterNumber}`);
        } else {
            alert("هذا هو الفصل الأول في المانجا!");
        }
    };

    // Image click handler to navigate
    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (readingMode !== "slide") return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left; // Click position relative to image left boundary
        const isRightClick = x > rect.width / 2;

        if (readingDirection === "rtl") {
            // RTL: click left goes to next page, click right goes to previous page
            if (isRightClick) {
                goToPrevPage();
            } else {
                goToNextPage();
            }
        } else {
            // LTR: click right goes to next page, click left goes to previous page
            if (isRightClick) {
                goToNextPage();
            } else {
                goToPrevPage();
            }
        }
    };

    // Keyboard Arrow Keys Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (readingMode !== "slide") return;

            if (e.key === "ArrowLeft") {
                // Left Arrow
                if (readingDirection === "rtl") {
                    goToNextPage(); // RTL: Left arrow advances page
                } else {
                    goToPrevPage(); // LTR: Left arrow goes back
                }
            } else if (e.key === "ArrowRight") {
                // Right Arrow
                if (readingDirection === "rtl") {
                    goToPrevPage(); // RTL: Right arrow goes back
                } else {
                    goToNextPage(); // LTR: Right arrow advances page
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [currentPageIndex, readingMode, readingDirection, pages.length, nextChapter, prevChapter]);

    const activePage = pages[currentPageIndex];

    return (
        <div className={styles.wrapper}>
            <HistoryTracker mangaId={manga._id} chapterNumber={chapter.chapterNumber} />
            
            {/* Connection badge for diagnostic */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                zIndex: 1000,
                background: isConnected ? 'rgba(0, 200, 80, 0.9)' : 'rgba(233, 69, 96, 0.9)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(8px)'
            }}>
                <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'white',
                    display: 'inline-block',
                }} />
                {isConnected ? 'متصل بقاعدة البيانات' : 'نمط المحاكاة الاحتياطي (DB offline)'}
            </div>

            {/* STICKY HEADER CONTROLS */}
            <header className={styles.readerHeader}>
                <div className={`container ${styles.headerInner}`}>
                    <Link href={`/manga/${manga.slug}`} className={styles.mangaLink}>
                        <LogoIcon width={24} height={24} />
                        <span>{mangaTitle}</span>
                    </Link>

                    <div className={styles.controls}>
                        {/* Next Chapter Button */}
                        <Link
                            href={nextChapter ? `/manga/${manga.slug}/${nextChapter.chapterNumber}` : "#"}
                            className={`${styles.navBtn}`}
                            style={!nextChapter ? { pointerEvents: "none", opacity: 0.3 } : {}}
                            title="الفصل التالي"
                        >
                            <span>التالي</span>
                            <ChevronLeftIcon size={12} style={{ marginRight: "3px" }} />
                        </Link>

                        {/* Dropdown Selector */}
                        <ChapterSelector
                            slug={manga.slug}
                            chapters={chapters}
                            currentChapterNumber={chapter.chapterNumber}
                        />

                        {/* Previous Chapter Button */}
                        <Link
                            href={prevChapter ? `/manga/${manga.slug}/${prevChapter.chapterNumber}` : "#"}
                            className={`${styles.navBtn}`}
                            style={!prevChapter ? { pointerEvents: "none", opacity: 0.3 } : {}}
                            title="الفصل السابق"
                        >
                            <ChevronRightIcon size={12} style={{ marginLeft: "3px" }} />
                            <span>السابق</span>
                        </Link>
                    </div>
                </div>

                {/* INTERACTIVE CONTROLS TOOLBAR ROW */}
                <div className={`container ${styles.toolbarRow}`}>
                    {/* Mode Segmented Controls */}
                    <div className={styles.segmentedControl}>
                        <button
                            className={`${styles.segmentedBtn} ${readingMode === "webtoon" ? styles.segmentedBtnActive : ""}`}
                            onClick={() => handleModeChange("webtoon")}
                        >
                            📜 نمط الويبون (التمرير)
                        </button>
                        <button
                            className={`${styles.segmentedBtn} ${readingMode === "slide" ? styles.segmentedBtnActive : ""}`}
                            onClick={() => handleModeChange("slide")}
                        >
                            📖 نمط الصفحات (كتاب)
                        </button>
                    </div>

                    {/* Direction controls (Slide Mode only) */}
                    {readingMode === "slide" && (
                        <div className={styles.segmentedControl}>
                            <button
                                className={`${styles.segmentedBtn} ${readingDirection === "rtl" ? styles.segmentedBtnActive : ""}`}
                                onClick={() => handleDirectionChange("rtl")}
                                title="القراءة من اليمين إلى اليسار (للمحاذاة الآسيوية)"
                            >
                                ⬅️ يمين لـ يسار
                            </button>
                            <button
                                className={`${styles.segmentedBtn} ${readingDirection === "ltr" ? styles.segmentedBtnActive : ""}`}
                                onClick={() => handleDirectionChange("ltr")}
                                title="القراءة من اليسار إلى اليمين (للمحاذاة الغربية)"
                            >
                                ➡️ يسار لـ يمين
                            </button>
                        </div>
                    )}

                    {/* Slide mode page numbers navigation */}
                    {readingMode === "slide" && pages.length > 0 && (
                        <div className={styles.slidePagination}>
                            <button 
                                className={styles.slideNavBtn}
                                onClick={goToPrevPage}
                                title="الصفحة السابقة"
                            >
                                ◀
                            </button>
                            <span className={styles.slidePageIndicator}>
                                صفحة {currentPageIndex + 1} من {pages.length}
                            </span>
                            <button 
                                className={styles.slideNavBtn}
                                onClick={goToNextPage}
                                title="الصفحة التالية"
                            >
                                ▶
                            </button>
                        </div>
                    )}
                </div>

                {/* Progress bar (Slide Mode only) */}
                {readingMode === "slide" && pages.length > 0 && (
                    <div className={styles.progressContainer}>
                        <div 
                            className={styles.progressBar} 
                            style={{ width: `${((currentPageIndex + 1) / pages.length) * 100}%` }}
                        />
                    </div>
                )}
            </header>

            {/* MAIN IMAGE READING SECTION */}
            <main className={styles.readerViewport}>
                {readingMode === "webtoon" ? (
                    /* Webtoon Scrolling Mode Layout */
                    <div className={styles.pagesContainer}>
                        {pages.length > 0 ? (
                            pages.map((page, index) => (
                                <div key={index} className={styles.pageWrapper}>
                                    <img
                                        src={page.imageUrl}
                                        alt={`صفحة ${page.pageNumber}`}
                                        className={styles.pageImage}
                                        loading={index === 0 ? "eager" : "lazy"}
                                        id={`page-${page.pageNumber}`}
                                    />
                                    <span className={styles.webtoonPageNumber}>صفحة {page.pageNumber}</span>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: "50px 20px", textAlign: "center", color: "var(--color-text-muted)" }}>
                                لا توجد صفحات متوفرة في هذا الفصل حالياً.
                            </div>
                        )}
                    </div>
                ) : (
                    /* Slide Mode Page-by-page Layout */
                    <div className={styles.slideContainer}>
                        {activePage ? (
                            <div className={styles.slidePageWrapper}>
                                <img
                                    src={activePage.imageUrl}
                                    alt={`صفحة ${activePage.pageNumber}`}
                                    className={styles.slideImage}
                                    onClick={handleImageClick}
                                    style={{ cursor: readingDirection === "rtl" ? "w-resize" : "e-resize" }}
                                    id={`slide-page-${activePage.pageNumber}`}
                                />
                                
                                <div className={styles.tooltipReminder}>
                                    💡 يمكنك استخدام أسهم لوحة المفاتيح (◀ ▶) أو النقر على جانبي الصورة للتنقل!
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: "50px 20px", textAlign: "center", color: "var(--color-text-muted)" }}>
                                لا توجد صفحات متوفرة في هذا الفصل حالياً.
                            </div>
                        )}
                    </div>
                )}

                {/* BOTTOM NAVIGATION CONTROLS */}
                <div className={styles.bottomControls}>
                    <div className={styles.bottomNav}>
                        <Link
                            href={nextChapter ? `/manga/${manga.slug}/${nextChapter.chapterNumber}` : "#"}
                            className="btn btn-primary"
                            style={!nextChapter ? { pointerEvents: "none", opacity: 0.3, display: 'inline-flex', alignItems: 'center', gap: '5px' } : { display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        >
                            <span>الفصل التالي</span>
                            <ChevronLeftIcon size={12} />
                        </Link>

                        <Link href={`/manga/${manga.slug}`} className={styles.bottomMangaLink}>
                            <LogoIcon width={20} height={20} />
                            <span>العودة للمكتبة</span>
                        </Link>

                        <Link
                            href={prevChapter ? `/manga/${manga.slug}/${prevChapter.chapterNumber}` : "#"}
                            className="btn btn-outline"
                            style={!prevChapter ? { pointerEvents: "none", opacity: 0.3, display: 'inline-flex', alignItems: 'center', gap: '5px' } : { display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        >
                            <ChevronRightIcon size={12} />
                            <span>الفصل السابق</span>
                        </Link>
                    </div>
                </div>

                {/* COMMENTS SECTION */}
                <CommentSection mangaId={manga._id} chapterNumber={chapter.chapterNumber} />
            </main>
        </div>
    );
}
