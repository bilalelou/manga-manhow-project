"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import LogoIcon from "@/app/components/LogoIcon";
import styles from "./admin.module.css";

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
}

interface ChapterType {
    _id: string;
    chapterNumber: number;
    title?: string;
    views: number;
    createdAt: string;
}

interface UserListType {
    _id: string;
    username: string;
    email: string;
    role: "user" | "translator" | "admin";
    createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const KNOWN_GENRES = [
    "أكشن", "مغامرات", "فانتازيا", "دراما", "كوميدي", "رومنسي", 
    "خارق للطبيعة", "غموض", "نظام", "تاريخي", "شونين", 
    "خيال علمي", "إثارة", "شريحة من الحياة"
];

export default function AdminDashboard() {
    const { user, token, loading } = useAuth();
    const router = useRouter();

    // UI Tab State
    const [activeTab, setActiveTab] = useState<"mangas" | "add-chapter" | "manage-chapters" | "users">("mangas");

    // General States
    const [mangas, setMangas] = useState<MangaType[]>([]);
    const [loadingMangas, setLoadingMangas] = useState(false);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Form: Manga State
    const [editingMangaId, setEditingMangaId] = useState<string | null>(null);
    const [mangaTitle, setMangaTitle] = useState("");
    const [mangaTitleAr, setMangaTitleAr] = useState("");
    const [mangaDesc, setMangaDesc] = useState("");
    const [mangaCover, setMangaCover] = useState("");
    const [mangaType, setMangaType] = useState<"manga" | "manhwa" | "manhua">("manga");
    const [mangaStatus, setMangaStatus] = useState<"ongoing" | "completed" | "hiatus" | "dropped">("ongoing");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [mangaAuthor, setMangaAuthor] = useState("");
    const [mangaArtist, setMangaArtist] = useState("");
    const [mangaRating, setMangaRating] = useState("0");
    const [mangaHot, setMangaHot] = useState(false);
    const [mangaFeatured, setMangaFeatured] = useState(false);
    const [mangaSubmitting, setMangaSubmitting] = useState(false);
    const [showMangaForm, setShowMangaForm] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);

    // Form: Chapter State
    const [chapterMangaId, setChapterMangaId] = useState("");
    const [chapterNumber, setChapterNumber] = useState("");
    const [chapterTitle, setChapterTitle] = useState("");
    const [chapterPagesText, setChapterPagesText] = useState("");
    const [chapterSubmitting, setChapterSubmitting] = useState(false);
    const [uploadingPages, setUploadingPages] = useState(false);

    // Form: Manage Chapters State
    const [selectedMangaForChapters, setSelectedMangaForChapters] = useState("");
    const [chaptersList, setChaptersList] = useState<ChapterType[]>([]);
    const [loadingChapters, setLoadingChapters] = useState(false);

