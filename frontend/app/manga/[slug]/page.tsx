import React from "react";
import styles from "./mangaDetails.module.css";

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

interface ChapterType {
    _id: string;
    manga: string;
    chapterNumber: number;
    title: string;
    views: number;
    createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Local fallback data if API is down
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

const getLocalChapters = (mangaId: string, titleAr?: string): ChapterType[] => {
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

async function getMangaDetails(slug: string) {
    try {
        const res = await fetch(`${API_URL}/mangas/${slug}`, {
            cache: "no-store",
            next: { revalidate: 0 }
        });
        if (!res.ok) throw new Error("Manga not found on server");
        const json = await res.json();
        return {
            manga: json.data.manga as MangaType,
            chapters: json.data.chapters as ChapterType[],
            isConnected: true
        };
    } catch (err) {
        console.warn(`⚠️ Failed to fetch details for '${slug}', falling back to local data:`, err);
        const manga = localMockMangas.find(m => m.slug === slug);
        if (!manga) return null;
        return {
            manga,
            chapters: getLocalChapters(manga._id, manga.titleAr),
            isConnected: false
        };
    }
}

// SEO Metadata Generator
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getMangaDetails(slug);
    if (!data) {
        return {
            title: "المانجا غير موجودة - MangaVerse",
            description: "عذراً، المانجا التي تبحث عنها غير متوفرة في موقعنا حالياً."
        };
    }
    const mangaTitle = data.manga.titleAr || data.manga.title;
    return {
        title: `${mangaTitle} - اقرأ الفصول أونلاين - MangaVerse`,
        description: `شاهد واقرأ فصول مانهوا أو مانجا ${mangaTitle} مترجمة بالكامل باللغة العربية بجودة عالية وبشكل مجاني على موقع مانجا فيرس.`,
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getMangaDetails(slug);

    if (!data) {
        return (
            <div className={styles.wrapper} style={{ padding: "100px 20px", textAlign: "center" }}>
                <h1 style={{ fontSize: "2rem", marginBottom: "20px", color: "var(--color-accent)" }}>⛩️ المانجا غير موجودة</h1>
                <p style={{ color: "var(--color-text-secondary)", marginBottom: "30px" }}>عذراً، لم نتمكن من العثور على المانجا المطلوبة.</p>
                <a href="/" className="btn btn-primary">العودة للرئيسية</a>
            </div>
        );
    }

    const { manga, chapters, isConnected } = data;

    const formatViews = (viewsNum?: number) => {
        if (!viewsNum) return "0";
        if (viewsNum >= 1000000) return (viewsNum / 1000000).toFixed(1) + "M";
        if (viewsNum >= 1000) return (viewsNum / 1000).toFixed(0) + "K";
        return viewsNum.toString();
    };

    const getMangaTypeName = (type?: string) => {
        if (type === "manhwa") return "مانهوا كوريا";
        if (type === "manhua") return "مانهوا صينية";
        return "مانجا يابانية";
    };

    const getStatusName = (status?: string) => {
        if (status === "ongoing") return "مستمر";
        if (status === "completed") return "مكتمل";
        if (status === "hiatus") return "متوقف مؤقتاً";
        return "متوقف";
    };

    const formatTime = (dateStr?: string) => {
        if (!dateStr) return "منذ فترة";
        const diff = Date.now() - new Date(dateStr).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return "منذ قليل";
        if (hours === 1) return "منذ ساعة";
        if (hours < 24) return `منذ ${hours} ساعات`;
        const days = Math.floor(hours / 24);
        if (days === 1) return "منذ يوم";
        return `منذ ${days} أيام`;
    };

    // Link for lowest chapter or start reading
    const startReadingLink = chapters.length > 0
        ? `/manga/${manga.slug}/${chapters[chapters.length - 1].chapterNumber}`
        : "#";

    return (
        <div className={styles.wrapper}>
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

            {/* NAVBAR */}
            <nav className={styles.navbar}>
                <div className={`container ${styles.navInner}`}>
                    <a href="/" className={styles.logo}>
                        <span className={styles.logoIcon}>⛩️</span>
                        <span className={styles.logoText}>MangaVerse</span>
                    </a>
                    <div className={styles.navLinks}>
                        <a href="/" className={styles.navLink}>الرئيسية</a>
                        <a href="/browse" className={styles.navLink}>التصفح</a>
                        <a href="/popular" className={styles.navLink}>الأكثر شعبية</a>
                        <a href="/latest" className={styles.navLink}>آخر الإصدارات</a>
                    </div>
                    <div className={styles.navActions}>
                        <form action="/browse" method="GET" className={styles.searchBox}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input
                                type="text"
                                name="q"
                                placeholder="ابحث عن مانجا..."
                                className={styles.searchInput}
                                id="nav-search-input"
                            />
                        </form>
                        <button className="btn btn-primary" id="btn-login">تسجيل الدخول</button>
                    </div>
                </div>
            </nav>

            <main className="container" style={{ marginTop: "20px" }}>
                {/* BREADCRUMB */}
                <div className={styles.breadcrumb}>
                    <a href="/">الرئيسية</a>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <a href="/browse">تصفح</a>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <span className={styles.breadcrumbCurrent}>{manga.titleAr || manga.title}</span>
                </div>

                {/* MANGA HERO BANNER */}
                <section className={styles.mangaHero}>
                    <div className={styles.heroBackground} style={{ backgroundImage: `url(${manga.coverImage})` }} />
                    <div className={styles.heroContent}>
                        <div className={styles.coverContainer}>
                            <img src={manga.coverImage} alt={manga.titleAr || manga.title} className={styles.coverImage} />
                        </div>
                        <div className={styles.detailsContainer}>
                            <div className={styles.badges}>
                                <span className="badge badge-genre" style={{ background: 'rgba(233, 69, 96, 0.15)', color: 'var(--color-accent)' }}>
                                    {getMangaTypeName(manga.type)}
                                </span>
                                <span className="badge badge-new" style={{ background: manga.status === 'ongoing' ? '#2ec4b6' : 'var(--color-secondary)' }}>
                                    {getStatusName(manga.status)}
                                </span>
                            </div>
                            <h1 className={styles.title}>{manga.titleAr || manga.title}</h1>
                            {manga.titleAr && <h2 className={styles.titleSub}>{manga.title}</h2>}
                            
                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>التقييم</span>
                                    <span className={`${styles.statValue} ${styles.statRating}`}>⭐ {manga.rating || "0.0"}</span>
                                </div>
                                <div style={{ width: '1px', height: '20px', background: 'rgba(255, 255, 255, 0.1)' }} />
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>المشاهدات</span>
                                    <span className={styles.statValue}>👁️ {formatViews(manga.views)}</span>
                                </div>
                                <div style={{ width: '1px', height: '20px', background: 'rgba(255, 255, 255, 0.1)' }} />
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>المفضلة</span>
                                    <span className={styles.statValue}>🔖 {formatViews(manga.bookmarks)}</span>
                                </div>
                            </div>

                            <div className={styles.metaGrid}>
                                <div className={styles.metaItem}>
                                    الكاتب: <strong>{manga.author || "غير معروف"}</strong>
                                </div>
                                <div className={styles.metaItem}>
                                    الرسام: <strong>{manga.artist || "غير معروف"}</strong>
                                </div>
                            </div>

                            <div className={styles.actions}>
                                {chapters.length > 0 ? (
                                    <a href={startReadingLink} className="btn btn-primary">ابدأ القراءة</a>
                                ) : (
                                    <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>قريباً</button>
                                )}
                                <button className="btn btn-outline">أضف للمكتبة</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DESCRIPTION AND CHAPTERS GRID */}
                <div className={styles.mainContent}>
                    {/* Right / Main column - Description and Chapters list */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <section className={styles.contentBlock}>
                            <h3 className={styles.blockTitle}>قصة العمل</h3>
                            <p className={styles.descriptionText}>{manga.description || "لا يوجد وصف لهذا العمل حالياً."}</p>
                            <div className={styles.genresList}>
                                {manga.genres?.map((genre, idx) => (
                                    <span key={idx} className="badge badge-genre">{genre}</span>
                                ))}
                            </div>
                        </section>

                        <section className={styles.contentBlock}>
                            <h3 className={styles.blockTitle}>الفصول المتوفرة</h3>
                            <div className={styles.chaptersList}>
                                {chapters.length > 0 ? (
                                    chapters.map((chapter) => (
                                        <div key={chapter._id} className={styles.chapterItem}>
                                            <div className={styles.chapterInfo}>
                                                <h4 className={styles.chapterTitle}>{chapter.title || `الفصل ${chapter.chapterNumber}`}</h4>
                                                <span className={styles.chapterDate}>{formatTime(chapter.createdAt)}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <span className={styles.chapterViews}>👁️ {formatViews(chapter.views)}</span>
                                                <a href={`/manga/${manga.slug}/${chapter.chapterNumber}`} className={styles.readBtn}>
                                                    قراءة
                                                </a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "20px 0" }}>لا توجد فصول متوفرة حالياً لهذا العمل.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Left / Sidebar Column - Popular works or Info */}
                    <div>
                        <section className={styles.contentBlock}>
                            <h3 className={styles.blockTitle}>معلومات إضافية</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: 'var(--font-size-sm)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>الحالة:</span>
                                    <span style={{ fontWeight: 600 }}>{getStatusName(manga.status)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>النوع:</span>
                                    <span style={{ fontWeight: 600 }}>{manga.type.toUpperCase()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>تاريخ النشر:</span>
                                    <span style={{ fontWeight: 600 }}>{manga.createdAt ? new Date(manga.createdAt).toLocaleDateString("ar-EG") : "غير معروف"}</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className={styles.footer}>
                <div className={`container ${styles.footerInner}`}>
                    <div className={styles.footerBrand}>
                        <span className={styles.logoIcon}>⛩️</span>
                        <span className={styles.logoText}>MangaVerse</span>
                        <p className={styles.footerDesc}>
                            وجهتك الأولى لقراءة أفضل المانجا والمانهوا المترجمة للعربية.
                        </p>
                    </div>
                    <div className={styles.footerLinks}>
                        <h4>روابط سريعة</h4>
                        <a href="/">الرئيسية</a>
                        <a href="/browse">التصفح</a>
                        <a href="/popular">الأكثر شعبية</a>
                    </div>
                    <div className={styles.footerLinks}>
                        <h4>تواصل معنا</h4>
                        <a href="#">ديسكورد</a>
                        <a href="#">تيليغرام</a>
                        <a href="#">تويتر</a>
                    </div>
                    <div className={styles.footerCopy}>
                        © 2026 MangaVerse. جميع الحقوق محفوظة.
                    </div>
                </div>
            </footer>
        </div>
    );
}
