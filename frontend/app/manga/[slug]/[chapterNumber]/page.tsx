import React from "react";
import styles from "./chapterReader.module.css";
import ChapterSelector from "./ChapterSelector";
import HistoryTracker from "@/app/components/HistoryTracker";

// Interface definitions
interface MangaType {
    _id: string;
    title: string;
    titleAr?: string;
    slug: string;
    description: string;
    coverImage: string;
    type: "manga" | "manhwa" | "manhua";
    status: "ongoing" | "completed" | "hiatus" | "dropped";
    genres: string[];
    author: string;
    artist: string;
    rating: number;
    views: number;
    bookmarks: number;
    isHot?: boolean;
    isFeatured?: boolean;
    createdAt?: string;
}

interface ChapterPageType {
    pageNumber: number;
    imageUrl: string;
}

interface ChapterType {
    _id: string;
    manga: string;
    chapterNumber: number;
    title: string;
    pages: ChapterPageType[];
    views: number;
    createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Local Fallbacks
const localMockMangas: MangaType[] = [
    {
        _id: "60c72b2f9b1d8b2c88888801",
        title: "Solo Leveling",
        titleAr: "سولو ليفيلينغ",
        slug: "solo-leveling",
        description: "في عالم حيث يُفتح بوابات تربط بين عالمنا وعالم الوحوش، يصبح سونغ جين-وو أضعف صياد من الرتبة E. لكن بعد حادثة غامضة في زنزانة مزدوجة، يحصل على قوة خفية تمكنه من الارتقاء بلا حدود...",
        coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80",
        type: "manhwa",
        status: "completed",
        genres: ["أكشن", "فانتازيا", "مغامرات", "نظام"],
        author: "Chugong",
        artist: "Dubu (Redice Studio)",
        rating: 9.8,
        views: 2500000,
        bookmarks: 154000,
        isHot: true,
        isFeatured: true
    },
    {
        _id: "60c72b2f9b1d8b2c88888802",
        title: "One Piece",
        titleAr: "ون بيس",
        slug: "one-piece",
        description: "القوة، الثروة، الشهرة. هذا ما امتلكه ملك القراصنة غول دي. روجر قبل إعدامه. كلمات روجر الأخيرة أرسلت الآلاف إلى البحار بحثاً عن كنزه الأسطوري ون بيس. مونكي دي. لوفي، شاب يطمح لأن يكون ملك القراصنة الجديد، يبدأ مغامرته لجمع طاقم والإبحار في الجراند لاين.",
        coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80",
        type: "manga",
        status: "ongoing",
        genres: ["أكشن", "مغامرات", "كوميديا", "خيال"],
        author: "Eiichiro Oda",
        artist: "Eiichiro Oda",
        rating: 9.7,
        views: 3100000,
        bookmarks: 245000,
        isHot: true
    },
    {
        _id: "60c72b2f9b1d8b2c88888803",
        title: "Tower of God",
        titleAr: "برج الإله",
        slug: "tower-of-god",
        description: "ماذا تبحث؟ الشهرة؟ المجد؟ القوة؟ الانتقام؟ أم شيء يتجاوز كل هذا؟ كل ما تبحث عنه موجود في قمة البرج. بام الثالث والعشرون، فتى عاش حياته وحيداً في ظلام تحت البرج، يدخل البرج بحثاً عن صديقته الوحيدة راشيل التي صعدت لتشاهد النجوم.",
        coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
        type: "manhwa",
        status: "ongoing",
        genres: ["أكشن", "غموض", "فانتازيا", "دراما"],
        author: "SIU",
        artist: "SIU",
        rating: 9.5,
        views: 1800000,
        bookmarks: 98000
    },
    {
        _id: "60c72b2f9b1d8b2c88888804",
        title: "Jujutsu Kaisen",
        titleAr: "جوجوتسو كايسن",
        slug: "jujutsu-kaisen",
        description: "إيتادوري يوجي، طالب ثانوية يمتلك بنية جسدية خارقة، يبتلع عن غير قصد إصبعاً ملعوناً يخص سوكونا، ملك اللعنات الأسطوري. لحماية أصدقائه والناس، ينضم إلى ثانوية جوجوتسو لطرد اللعنات والبحث عن باقي الأصابع الملعونة للتخلص منها.",
        coverImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80",
        type: "manga",
        status: "completed",
        genres: ["أكشن", "فوق الطبيعة", "مدرسي", "شياطين"],
        author: "Gege Akutami",
        artist: "Gege Akutami",
        rating: 9.4,
        views: 1600000,
        bookmarks: 112000,
        isHot: true
    },
    {
        _id: "60c72b2f9b1d8b2c88888805",
        title: "The Beginning After The End",
        titleAr: "البداية بعد النهاية",
        slug: "the-beginning-after-the-end",
        description: "الملك غري، القائد الذي لا منازع له في عالم تحكمه القوة القتالية، يولد مجدداً في عالم مليء بالسحر والوحوش كـ آرثر ليوين. مع معرفته السابقة وقدراته الجديدة، يبدأ مغامرته لحماية عائلته ومملكته الجديدة من تهديد غامض.",
        coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
        type: "manhwa",
        status: "ongoing",
        genres: ["فانتازيا", "أكشن", "إعادة تجسد", "مغامرات"],
        author: "TurtleMe",
        artist: "Fuyuki 23",
        rating: 9.3,
        views: 1200000,
        bookmarks: 87000
    },
    {
        _id: "60c72b2f9b1d8b2c88888806",
        title: "Omniscient Reader",
        titleAr: "وجهة نظر القارئ العليم",
        slug: "omniscient-reader",
        description: "كيم دوكجا هو قارئ عادي يقرأ رواية إنترنت فاشلة تدعى 'ثلاث طرق للبقاء في عالم مدمر' لسنوات عديدة. عندما يُنشر الفصل الأخير، يتحول عالم الرواية فجأة إلى حقيقة واقعية، ويصبح دوكجا الشخص الوحيد الذي يعرف نهاية العالم وكيفية النجاة.",
        coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80",
        type: "manhwa",
        status: "ongoing",
        genres: ["أكشن", "خيال علمي", "نظام", "دراما"],
        author: "sing N song",
        artist: "Sleepy-C",
        rating: 9.6,
        views: 1900000,
        bookmarks: 130000,
        isHot: true
    }
];

const getLocalChapters = (mangaId: string, titleAr?: string) => {
    return [
        {
            _id: `ch-1-${mangaId}`,
            manga: mangaId,
            chapterNumber: 1,
            title: `الفصل 1: بداية الرحلة لـ ${titleAr || "المانجا"}`,
            views: 1320,
            createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString()
        },
        {
            _id: `ch-2-${mangaId}`,
            manga: mangaId,
            chapterNumber: 2,
            title: `الفصل 2: مواجهة غير متوقعة لـ ${titleAr || "المانجا"}`,
            views: 940,
            createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
        }
    ];
};

const getLocalChapterContent = (mangaId: string, chNumber: number): ChapterType | null => {
    const manga = localMockMangas.find(m => m._id === mangaId);
    if (!manga) return null;

    const basePages = [
        { pageNumber: 1, imageUrl: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800&auto=format&fit=crop&q=80" },
        { pageNumber: 2, imageUrl: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&auto=format&fit=crop&q=80" },
        { pageNumber: 3, imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" },
        { pageNumber: 4, imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80" }
    ];

    return {
        _id: `ch-${chNumber}-${mangaId}`,
        manga: mangaId,
        chapterNumber: chNumber,
        title: `الفصل ${chNumber}: ${manga.titleAr}`,
        pages: basePages,
        views: 240,
        createdAt: new Date().toISOString()
    };
};

async function getReaderData(slug: string, chapterNumber: number) {
    try {
        // Fetch manga details to get the chapters list for navigation dropdown
        const mangaRes = await fetch(`${API_URL}/mangas/${slug}`, {
            cache: "no-store",
            next: { revalidate: 0 }
        });
        if (!mangaRes.ok) throw new Error("Manga details not found on server");
        const mangaJson = await mangaRes.json();
        const manga = mangaJson.data.manga as MangaType;
        const chaptersList = mangaJson.data.chapters as ChapterOption[];

        // Fetch the specific chapter details
        const chapterRes = await fetch(`${API_URL}/chapters/${slug}/${chapterNumber}`, {
            cache: "no-store",
            next: { revalidate: 0 }
        });
        if (!chapterRes.ok) throw new Error("Chapter content not found on server");
        const chapterJson = await chapterRes.json();
        const chapter = chapterJson.data as ChapterType;

        return {
            manga,
            chapters: chaptersList,
            chapter,
            isConnected: true
        };
    } catch (err) {
        console.warn(`⚠️ Failed to fetch reader data for '${slug}' Ch: ${chapterNumber}, falling back to local:`, err);
        const manga = localMockMangas.find(m => m.slug === slug);
        if (!manga) return null;

        const chaptersList = getLocalChapters(manga._id, manga.titleAr).map(c => ({
            chapterNumber: c.chapterNumber,
            title: c.title
        }));

        const chapter = getLocalChapterContent(manga._id, chapterNumber);
        if (!chapter) return null;

        return {
            manga,
            chapters: chaptersList,
            chapter,
            isConnected: false
        };
    }
}

interface ChapterOption {
    chapterNumber: number;
    title: string;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; chapterNumber: string }> }) {
    const { slug, chapterNumber } = await params;
    const chNumber = parseInt(chapterNumber);
    const data = await getReaderData(slug, chNumber);

    if (!data) {
        return {
            title: "الفصل غير موجود - MangaVerse",
            description: "الفصل الذي تحاول قراءته غير متوفر حالياً."
        };
    }

    const mangaTitle = data.manga.titleAr || data.manga.title;
    return {
        title: `قراءة مانهوا ${mangaTitle} الفصل ${chNumber} مترجم - MangaVerse`,
        description: `شاهد واقرأ الفصل ${chNumber} من مانهوا أو مانجا ${mangaTitle} مترجم بالعربية وبجودة عالية أونلاين.`,
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string; chapterNumber: string }>;
}) {
    const { slug, chapterNumber } = await params;
    const chNumber = parseInt(chapterNumber);
    const data = await getReaderData(slug, chNumber);

    if (!data) {
        return (
            <div className={styles.wrapper} style={{ padding: "100px 20px", textAlign: "center" }}>
                <h1 style={{ fontSize: "2rem", marginBottom: "20px", color: "var(--color-accent)" }}>⛩️ الفصل غير موجود</h1>
                <p style={{ color: "var(--color-text-secondary)", marginBottom: "30px" }}>عذراً، لم نتمكن من العثور على الفصل المطلوب لهذا العمل.</p>
                <a href={`/manga/${slug}`} className="btn btn-primary">العودة لتفاصيل العمل</a>
            </div>
        );
    }

    const { manga, chapters, chapter, isConnected } = data;

    // Navigation logic based on the list of chapters
    const sortedChapters = [...chapters].sort((a, b) => a.chapterNumber - b.chapterNumber);
    const currentIndex = sortedChapters.findIndex((c) => c.chapterNumber === chNumber);

    const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

    const mangaTitle = manga.titleAr || manga.title;

    return (
        <div className={styles.wrapper}>
            <HistoryTracker mangaId={manga._id} chapterNumber={chNumber} />
            {/* Diagnostic database connection state */}
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
                    <a href={`/manga/${manga.slug}`} className={styles.mangaLink}>
                        <span className={styles.mangaIcon}>⛩️</span>
                        <span>{mangaTitle}</span>
                    </a>

                    <div className={styles.controls}>
                        {/* Next Chapter Button (Moves to higher chapter number) */}
                        <a
                            href={nextChapter ? `/manga/${manga.slug}/${nextChapter.chapterNumber}` : "#"}
                            className={`${styles.navBtn}`}
                            style={!nextChapter ? { pointerEvents: "none", opacity: 0.3 } : {}}
                            title="الفصل التالي"
                        >
                            <span>التالي</span>
                            <span>⬅️</span>
                        </a>

                        {/* Dropdown Selector */}
                        <ChapterSelector
                            slug={manga.slug}
                            chapters={chapters}
                            currentChapterNumber={chNumber}
                        />

                        {/* Previous Chapter Button (Moves to lower chapter number) */}
                        <a
                            href={prevChapter ? `/manga/${manga.slug}/${prevChapter.chapterNumber}` : "#"}
                            className={`${styles.navBtn}`}
                            style={!prevChapter ? { pointerEvents: "none", opacity: 0.3 } : {}}
                            title="الفصل السابق"
                        >
                            <span>➡️</span>
                            <span>السابق</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* MAIN IMAGE READING SECTION */}
            <main className={styles.readerViewport}>
                <div className={styles.pagesContainer}>
                    {chapter.pages && chapter.pages.length > 0 ? (
                        chapter.pages
                            .sort((a, b) => a.pageNumber - b.pageNumber)
                            .map((page, index) => (
                                <div key={index} className={styles.pageWrapper}>
                                    <img
                                        src={page.imageUrl}
                                        alt={`صفحة ${page.pageNumber}`}
                                        className={styles.pageImage}
                                        loading={index === 0 ? "eager" : "lazy"}
                                        id={`page-${page.pageNumber}`}
                                    />
                                </div>
                            ))
                    ) : (
                        <div style={{ padding: "50px 20px", textAlign: "center", color: "var(--color-text-muted)" }}>
                            لا توجد صفحات متوفرة في هذا الفصل حالياً.
                        </div>
                    )}
                </div>

                {/* BOTTOM NAVIGATION CONTROLS */}
                <div className={styles.bottomControls}>
                    <div className={styles.bottomNav}>
                        <a
                            href={nextChapter ? `/manga/${manga.slug}/${nextChapter.chapterNumber}` : "#"}
                            className="btn btn-primary"
                            style={!nextChapter ? { pointerEvents: "none", opacity: 0.3 } : {}}
                        >
                            الفصل التالي ⬅️
                        </a>

                        <a href={`/manga/${manga.slug}`} className={styles.bottomMangaLink}>
                            <span>⛩️</span>
                            <span>العودة للمكتبة</span>
                        </a>

                        <a
                            href={prevChapter ? `/manga/${manga.slug}/${prevChapter.chapterNumber}` : "#"}
                            className="btn btn-outline"
                            style={!prevChapter ? { pointerEvents: "none", opacity: 0.3 } : {}}
                        >
                            ➡️ الفصل السابق
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
