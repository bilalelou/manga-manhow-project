"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import NavbarUserMenu from "./NavbarUserMenu";
import LogoIcon from "./LogoIcon";
import { SearchIcon } from "./Icons";
import styles from "./Navbar.module.css";

interface NavbarProps {
    showSearch?: boolean;
}

export default function Navbar({ showSearch = true }: NavbarProps) {
    const { user, logout, loading } = useAuth();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isSidebarOpen]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // User avatar text
    const firstLetter = user?.username ? user.username.trim().charAt(0).toUpperCase() : "";

    return (
        <>
            <nav className={styles.navbar}>
                <div className={`container ${styles.navInner}`}>
                    {/* Logo & Desktop Nav Links */}
                    <div className={styles.navBrandSection}>
                        <Link href="/" className={styles.logo}>
                            <LogoIcon className={styles.logoIcon} />
                            <span className={styles.logoText}>MangaVerse</span>
                        </Link>
                        
                        <div className={styles.navLinks}>
                            <Link href="/" className={`${styles.navLink} ${pathname === "/" ? styles.activeLink : ""}`}>
                                الرئيسية
                            </Link>
                            <Link href="/browse" className={`${styles.navLink} ${pathname === "/browse" && !showSearch ? styles.activeLink : ""}`}>
                                التصفح
                            </Link>
                            <Link href="/browse?sort=views" className={styles.navLink}>
                                الأكثر شعبية
                            </Link>
                            <Link href="/browse?sort=latest" className={styles.navLink}>
                                آخر الإصدارات
                            </Link>
                        </div>
                    </div>

                    {/* Actions: Search & Auth User Menu */}
                    <div className={styles.navActions}>
                        {showSearch && (
                            <form action="/browse" method="GET" className={styles.searchBox}>
                                <span className={styles.searchIcon}><SearchIcon size={16} /></span>
                                <input
                                    type="text"
                                    name="q"
                                    placeholder="ابحث عن مانجا..."
                                    className={styles.searchInput}
                                    id="nav-search-input-desktop"
                                />
                            </form>
                        )}
                        
                        <div className={styles.desktopUserMenu}>
                            <NavbarUserMenu />
                        </div>

                        {/* Hamburger Button for Mobile */}
                        <button 
                            className={styles.hamburgerBtn} 
                            onClick={toggleSidebar}
                            aria-label="قائمة التنقل"
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay Backdrop */}
            <div 
                className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.overlayVisible : ""}`} 
                onClick={closeSidebar}
            />

            {/* Mobile Sidebar Drawer */}
            <aside className={`${styles.sidebarDrawer} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
                <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.sidebarLogo} onClick={closeSidebar}>
                        <LogoIcon className={styles.logoIcon} width={24} height={24} />
                        <span className={styles.logoText}>MangaVerse</span>
                    </Link>
                    
                    <button 
                        className={styles.closeBtn} 
                        onClick={closeSidebar}
                        aria-label="إغلاق القائمة"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className={styles.sidebarContent}>
                    {/* Mobile Search Box inside Sidebar */}
                    {showSearch && (
                        <form action="/browse" method="GET" className={styles.mobileSearchBox} onSubmit={closeSidebar}>
                            <span className={styles.mobileSearchIcon}><SearchIcon size={16} /></span>
                            <input
                                type="text"
                                name="q"
                                placeholder="ابحث عن مانجا..."
                                className={styles.mobileSearchInput}
                                id="nav-search-input-mobile"
                            />
                        </form>
                    )}

                    {/* Navigation Links */}
                    <div className={styles.sidebarLinks}>
                        <Link href="/" className={`${styles.sidebarLink} ${pathname === "/" ? styles.activeSidebarLink : ""}`} onClick={closeSidebar}>
                            🏠 الرئيسية
                        </Link>
                        <Link href="/browse" className={`${styles.sidebarLink} ${pathname === "/browse" && !showSearch ? styles.activeSidebarLink : ""}`} onClick={closeSidebar}>
                            🔍 التصفح
                        </Link>
                        <Link href="/browse?sort=views" className={styles.sidebarLink} onClick={closeSidebar}>
                            🔥 الأكثر شعبية
                        </Link>
                        <Link href="/browse?sort=latest" className={styles.sidebarLink} onClick={closeSidebar}>
                            ⚡ آخر الإصدارات
                        </Link>
                    </div>

                    <div className={styles.sidebarDivider} />

                    {/* Authentication Section inside Sidebar */}
                    <div className={styles.sidebarAuthSection}>
                        {loading ? (
                            <div className={styles.sidebarLoading}>جاري التحميل...</div>
                        ) : user ? (
                            <div className={styles.sidebarUserSection}>
                                <div className={styles.userInfo}>
                                    <div className={styles.sidebarAvatar}>{firstLetter}</div>
                                    <span className={styles.username}>{user.username}</span>
                                </div>
                                <div className={styles.sidebarDividerSub} />
                                
                                {(user.role === "admin" || user.role === "translator") && (
                                    <Link href="/admin" className={styles.sidebarUserLink} onClick={closeSidebar}>
                                        ⚙️ لوحة التحكم (الآدمن)
                                    </Link>
                                )}
                                
                                <Link href="/bookmarks" className={styles.sidebarUserLink} onClick={closeSidebar}>
                                    ❤️ مفضلتي والتقدم
                                </Link>

                                <button 
                                    className={`${styles.sidebarUserLink} ${styles.sidebarLogoutBtn}`}
                                    onClick={() => {
                                        closeSidebar();
                                        logout();
                                    }}
                                >
                                    🚪 تسجيل الخروج
                                </button>
                            </div>
                        ) : (
                            <div className={styles.sidebarAuthButtons}>
                                <Link href="/login" className={styles.sidebarLoginBtn} onClick={closeSidebar}>
                                    تسجيل الدخول
                                </Link>
                                <Link href="/register" className={styles.sidebarRegisterBtn} onClick={closeSidebar}>
                                    إنشاء حساب
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