    // Form: Manage Users State
    const [usersList, setUsersList] = useState<UserListType[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [updatingUserRoleId, setUpdatingUserRoleId] = useState<string | null>(null);

    // Search filter
    const [mangaSearchQuery, setMangaSearchQuery] = useState("");
    const [userSearchQuery, setUserSearchQuery] = useState("");

    // Access control redirect
    useEffect(() => {
        if (!loading && (!user || (user.role !== "admin" && user.role !== "translator"))) {
            router.push("/");
        }
    }, [user, loading, router]);

    // Load mangas
    const fetchMangas = async () => {
        setLoadingMangas(true);
        try {
            const res = await fetch(`${API_URL}/mangas?limit=100`);
            const data = await res.json();
            if (data.status === "success") {
                setMangas(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch mangas in dashboard:", err);
        } finally {
            setLoadingMangas(false);
        }
    };

    // Load users (Admin only)
    const fetchUsers = async () => {
        if (!token || user?.role !== "admin") return;
        setLoadingUsers(true);
        try {
            const res = await fetch(`${API_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.status === "success") {
                setUsersList(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch users list:", err);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (user && (user.role === "admin" || user.role === "translator")) {
            fetchMangas();
        }
        if (user && user.role === "admin" && activeTab === "users") {
            fetchUsers();
        }
    }, [user, activeTab]);

    // Fetch chapters for management tab
    const fetchChaptersForManga = async (mangaSlug: string) => {
        if (!mangaSlug) {
            setChaptersList([]);
            return;
        }
        setLoadingChapters(true);
        try {
            const res = await fetch(`${API_URL}/mangas/${mangaSlug}`);
            const data = await res.json();
            if (data.status === "success") {
                setChaptersList(data.data.chapters);
            }
        } catch (err) {
            console.error("Failed to fetch chapters for dashboard:", err);
        } finally {
            setLoadingChapters(false);
        }
    };

    useEffect(() => {
        if (selectedMangaForChapters) {
            const selectedMangaObj = mangas.find(m => m._id === selectedMangaForChapters);
            if (selectedMangaObj) {
                fetchChaptersForManga(selectedMangaObj.slug);
            }
        } else {
            setChaptersList([]);
        }
    }, [selectedMangaForChapters, mangas]);

    // Alert helper
    const triggerAlert = (type: "success" | "error", message: string) => {
        setAlert({ type, message });
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setAlert(null), 5000);
    };

    // File Upload: Single Image (Manga Cover)
    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingCover(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(`${API_URL}/upload/single`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();
            if (data.status === "success") {
                setMangaCover(data.url);
                triggerAlert("success", "تم رفع الغلاف بنجاح!");
            } else {
                triggerAlert("error", data.message || "فشل رفع الصورة");
            }
        } catch (err) {
            triggerAlert("error", "حدث خطأ أثناء محاولة رفع الغلاف");
        } finally {
            setUploadingCover(false);
        }
    };

    // File Upload: Multiple Images (Chapter Pages)
    const handlePagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingPages(true);
        const formData = new FormData();
        // Append all files to the "images" field
        for (let i = 0; i < files.length; i++) {
            formData.append("images", files[i]);
        }

        try {
            const res = await fetch(`${API_URL}/upload/multiple`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();
            if (data.status === "success") {
                // Return local paths as newline-separated strings
                const localUrls = data.urls.join("\n");
                setChapterPagesText(prev => prev ? `${prev}\n${localUrls}` : localUrls);
                triggerAlert("success", `تم رفع ${files.length} صفحات بنجاح!`);
            } else {
                triggerAlert("error", data.message || "فشل رفع الصفحات");
            }
        } catch (err) {
            triggerAlert("error", "حدث خطأ أثناء رفع صفحات الفصل");
        } finally {
            setUploadingPages(false);
        }
    };

    // Open Add Manga
    const handleOpenAddManga = () => {
        setEditingMangaId(null);
        setMangaTitle("");
        setMangaTitleAr("");
        setMangaDesc("");
        setMangaCover("");
        setMangaType("manga");
        setMangaStatus("ongoing");
        setSelectedGenres([]);
        setMangaAuthor("");
        setMangaArtist("");
        setMangaRating("0");
        setMangaHot(false);
        setMangaFeatured(false);
        setShowMangaForm(true);
    };

    // Open Edit Manga
    const handleOpenEditManga = (m: MangaType) => {
        setEditingMangaId(m._id);
        setMangaTitle(m.title);
        setMangaTitleAr(m.titleAr || "");
        setMangaDesc(m.description || "");
        setMangaCover(m.coverImage || "");
        setMangaType(m.type);
        setMangaStatus(m.status);
        setSelectedGenres(m.genres || []);
        setMangaAuthor(m.author || "");
        setMangaArtist(m.artist || "");
        setMangaRating(m.rating?.toString() || "0");
        setMangaHot(!!m.isHot);
        setMangaFeatured(!!m.isFeatured);
        setShowMangaForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Genre Checkbox Handler
    const handleGenreChange = (genre: string) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter(g => g !== genre));
        } else {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    // Manga Save
    const handleMangaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mangaTitle) {
            triggerAlert("error", "عنوان العمل بالإنجليزية مطلوب");
            return;
        }

        setMangaSubmitting(true);
        try {
            const bodyData = {
                title: mangaTitle,
                titleAr: mangaTitleAr,
                description: mangaDesc,
                coverImage: mangaCover,
                type: mangaType,
                status: mangaStatus,
                genres: selectedGenres,
                author: mangaAuthor,
                artist: mangaArtist,
                rating: Number(mangaRating),
                isHot: mangaHot,
                isFeatured: mangaFeatured
            };

            const url = editingMangaId ? `${API_URL}/mangas/${editingMangaId}` : `${API_URL}/mangas`;
            const method = editingMangaId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(bodyData)
            });

            const data = await res.json();
            if (data.status === "success") {
                triggerAlert("success", editingMangaId ? "تم تعديل العمل بنجاح" : "تم إضافة العمل بنجاح");
                setShowMangaForm(false);
                fetchMangas();
            } else {
                triggerAlert("error", data.message || "حدث خطأ أثناء الحفظ");
            }
        } catch (err) {
            triggerAlert("error", "حدث خطأ أثناء الاتصال بالسيرفر");
        } finally {
            setMangaSubmitting(false);
        }
    };

    // Delete Manga
    const handleDeleteManga = async (mangaId: string, mangaTitle: string) => {
        if (!confirm(`هل أنت متأكد من حذف العمل "${mangaTitle}" بالكامل مع فصوله؟`)) {
            return;
        }

        try {
            const res = await fetch(`${API_URL}/mangas/${mangaId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (data.status === "success") {
                triggerAlert("success", "تم حذف العمل وكافة فصوله التابعة له");
                fetchMangas();
            } else {
                triggerAlert("error", data.message || "فشل حذف العمل");
            }
        } catch (err) {
            triggerAlert("error", "حدث خطأ أثناء الاتصال بالخادم لحذف العمل");
        }
    };

    // Chapter Save
    const handleChapterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chapterMangaId) {
            triggerAlert("error", "يرجى اختيار العمل أولاً");
            return;
        }
        if (!chapterNumber) {
            triggerAlert("error", "رقم الفصل مطلوب");
            return;
        }
        if (!chapterPagesText.trim()) {
            triggerAlert("error", "يرجى لصق أو رفع روابط الصفحات");
            return;
        }

        setChapterSubmitting(true);
        try {
            const urls = chapterPagesText.split("\n").map(l => l.trim()).filter(Boolean);
            const formattedPages = urls.map((url, index) => ({
                pageNumber: index + 1,
                imageUrl: url
            }));

            const bodyData = {
                mangaId: chapterMangaId,
                chapterNumber: Number(chapterNumber),
                title: chapterTitle,
                pages: formattedPages
            };

            const res = await fetch(`${API_URL}/chapters`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(bodyData)
            });

            const data = await res.json();
            if (data.status === "success") {
                triggerAlert("success", `تم إضافة الفصل رقم ${chapterNumber} بنجاح!`);
                setChapterNumber("");
                setChapterTitle("");
                setChapterPagesText("");
            } else {
                triggerAlert("error", data.message || "فشل رفع الفصل");
            }
        } catch (err) {
            triggerAlert("error", "حدث خطأ أثناء الاتصال بالخادم لحفظ الفصل");
        } finally {
            setChapterSubmitting(false);
        }
    };

    // Delete Chapter
    const handleDeleteChapter = async (chapterId: string, chapNum: number) => {
        if (!confirm(`هل تريد بالتأكيد حذف الفصل رقم ${chapNum}؟`)) {
            return;
        }

        try {
            const res = await fetch(`${API_URL}/chapters/${chapterId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (data.status === "success") {
                triggerAlert("success", "تم حذف الفصل بنجاح");
                // Refresh list
                const selectedMangaObj = mangas.find(m => m._id === selectedMangaForChapters);
                if (selectedMangaObj) {
                    fetchChaptersForManga(selectedMangaObj.slug);
                }
            } else {
                triggerAlert("error", data.message || "فشل حذف الفصل");
            }
        } catch (err) {
            triggerAlert("error", "حدث خطأ أثناء الاتصال بالخادم لحذف الفصل");
        }
    };

    // Update User Role (Admin only)
    const handleUpdateUserRole = async (userId: string, username: string, newRole: "user" | "translator" | "admin") => {
        if (!confirm(`هل أنت متأكد من تغيير دور العضو "${username}" إلى "${newRole === "admin" ? "مسؤول" : newRole === "translator" ? "مترجم" : "عضو عادي"}"؟`)) {
            return;
        }

        setUpdatingUserRoleId(userId);
        try {
            const res = await fetch(`${API_URL}/users/${userId}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            const data = await res.json();
            if (data.status === "success") {
                triggerAlert("success", `تم تحديث دور "${username}" بنجاح!`);
                fetchUsers();
            } else {
                triggerAlert("error", data.message || "فشل تعديل الصلاحيات");
            }
        } catch (err) {
            triggerAlert("error", "حدث خطأ أثناء الاتصال بالخادم لتحديث الصلاحيات");
        } finally {
            setUpdatingUserRoleId(null);
        }
    };

    // Search filters
    const filteredMangas = mangas.filter(m => 
        m.title.toLowerCase().includes(mangaSearchQuery.toLowerCase()) ||
        (m.titleAr && m.titleAr.includes(mangaSearchQuery))
    );

    const filteredUsers = usersList.filter(u => 
        u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className={styles.wrapper} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ fontSize: "1.2rem", color: "var(--color-text-secondary)" }}>جاري التحقق من الصلاحيات...</div>
            </div>
        );
    }

