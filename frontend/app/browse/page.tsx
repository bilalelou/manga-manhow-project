"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./browse.module.css";

// Interface definitions for TypeScript safety
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
        isFeatured: true,
        createdAt: "2026-06-01T00:00:00.000Z"
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
        isHot: true,
        isFeatured: false,
        createdAt: "2026-06-02T00:00:00.000Z"
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
        bookmarks: 98000,
        isHot: false,
        isFeatured: false,
        createdAt: "2026-06-03T00:00:00.000Z"
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
        isHot: true,
        isFeatured: false,
        createdAt: "2026-06-04T00:00:00.000Z"
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
        bookmarks: 87000,
        isHot: false,
        isFeatured: false,
        createdAt: "2026-06-05T00:00:00.000Z"
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
        isHot: true,
        isFeatured: false,
        createdAt: "2026-06-06T00:00:00.000Z"
    }
];

const allGenres = [
    "أكشن",
    "فانتازيا",
    "مغامرات",
    "نظام",
    "كوميديا",
    "خيال",
    "غموض",
    "دراما",
    "فوق الطبيعة",
    "مدرسي",
    "شياطين",
    "إعادة تجسد",
    "خيال علمي"
];

function BrowseContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Read initial values from URL search params
    const initialQuery = searchParams.get("q") || "";
    const initialType = searchParams.get("type") || "";
    const initialStatus = searchParams.get("status") || "";
    const initialGenre = searchParams.get("genre") || "";
    const initialSort = searchParams.get("sort") || "latest";

    // Component State
    const [searchVal, setSearchVal] = useState(initialQuery);
    const [selectedType, setSelectedType] = useState(initialType);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const [selectedGenre, setSelectedGenre] = useState(initialGenre);
    const [selectedSort, setSelectedSort] = useState(initialSort);

    const [mangas, setMangas] = useState<MangaType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(true);

    // Sync URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchVal) params.set("q", searchVal);
        if (selectedType) params.set("type", selectedType);
        if (selectedStatus) params.set("status", selectedStatus);
        if (selectedGenre) params.set("genre", selectedGenre);
        if (selectedSort !== "latest") params.set("sort", selectedSort);

        const queryString = params.toString();
        const newUrl = `/browse${queryString ? "?" + queryString : ""}`;
        window.history.replaceState(null, "", newUrl);
    }, [searchVal, selectedType, selectedStatus, selectedGenre, selectedSort]);

    // Fetch matching mangas from API or fallback locally
    useEffect(() => {
        const fetchFilteredData = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                if (searchVal) queryParams.set("q", searchVal);
                if (selectedType) queryParams.set("type", selectedType);
                if (selectedStatus) queryParams.set("status", selectedStatus);
                if (selectedGenre) queryParams.set("genre", selectedGenre);
                if (selectedSort) queryParams.set("sort", selectedSort);

                const res = await fetch(`${API_URL}/mangas?${queryParams.toString()}`, {
                    cache: "no-store"
                });

                if (!res.ok) throw new Error("API responded with error");
                const json = await res.json();
                setMangas(json.data || []);
                setIsConnected(!json.isFallback);
            } catch (err) {
                console.warn("⚠️ API fetch failed on browse page, falling back to local filtering:", err);
                setIsConnected(false);

                // Perform client side local filtering
                let data = [...localMockMangas];

                if (selectedType) {
                    data = data.filter(m => m.type === selectedType);
                }
                if (selectedStatus) {
                    data = data.filter(m => m.status === selectedStatus);
                }
                if (selectedGenre) {
                    data = data.filter(m => m.genres && m.genres.includes(selectedGenre));
                }
                if (searchVal) {
                    const qLower = searchVal.toLowerCase();
                    data = data.filter(m =>
                        m.title.toLowerCase().includes(qLower) ||
                        (m.titleAr && m.titleAr.toLowerCase().includes(qLower)) ||
                        (m.description && m.description.toLowerCase().includes(qLower))
                    );
                }

                // Sort logic
                if (selectedSort === "views") {
                    data.sort((a, b) => b.views - a.views);
                } else if (selectedSort === "rating") {
                    data.sort((a, b) => b.rating - a.rating);
                } else {
                    // latest / createdAt
                    data.sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return dateB - dateA;
                    });
                }

                setMangas(data);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredData();
    }, [searchVal, selectedType, selectedStatus, selectedGenre, selectedSort]);

    const handleGenreToggle = (genre: string) => {
        if (selectedGenre === genre) {
            setSelectedGenre(""); // Clear if clicked again
        } else {
            setSelectedGenre(genre);
        }
    };

    const handleResetFilters = () => {
        setSearchVal("");
        setSelectedType("");
        setSelectedStatus("");
        setSelectedGenre("");
        setSelectedSort("latest");
    };

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
                        <a href="/browse" className={styles.navLink} style={{ color: "var(--color-accent)" }}>التصفح</a>
                        <a href="/popular" className={styles.navLink}>الأكثر شعبية</a>
                        <a href="/latest" className={styles.navLink}>آخر الإصدارات</a>
                    </div>
                    <div className={styles.navActions}>
                        <button className="btn btn-primary" id="btn-login">تسجيل الدخول</button>
                    </div>
                </div>
            </nav>

            <main className="container" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {/* BREADCRUMB */}
                <div className={styles.breadcrumb}>
                    <a href="/">الرئيسية</a>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <span className={styles.breadcrumbCurrent}>تصفح المانجا</span>
                </div>

                <div className={styles.mainContent}>
                    {/* FILTER SIDEBAR */}
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarTitle}>
                            <span>🛠️ أدوات التصفية</span>
                            {(searchVal || selectedType || selectedStatus || selectedGenre || selectedSort !== "latest") && (
                                <button className={styles.resetBtn} onClick={handleResetFilters} id="btn-reset-filters">
                                    إعادة تعيين
                                </button>
                            )}
                        </div>

                        {/* Search Input Box */}
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>البحث النصي</label>
                            <div className={styles.pageSearchBox}>
                                <span className={styles.searchIcon}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="ابحث بالعربية أو الإنجليزية..."
                                    value={searchVal}
                                    onChange={(e) => setSearchVal(e.target.value)}
                                    className={styles.pageSearchInput}
                                    id="page-search-input"
                                />
                            </div>
                        </div>

                        {/* Type Selector */}
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>النوع</label>
                            <div className={styles.tagGrid}>
                                <button
                                    className={`${styles.filterTag} ${selectedType === "" ? styles.filterTagActive : ""}`}
                                    onClick={() => setSelectedType("")}
                                    id="filter-type-all"
                                >
                                    الكل
                                </button>
                                <button
                                    className={`${styles.filterTag} ${selectedType === "manga" ? styles.filterTagActive : ""}`}
                                    onClick={() => setSelectedType("manga")}
                                    id="filter-type-manga"
                                >
                                    مانجا (اليابان)
                                </button>
                                <button
                                    className={`${styles.filterTag} ${selectedType === "manhwa" ? styles.filterTagActive : ""}`}
                                    onClick={() => setSelectedType("manhwa")}
                                    id="filter-type-manhwa"
                                >
                                    مانهوا (كوريا)
                                </button>
                            </div>
                        </div>

                        {/* Status Selector */}
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>الحالة</label>
                            <div className={styles.tagGrid}>
                                <button
                                    className={`${styles.filterTag} ${selectedStatus === "" ? styles.filterTagActive : ""}`}
                                    onClick={() => setSelectedStatus("")}
                                    id="filter-status-all"
                                >
                                    الكل
                                </button>
                                <button
                                    className={`${styles.filterTag} ${selectedStatus === "ongoing" ? styles.filterTagActive : ""}`}
                                    onClick={() => setSelectedStatus("ongoing")}
                                    id="filter-status-ongoing"
                                >
                                    مستمر
                                </button>
                                <button
                                    className={`${styles.filterTag} ${selectedStatus === "completed" ? styles.filterTagActive : ""}`}
                                    onClick={() => setSelectedStatus("completed")}
                                    id="filter-status-completed"
                                >
                                    مكتمل
                                </button>
                            </div>
                        </div>

                        {/* Genre Selection */}
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>التصنيفات</label>
                            <div className={styles.tagGrid}>
                                {allGenres.map((genre) => (
                                    <button
                                        key={genre}
                                        className={`${styles.filterTag} ${selectedGenre === genre ? styles.filterTagActive : ""}`}
                                        onClick={() => handleGenreToggle(genre)}
                                        id={`filter-genre-${genre}`}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort Order Selector */}
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>الترتيب حسب</label>
                            <select
                                value={selectedSort}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                className={styles.sortSelect}
                                id="select-sort"
                            >
                                <option value="latest">أحدث الأعمال</option>
                                <option value="views">الأكثر مشاهدة</option>
                                <option value="rating">الأعلى تقييماً</option>
                            </select>
                        </div>
                    </aside>

                    {/* RESULTS SIDE */}
                    <div className={styles.resultsArea}>
                        <div className={styles.resultsHeader}>
                            <div>
                                نتائج البحث:{" "}
                                <span className={styles.resultsCount} id="results-count">
                                    {mangas.length} عمل
                                </span>
                            </div>
                        </div>

                        {loading ? (
                            <div className={styles.loadingContainer}>
                                <div className={styles.spinner} />
                            </div>
                        ) : mangas.length > 0 ? (
                            <div className={styles.cardsGrid}>
                                {mangas.map((manga) => (
                                    <a href={`/manga/${manga.slug}`} key={manga._id} className={styles.card} id={`manga-card-${manga.slug}`}>
                                        <div className={styles.cardImage}>
                                            <img
                                                src={manga.coverImage}
                                                alt={manga.titleAr || manga.title}
                                                className={styles.cardCoverImage}
                                                loading="lazy"
                                            />
                                            {manga.isHot && (
                                                <span className="badge badge-hot" style={{ position: 'absolute', top: '8px', right: '8px' }}>
                                                    🔥 رائج
                                                </span>
                                            )}
                                        </div>
                                        <div className={styles.cardBody}>
                                            <h3 className={styles.cardTitle}>{manga.titleAr || manga.title}</h3>
                                            <div className={styles.cardMeta}>
                                                <span className={styles.cardRating}>⭐ {manga.rating}</span>
                                                <span style={{ fontSize: "10px", color: "var(--color-text-muted)" }}>
                                                    {manga.type === "manhwa" ? "مانهوا كورية" : "مانجا يابانية"}
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState} id="empty-state">
                                <span className={styles.emptyIcon}>🔍</span>
                                <h3 className={styles.emptyTitle}>لا توجد نتائج مطابقة</h3>
                                <p className={styles.emptyDesc}>
                                    جرب تغيير فلاتر البحث أو التأكد من تهجئة الاسم بشكل صحيح للوصول للأعمال التي تريدها.
                                </p>
                                <button className="btn btn-primary" onClick={handleResetFilters}>
                                    مسح الفلاتر والبدء من جديد
                                </button>
                            </div>
                        )}
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

export default function Page() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0f', color: '#f0f0f5' }}>
                جاري التحميل...
            </div>
        }>
            <BrowseContent />
        </Suspense>
    );
}
