"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import styles from "./RecentReadsShelf.module.css";

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

export default function RecentReadsShelf() {
    const { user, token } = useAuth();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!token || !user) return;
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/users/history`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (data.status === "success" && Array.isArray(data.data)) {
                    // Show only the 4 most recent reads on the homepage
                    setHistory(data.data.slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to fetch reading history for shelf:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [token, user]);

    const formatRelativeTime = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        if (minutes < 1) return "الآن";
        if (minutes < 60) return `منذ ${minutes} دقيقة`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `منذ ${hours} ساعة`;
        const days = Math.floor(hours / 24);
        if (days === 1) return "أمس";
        if (days < 7) return `منذ ${days} أيام`;
        return new Date(dateStr).toLocaleDateString("ar-EG");
    };

    // Render nothing if user is offline, loading, or has no reading history
    if (!user || loading || history.length === 0) {
        return null;
    }

    return (
        <div className="container">
            <section className={styles.shelfSection}>
                <div className={styles.shelfHeader}>
                    <h2 className={styles.shelfTitle}>
                        <span className={styles.icon}>⚡</span> أكمل القراءة
                    </h2>
                    <Link href="/bookmarks?tab=history" className={styles.viewAllLink}>
                        عرض السجل الكامل ⬅️
                    </Link>
                </div>
                <div className={styles.shelfGrid}>
                    {history.map((item) => {
                        const manga = item.manga;
                        if (!manga) return null;
                        return (
                            <div key={item._id} className={styles.shelfCard}>
                                <Link href={`/manga/${manga.slug}`} className={styles.coverLink}>
                                    <img
                                        src={manga.coverImage}
                                        alt={manga.titleAr || manga.title}
                                        className={styles.coverImage}
                                    />
                                    <span className={styles.mangaType}>
                                        {manga.type === "manhwa" ? "مانهوا" : "مانجا"}
                                    </span>
                                </Link>
                                <div className={styles.cardInfo}>
                                    <h3 className={styles.mangaTitle}>
                                        <Link href={`/manga/${manga.slug}`}>
                                            {manga.titleAr || manga.title}
                                        </Link>
                                    </h3>
                                    <div className={styles.chapterProgress}>
                                        وصلت إلى: <span>الفصل {item.chapterNumber}</span>
                                    </div>
                                    <div className={styles.metaRow}>
                                        <span className={styles.readTime}>
                                        <svg 
                                            viewBox="0 0 24 24" 
                                            width="12" 
                                            height="12" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2.5" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                            style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "5px" }}
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        {formatRelativeTime(item.readAt)}
                                    </span>
                                        <Link
                                            href={`/manga/${manga.slug}/${item.chapterNumber}`}
                                            className={styles.resumeBtn}
                                        >
                                            متابعة
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
