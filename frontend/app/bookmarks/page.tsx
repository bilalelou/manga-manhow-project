"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import NavbarUserMenu from "@/app/components/NavbarUserMenu";
import styles from "./bookmarks.module.css";

interface HistoryItem {
    manga: {
        _id: string;
        title: string;
        titleAr: string;
        slug: string;
        coverImage: string;
        type: string;
    } | null;
    chapterNumber: number;
    readAt: string;
    _id: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function BookmarksPage() {
    const { user, token, bookmarks, loading, fetchBookmarks } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"bookmarks" | "history">("bookmarks");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login?redirect=/bookmarks");
        }
    }, [user, loading, router]);

    // Fetch history when history tab is selected
    useEffect(() => {
        const fetchHistory = async () => {
            if (!token || activeTab !== "history") return;
            
            setHistoryLoading(true);
            try {
                const res = await fetch(`${API_URL}/users/history`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (data.status === "success") {
                    setHistory(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchHistory();
    }, [activeTab, token]);

    // Refresh bookmarks on mount
    useEffect(() => {
        if (token) {
            fetchBookmarks();
        }
    }, [token]);

    const formatTime = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        if (minutes < 1) return "الآن";
        if (minutes < 60) return `منذ ${minutes} دقيقة`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `منذ ${hours} ساعة`;
        const days = Math.floor(hours / 24);
        if (days === 1) return "أمس";
        return `منذ ${days} أيام`;
    };

    if (loading || (!user && !loading)) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0f', color: '#f0f0f5' }}>
                جاري التحميل وتدقيق الهوية...
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
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
                    </div>
                    <div className={styles.navActions}>
                        <NavbarUserMenu />
                    </div>
                </div>
            </nav>

            <main className="container" style={{ marginTop: "30px", flex: 1 }}>
                {/* BREADCRUMB */}
                <div className={styles.breadcrumb}>
                    <Link href="/">الرئيسية</Link>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <span className={styles.breadcrumbCurrent}>المفضلة والسجل</span>
                </div>

                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>مكتبتي الخاصة</h1>
                    <p className={styles.pageSubtitle}>تابع أعمالك المفضلة وسجل قراءتك من مكان واحد</p>
                </div>

                {/* TABS HEADER */}
                <div className={styles.tabsContainer}>
                    <button
                        className={`${styles.tab} ${activeTab === "bookmarks" ? styles.tabActive : ""}`}
                        onClick={() => setActiveTab("bookmarks")}
                    >
                        ❤️ مفضلتي ({bookmarks.length})
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === "history" ? styles.tabActive : ""}`}
                        onClick={() => setActiveTab("history")}
                    >
                        ⏳ سجل القراءة
                    </button>
                </div>

                {/* TAB CONTENT */}
                {activeTab === "bookmarks" ? (
                    bookmarks.length > 0 ? (
                        <div className={styles.cardsGrid}>
                            {bookmarks.map((bookmark) => {
                                const manga = bookmark.manga;
                                if (!manga) return null;
                                return (
                                    <div key={manga._id} className={styles.card}>
                                        <Link href={`/manga/${manga.slug}`} className={styles.cardImage}>
                                            <img
                                                src={manga.coverImage}
                                                alt={manga.titleAr || manga.title}
                                                className={styles.cardCoverImage}
                                            />
                                        </Link>
                                        <div className={styles.cardBody}>
                                            <Link href={`/manga/${manga.slug}`} className={styles.cardTitle}>
                                                {manga.titleAr || manga.title}
                                            </Link>
                                            <div className={styles.cardProgress}>
                                                <span>الفصل المقروء:</span>
                                                <strong>
                                                    {bookmark.lastReadChapter > 0 ? `الفصل ${bookmark.lastReadChapter}` : "لم تبدأ بعد"}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>🤍</span>
                            <h3 className={styles.emptyTitle}>قائمة المفضلة فارغة</h3>
                            <p className={styles.emptyDesc}>
                                تصفح المانجا والمانهوا المتاحة وقم بإضافتها لمفضلتك للوصول السريع إليها لاحقاً.
                            </p>
                            <Link href="/browse" className="btn btn-primary">
                                تصفح المانجا الآن
                            </Link>
                        </div>
                    )
                ) : (
                    /* HISTORY TAB */
                    historyLoading ? (
                        <div style={{ padding: "50px 0", textAlign: "center", color: "#a1a1aa" }}>جاري تحميل سجل القراءة...</div>
                    ) : history.length > 0 ? (
                        <div className={styles.historyList}>
                            {history.map((item) => {
                                const manga = item.manga;
                                if (!manga) return null;
                                return (
                                    <div key={item._id} className={styles.historyItem}>
                                        <div className={styles.historyLeft}>
                                            <img
                                                src={manga.coverImage}
                                                alt={manga.titleAr || manga.title}
                                                className={styles.historyThumb}
                                            />
                                            <div className={styles.historyInfo}>
                                                <Link href={`/manga/${manga.slug}`} className={styles.historyMangaTitle}>
                                                    {manga.titleAr || manga.title}
                                                </Link>
                                                <div className={styles.historyChapter}>
                                                    قرأت:{" "}
                                                    <Link href={`/manga/${manga.slug}/${item.chapterNumber}`} style={{ color: "#818cf8", textDecoration: "none" }}>
                                                        الفصل {item.chapterNumber}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.historyTime}>
                                            <span>📅</span>
                                            <span>{formatTime(item.readAt)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>📖</span>
                            <h3 className={styles.emptyTitle}>لا يوجد سجل قراءة</h3>
                            <p className={styles.emptyDesc}>
                                ابدأ بقراءة فصول المانجا وسيتم تسجيل الفصول التي تقرأها هنا تلقائياً لسهولة الرجوع لها.
                            </p>
                            <Link href="/" className="btn btn-primary">
                                ابدأ القراءة الآن
                            </Link>
                        </div>
                    )
                )}
            </main>

            {/* FOOTER */}
            <footer className={styles.footer}>
                <div className="container">
                    © 2026 MangaVerse. جميع الحقوق محفوظة.
                </div>
            </footer>
        </div>
    );
}