    if (!user || (user.role !== "admin" && user.role !== "translator")) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <div className={`container ${styles.navInner}`}>
                    <a href="/" className={styles.logo}>
                        <LogoIcon className={styles.logoIcon} />
                        <span className={styles.logoText}>MangaVerse</span>
                    </a>
                    <div className={styles.navActions}>
                        <a href="/" className={styles.homeLink}>
                            <span>🏠</span>
                            <span>العودة للرئيسية</span>
                        </a>
                    </div>
                </div>
            </nav>

            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>لوحة تحكم المشرفين والمترجمين</h1>
                    <p className={styles.subtitle}>أهلاً بك {user.username}، يمكنك إدارة الأعمال والترجمات وفصول المانجا من هنا.</p>
                </div>

                {/* Alerts */}
                {alert && (
                    <div className={`${styles.alert} ${alert.type === "success" ? styles.alertSuccess : styles.alertError}`}>
                        <span>{alert.type === "success" ? "✅" : "⚠️"}</span>
                        <span>{alert.message}</span>
                    </div>
                )}

                {/* Tab buttons */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === "mangas" ? styles.tabBtnActive : ""}`}
                        onClick={() => { setActiveTab("mangas"); setShowMangaForm(false); }}
                    >
                        📚 إدارة الأعمال المترجمة
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === "add-chapter" ? styles.tabBtnActive : ""}`}
                        onClick={() => { setActiveTab("add-chapter"); setShowMangaForm(false); }}
                    >
                        ➕ إضافة فصل جديد
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === "manage-chapters" ? styles.tabBtnActive : ""}`}
                        onClick={() => { setActiveTab("manage-chapters"); setShowMangaForm(false); }}
                    >
                        ⚙️ إدارة الفصول وحذفها
                    </button>
                    {user.role === "admin" && (
                        <button
                            className={`${styles.tabBtn} ${activeTab === "users" ? styles.tabBtnActive : ""}`}
                            onClick={() => { setActiveTab("users"); setShowMangaForm(false); }}
                        >
                            👥 إدارة صلاحيات الأعضاء
                        </button>
                    )}
                </div>

                {/* TAB CONTENT: MANGAS LIST */}
                {activeTab === "mangas" && (
                    <div>
                        {showMangaForm && (
                            <div className={styles.card}>
                                <div className={styles.modalHeader}>
                                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                                        {editingMangaId ? `تعديل بيانات العمل: ${mangaTitle}` : "إضافة عمل مانجا/مانهوا جديد"}
                                    </h3>
                                    <button className={styles.modalClose} onClick={() => setShowMangaForm(false)}>✕</button>
                                </div>
                                <form onSubmit={handleMangaSubmit}>
                                    <div className={styles.formSectionTitle}>المعلومات الأساسية</div>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>عنوان العمل بالإنجليزية *</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="مثال: Solo Leveling"
                                                value={mangaTitle}
                                                onChange={(e) => setMangaTitle(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>العنوان باللغة العربية</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="مثال: سولو ليفيلينغ"
                                                value={mangaTitleAr}
                                                onChange={(e) => setMangaTitleAr(e.target.value)}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>رابط غلاف العمل (أو ارفعه أدناه)</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="http://example.com/cover.jpg"
                                                value={mangaCover}
                                                onChange={(e) => setMangaCover(e.target.value)}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>رفع صورة غلاف محلي</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleCoverUpload}
                                                className={styles.input}
                                                style={{ display: 'none' }}
                                                id="cover-upload-file"
                                            />
                                            <label htmlFor="cover-upload-file" className={`${styles.btn} ${styles.btnOutline}`} style={{ cursor: 'pointer', display: 'flex', gap: '8px' }}>
                                                📂 {uploadingCover ? "جاري رفع الغلاف..." : "اختر ملف الغلاف"}
                                            </label>
                                            {mangaCover && (
                                                <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <img src={mangaCover} alt="Cover Preview" style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    <span style={{ fontSize: '11px', color: '#00c850' }}>تم تجهيز الغلاف للمانجا</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>نوع العمل</label>
                                            <select
                                                className={styles.select}
                                                value={mangaType}
                                                onChange={(e) => setMangaType(e.target.value as any)}
                                            >
                                                <option value="manga">مانجا يابانية (Manga)</option>
                                                <option value="manhwa">مانهوا كورية (Manhwa)</option>
                                                <option value="manhua">مانهوا صينية (Manhua)</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>حالة العمل</label>
                                            <select
                                                className={styles.select}
                                                value={mangaStatus}
                                                onChange={(e) => setMangaStatus(e.target.value as any)}
                                            >
                                                <option value="ongoing">مستمر (Ongoing)</option>
                                                <option value="completed">مكتمل (Completed)</option>
                                                <option value="hiatus">متوقف مؤقتاً (Hiatus)</option>
                                                <option value="dropped">مهجور (Dropped)</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>التقييم الأولي (0 - 10)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                className={styles.input}
                                                value={mangaRating}
                                                onChange={(e) => setMangaRating(e.target.value)}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>الكاتب (Author)</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="Chugong"
                                                value={mangaAuthor}
                                                onChange={(e) => setMangaAuthor(e.target.value)}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>الرسام (Artist)</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="DUBU"
                                                value={mangaArtist}
                                                onChange={(e) => setMangaArtist(e.target.value)}
                                            />
                                        </div>
                                        <div className={styles.formGroupFull}>
                                            <label className={styles.label}>وصف وقصة المانجا</label>
                                            <textarea
                                                className={styles.textarea}
                                                placeholder="اكتب تفاصيل القصة هنا..."
                                                value={mangaDesc}
                                                onChange={(e) => setMangaDesc(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formSectionTitle}>التصنيفات وعلامات الترويج</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <label className={styles.label} style={{ display: 'block', marginBottom: '0.5rem' }}>التصنيفات المتاحة:</label>
                                            <div className={styles.genresGrid}>
                                                {KNOWN_GENRES.map((g) => (
                                                    <label key={g} className={styles.checkboxLabel}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedGenres.includes(g)}
                                                            onChange={() => handleGenreChange(g)}
                                                        />
                                                        <span>{g}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className={styles.label} style={{ display: 'block', marginBottom: '0.5rem' }}>علامات ترويجية:</label>
                                            <div className={styles.checkboxesRow}>
                                                <label className={styles.checkboxLabel}>
                                                    <input
                                                        type="checkbox"
                                                        checked={mangaHot}
                                                        onChange={(e) => setMangaHot(e.target.checked)}
                                                    />
                                                    <span>عمل رائج وساخن 🔥 (isHot)</span>
                                                </label>
                                                <label className={styles.checkboxLabel}>
                                                    <input
                                                        type="checkbox"
                                                        checked={mangaFeatured}
                                                        onChange={(e) => setMangaFeatured(e.target.checked)}
                                                    />
                                                    <span>مميز في البانر الرئيسي ⭐ (isFeatured)</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.actionsBar}>
                                        <button
                                            type="button"
                                            className={`${styles.btn} ${styles.btnOutline}`}
                                            onClick={() => setShowMangaForm(false)}
                                        >
                                            إلغاء
                                        </button>
                                        <button
                                            type="submit"
                                            className={`${styles.btn} ${styles.btnPrimary}`}
                                            disabled={mangaSubmitting}
                                        >
                                            {mangaSubmitting ? "جاري الحفظ..." : "حفظ العمل"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Search & Actions */}
                        <div className={styles.card}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
                                    <input
                                        type="text"
                                        placeholder="ابحث في قائمة الأعمال..."
                                        className={styles.input}
                                        style={{ width: '100%' }}
                                        value={mangaSearchQuery}
                                        onChange={(e) => setMangaSearchQuery(e.target.value)}
                                    />
                                </div>
                                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleOpenAddManga}>
                                    ➕ إضافة عمل جديد
                                </button>
                            </div>

                            {loadingMangas ? (
                                <div style={{ textAlign: 'center', padding: '2rem 0' }}>جاري تحميل الأعمال...</div>
                            ) : filteredMangas.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>🔍</div>
                                    <p>لم يتم العثور على أي مانجا مطابقة.</p>
                                </div>
                            ) : (
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th className={styles.th}>العمل</th>
                                                <th className={styles.th}>النوع</th>
                                                <th className={styles.th}>الحالة</th>
                                                <th className={styles.th}>التقييم</th>
                                                <th className={styles.th} style={{ textAlign: 'center' }}>العمليات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredMangas.map((m) => (
                                                <tr key={m._id}>
                                                    <td className={styles.td}>
                                                        <div className={styles.mangaInfoCell}>
                                                            <img src={m.coverImage || "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100"} alt={m.title} className={styles.thumbnail} />
                                                            <div className={styles.mangaTitles}>
                                                                <span className={styles.mangaTitle}>{m.titleAr || m.title}</span>
                                                                <span className={styles.mangaSlug}>{m.slug}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={styles.td}>
                                                        <span className={styles.badge} style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-secondary)' }}>
                                                            {m.type === "manhwa" ? "مانهوا كورية" : m.type === "manhua" ? "مانهوا صينية" : "مانجا يابانية"}
                                                        </span>
                                                    </td>
                                                    <td className={styles.td}>
                                                        <span className={`${styles.badge} ${m.status === "completed" ? styles.badgeCompleted : styles.badgeOngoing}`}>
                                                            {m.status === "ongoing" ? "مستمر" : m.status === "completed" ? "مكتمل" : m.status === "hiatus" ? "توقف مؤقت" : "مهجور"}
                                                        </span>
                                                        <div style={{ display: 'inline-flex', gap: '3px', marginRight: '6px' }}>
                                                            {m.isHot && <span className={`${styles.badge} ${styles.badgeHot}`}>رائج</span>}
                                                            {m.isFeatured && <span className={`${styles.badge} ${styles.badgeFeatured}`}>مميز</span>}
                                                        </div>
                                                    </td>
                                                    <td className={styles.td}>⭐ {m.rating}</td>
                                                    <td className={styles.td} style={{ textAlign: 'center' }}>
                                                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                                            <button className={`${styles.btn} ${styles.btnOutline}`} style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleOpenEditManga(m)}>
                                                                ✏️ تعديل
                                                            </button>
                                                            <button className={`${styles.btn} ${styles.btnDanger}`} style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleDeleteManga(m._id, m.title)}>
                                                                🗑️ حذف
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB CONTENT: ADD CHAPTER */}
                {activeTab === "add-chapter" && (
                    <div className={styles.card}>
                        <h3 className={styles.formSectionTitle} style={{ marginBottom: '1.5rem' }}>إضافة فصل جديد لعمل موجود</h3>
                        <form onSubmit={handleChapterSubmit}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>اختر المانجا/المانهوا *</label>
                                    <select
                                        className={styles.select}
                                        value={chapterMangaId}
                                        onChange={(e) => setChapterMangaId(e.target.value)}
                                        required
                                    >
                                        <option value="">-- اختر العمل --</option>
                                        {mangas.map((m) => (
                                            <option key={m._id} value={m._id}>{m.titleAr || m.title} ({m.title})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>رقم الفصل *</label>
                                    <input
                                        type="number"
                                        step="1"
                                        min="1"
                                        className={styles.input}
                                        placeholder="مثال: 5"
                                        value={chapterNumber}
                                        onChange={(e) => setChapterNumber(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroupFull}>
                                    <label className={styles.label}>عنوان الفصل (اختياري)</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="مثال: بداية معركة جديدة"
                                        value={chapterTitle}
                                        onChange={(e) => setChapterTitle(e.target.value)}
                                    />
                                </div>
                                
                                <div className={styles.formGroupFull}>
                                    <label className={styles.label}>رفع صور الفصل محلياً دفعة واحدة</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePagesUpload}
                                        className={styles.input}
                                        style={{ display: 'none' }}
                                        id="pages-upload-files"
                                    />
                                    <label htmlFor="pages-upload-files" className={`${styles.btn} ${styles.btnOutline}`} style={{ cursor: 'pointer', display: 'flex', gap: '8px', width: 'fit-content' }}>
                                        📂 {uploadingPages ? "جاري رفع صور الصفحات..." : "اختر صور الفصل لرفعها بالكامل"}
                                    </label>
                                </div>

                                <div className={styles.formGroupFull}>
                                    <label className={styles.label}>روابط صفحات الفصل (رابط واحد في كل سطر) *</label>
                                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                                        عند اختيار ورفع الصور محلياً، سيتم توليد الروابط هنا تلقائياً، أو يمكنك كتابة/لصق روابط خارجية مباشرة.
                                    </p>
                                    <textarea
                                        className={`${styles.textarea} ${styles.textareaPages}`}
                                        placeholder="https://example.com/page1.jpg&#10;https://example.com/page2.jpg"
                                        value={chapterPagesText}
                                        onChange={(e) => setChapterPagesText(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.actionsBar}>
                                <button
                                    type="submit"
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    disabled={chapterSubmitting || uploadingPages}
                                >
                                    {chapterSubmitting ? "جاري حفظ الفصل..." : "رفع وحفظ الفصل"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* TAB CONTENT: MANAGE CHAPTERS */}
                {activeTab === "manage-chapters" && (
                    <div className={styles.card}>
                        <h3 className={styles.formSectionTitle} style={{ marginBottom: '1.5rem' }}>إدارة فصول الأعمال</h3>
                        <div className={styles.mangaSelectorWrapper}>
                            <label className={styles.label} style={{ display: 'block', marginBottom: '0.5rem' }}>اختر المانجا لاستعراض فصولها:</label>
                            <select
                                className={styles.select}
                                style={{ width: '100%' }}
                                value={selectedMangaForChapters}
                                onChange={(e) => setSelectedMangaForChapters(e.target.value)}
                            >
                                <option value="">-- اختر العمل --</option>
                                {mangas.map((m) => (
                                    <option key={m._id} value={m._id}>{m.titleAr || m.title}</option>
                                ))}
                            </select>
                        </div>

                        {!selectedMangaForChapters ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>📖</div>
                                <p>يرجى اختيار مانجا لعرض فصولها المرفوعة وإدارتها.</p>
                            </div>
                        ) : loadingChapters ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>جاري جلب قائمة الفصول...</div>
                        ) : chaptersList.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>📭</div>
                                <p>لا توجد فصول مرفوعة لهذا العمل حتى الآن.</p>
                            </div>
                        ) : (
                            <div className={styles.chapterListContainer}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                                    الفصول المتوفرة ({chaptersList.length})
                                </h4>
                                <div className={styles.chaptersGrid}>
                                    {chaptersList.map((ch) => (
                                        <div key={ch._id} className={styles.chapterItem}>
                                            <div className={styles.chapterInfo}>
                                                <span className={styles.chapterNumText}>الفصل رقم {ch.chapterNumber}</span>
                                                {ch.title && <span className={styles.chapterTitleText}>{ch.title}</span>}
                                                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                                    👁️ {ch.views} مشاهدة • {new Date(ch.createdAt).toLocaleDateString("ar-EG")}
                                                </span>
                                            </div>
                                            <button 
                                                className={styles.trashBtn} 
                                                onClick={() => handleDeleteChapter(ch._id, ch.chapterNumber)}
                                                title="حذف الفصل"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB CONTENT: MANAGE USERS (Admin Only) */}
                {activeTab === "users" && user.role === "admin" && (
                    <div className={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <h3 className={styles.formSectionTitle} style={{ margin: 0 }}>إدارة صلاحيات ورتب الأعضاء</h3>
                            <div style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '300px' }}>
                                <input
                                    type="text"
                                    placeholder="ابحث عن عضو (الاسم/البريد)..."
                                    className={styles.input}
                                    style={{ width: '100%' }}
                                    value={userSearchQuery}
                                    onChange={(e) => setUserSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {loadingUsers ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>جاري تحميل قائمة الأعضاء...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>👥</div>
                                <p>لم يتم العثور على مستخدمين مطابقتين للبحث.</p>
                            </div>
                        ) : (
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th className={styles.th}>اسم العضو</th>
                                            <th className={styles.th}>البريد الإلكتروني</th>
                                            <th className={styles.th}>تاريخ الانضمام</th>
                                            <th className={styles.th}>نوع الحساب (الصلاحية)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((u) => (
                                            <tr key={u._id}>
                                                <td className={styles.td} style={{ fontWeight: 700 }}>
                                                    {u.username} {u._id === user._id && <span style={{ color: 'var(--color-accent)', fontSize: '11px' }}>(أنت)</span>}
                                                </td>
                                                <td className={styles.td} style={{ color: 'var(--color-text-secondary)' }}>{u.email}</td>
                                                <td className={styles.td} style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
                                                    {new Date(u.createdAt).toLocaleDateString("ar-EG")}
                                                </td>
                                                <td className={styles.td}>
                                                    <select
                                                        className={styles.select}
                                                        value={u.role}
                                                        onChange={(e) => handleUpdateUserRole(u._id, u.username, e.target.value as any)}
                                                        disabled={updatingUserRoleId === u._id || u._id === user._id}
                                                    >
                                                        <option value="user">عضو عادي (User)</option>
                                                        <option value="translator">مترجم (Translator)</option>
                                                        <option value="admin">مسؤول / مدير (Admin)</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
