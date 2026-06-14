import styles from "./page.module.css";
import NavbarUserMenu from "@/app/components/NavbarUserMenu";

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

// Fetch helper
async function getMangas(params = "") {
    try {
        const res = await fetch(`${API_URL}/mangas${params}`, {
            cache: "no-store",
            next: { revalidate: 0 }
        });
        if (!res.ok) throw new Error("Server responded with error status");
        const json = await res.json();
        return {
            data: json.data as MangaType[],
            isFallback: !!json.isFallback,
            isConnected: true
        };
    } catch (err) {
        console.warn(`⚠️ Failed to fetch mangas with query '${params}', using local mock data:`, err);
        return {
            data: null,
            isFallback: true,
            isConnected: false
        };
    }
}

export default async function Home() {
    // Fetch data from backend
    const featuredResult = await getMangas("?featured=true&limit=1");
    const latestResult = await getMangas("?limit=6");
    const popularResult = await getMangas("?limit=5&sort=views");

    // Connection diagnostics
    const isLiveConnection = latestResult.isConnected && !latestResult.isFallback;

    // Resolve Hero (Featured) Manga
    const heroManga: Partial<MangaType> = (featuredResult.data && featuredResult.data[0]) || {
        _id: "60c72b2f9b1d8b2c88888801",
        title: "Solo Leveling",
        titleAr: "سولو ليفيلينغ",
        slug: "solo-leveling",
        description: "في عالم حيث يُفتح بوابات تربط بين عالمنا وعالم الوحوش، يصبح سونغ جين-وو أضعف صياد من الرتبة E. لكن بعد حادثة غامضة في زنزانة مزدوجة، يحصل على قوة خفية تمكنه من الارتقاء بلا حدود...",
        coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80",
        type: "manhwa",
        rating: 9.8,
        genres: ["أكشن", "فانتازيا", "مغامرات"]
    };

    // Resolve Latest Mangas
    const latestMangasToShow: Partial<MangaType>[] = latestResult.data || [
        {
            _id: "60c72b2f9b1d8b2c88888801",
            title: "Solo Leveling",
            titleAr: "سولو ليفيلينغ",
            slug: "solo-leveling",
            coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80",
            type: "manhwa",
            isHot: true,
            createdAt: new Date().toISOString()
        },
        {
            _id: "60c72b2f9b1d8b2c88888802",
            title: "One Piece",
            titleAr: "ون بيس",
            slug: "one-piece",
            coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80",
            type: "manga",
            isHot: true,
            createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
            _id: "60c72b2f9b1d8b2c88888804",
            title: "Jujutsu Kaisen",
            titleAr: "جوجوتسو كايسن",
            slug: "jujutsu-kaisen",
            coverImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80",
            type: "manga",
            isHot: true,
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
            _id: "60c72b2f9b1d8b2c88888803",
            title: "Tower of God",
            titleAr: "برج الإله",
            slug: "tower-of-god",
            coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80",
            type: "manhwa",
            isHot: false,
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
            _id: "60c72b2f9b1d8b2c88888805",
            title: "The Beginning After The End",
            titleAr: "البداية بعد النهاية",
            slug: "the-beginning-after-the-end",
            coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
            type: "manhwa",
            isHot: false,
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
            _id: "60c72b2f9b1d8b2c88888806",
            title: "Omniscient Reader",
            titleAr: "وجهة نظر القارئ العليم",
            slug: "omniscient-reader",
            coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80",
            type: "manhwa",
            isHot: true,
            createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
        }
    ];

    // Resolve Popular Mangas
    const popularMangasToShow: Partial<MangaType>[] = popularResult.data || [
        { _id: "60c72b2f9b1d8b2c88888802", title: "One Piece", titleAr: "ون بيس", slug: "one-piece", type: "manga", rating: 9.7, views: 3100000, coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80", genres: ["مغامرات"] },
        { _id: "60c72b2f9b1d8b2c88888801", title: "Solo Leveling", titleAr: "سولو ليفيلينغ", slug: "solo-leveling", type: "manhwa", rating: 9.8, views: 2500000, coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80", genres: ["أكشن"] },
        { _id: "60c72b2f9b1d8b2c88888806", title: "Omniscient Reader", titleAr: "وجهة نظر القارئ العليم", slug: "omniscient-reader", type: "manhwa", rating: 9.6, views: 1900000, coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80", genres: ["نظام"] },
        { _id: "60c72b2f9b1d8b2c88888803", title: "Tower of God", titleAr: "برج الإله", slug: "tower-of-god", type: "manhwa", rating: 9.5, views: 1800000, coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80", genres: ["غموض"] },
        { _id: "60c72b2f9b1d8b2c88888804", title: "Jujutsu Kaisen", titleAr: "جوجوتسو كايسن", slug: "jujutsu-kaisen", type: "manga", rating: 9.4, views: 1600000, coverImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80", genres: ["أكشن"] }
    ];

    // Helper formatting functions
    const formatViews = (viewsNum?: number) => {
        if (!viewsNum) return "0";
        if (viewsNum >= 1000000) return (viewsNum / 1000000).toFixed(1) + "M";
        if (viewsNum >= 1000) return (viewsNum / 1000).toFixed(0) + "K";
        return viewsNum.toString();
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

    const getMangaTypeName = (type?: string) => {
        if (type === "manhwa") return "مانهوا كوريا";
        if (type === "manhua") return "مانهوا صينية";
        return "مانجا يابانية";
    };

    return (
        <div className={styles.wrapper}>
            {/* ===== DIAGNOSTIC CONNECTION BADGE ===== */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                zIndex: 1000,
                background: isLiveConnection ? 'rgba(0, 200, 80, 0.9)' : 'rgba(233, 69, 96, 0.9)',
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
                    animation: 'pulse 1.5s infinite'
                }} />
                {isLiveConnection ? 'متصل بقاعدة البيانات حية' : 'نمط المحاكاة الاحتياطي (DB offline)'}
            </div>

            {/* ===== NAVBAR ===== */}
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
                        <NavbarUserMenu />
                    </div>
                </div>
            </nav>

            {/* ===== HERO SECTION ===== */}
            <section className={styles.hero} style={{
                backgroundImage: `linear-gradient(to left, rgba(10, 10, 15, 0.9) 30%, rgba(10, 10, 15, 0.3) 100%), url(${heroManga.coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 20%'
            }}>
                <div className={styles.heroOverlay} />
                <div className={`container ${styles.heroContent}`}>
                    <span className={styles.heroBadge}>🔥 الأكثر رواجاً هذا الأسبوع</span>
                    <h1 className={styles.heroTitle}>{heroManga.titleAr || heroManga.title}</h1>
                    <p className={styles.heroDesc}>{heroManga.description}</p>
                    <div className={styles.heroMeta}>
                        {heroManga.genres?.map((g, i) => (
                            <span key={i} className="badge badge-genre">{g}</span>
                        ))}
                        <span className="badge badge-genre" style={{ background: 'rgba(233, 69, 96, 0.15)', color: 'var(--color-accent)' }}>
                            {getMangaTypeName(heroManga.type)}
                        </span>
                        <span className={styles.heroRating}>⭐ {heroManga.rating}</span>
                    </div>
                    <div className={styles.heroActions}>
                        <a href={`/manga/${heroManga.slug}`} className="btn btn-primary" id="hero-read-btn">ابدأ القراءة</a>
                        <button className="btn btn-outline" id="hero-bookmark-btn">أضف للمكتبة</button>
                    </div>
                </div>
            </section>

            {/* ===== LATEST UPDATES ===== */}
            <section className={styles.section}>
                <div className="container">
                    <h2 className="section-title">آخر التحديثات</h2>
                    <div className={styles.cardGrid}>
                        {latestMangasToShow.map((manga) => (
                            <a href={`/manga/${manga.slug}`} key={manga._id} className={styles.card}>
                                <div className={styles.cardImage}>
                                    <img
                                        src={manga.coverImage}
                                        alt={manga.titleAr || manga.title}
                                        className={styles.cardCoverImage}
                                        loading="lazy"
                                    />
                                    <span className="badge badge-genre" style={{
                                        position: 'absolute',
                                        bottom: '8px',
                                        right: '8px',
                                        background: 'rgba(10, 10, 15, 0.85)',
                                        backdropFilter: 'blur(4px)',
                                        fontSize: '10px'
                                    }}>
                                        {manga.type === "manhwa" ? "مانهوا" : "مانجا"}
                                    </span>
                                    {manga.isHot && <span className="badge badge-hot" style={{ position: 'absolute', top: '8px', right: '8px' }}>🔥 رائج</span>}
                                </div>
                                <div className={styles.cardBody}>
                                    <h3 className={styles.cardTitle}>{manga.titleAr || manga.title}</h3>
                                    <p className={styles.cardChapter} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>الفصل 2</span>
                                        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{formatTime(manga.createdAt)}</span>
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== POPULAR SECTION ===== */}
            <section className={styles.section} style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
                <div className="container">
                    <h2 className="section-title">الأكثر شعبية</h2>
                    <div className={styles.popularList}>
                        {popularMangasToShow.map((manga, index) => (
                            <a href={`/manga/${manga.slug}`} key={manga._id} className={styles.popularItem}>
                                <span className={styles.popularRank}>#{index + 1}</span>
                                <div className={styles.popularCover}>
                                    <img
                                        src={manga.coverImage}
                                        alt={manga.titleAr || manga.title}
                                        className={styles.popularCoverImage}
                                        loading="lazy"
                                    />
                                </div>
                                <div className={styles.popularInfo}>
                                    <h3 className={styles.popularTitle}>{manga.titleAr || manga.title}</h3>
                                    <div className={styles.popularMeta}>
                                        {manga.genres?.slice(0, 2).map((g, i) => (
                                            <span key={i} className="badge badge-genre">{g}</span>
                                        ))}
                                        <span className={styles.popularRating}>⭐ {manga.rating}</span>
                                    </div>
                                </div>
                                <span className={styles.popularViews}>👁️ {formatViews(manga.views)} مشاهدة</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
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

            {/* Pulse Keyframe Animation Inject */}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(0.9); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.9); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
}
