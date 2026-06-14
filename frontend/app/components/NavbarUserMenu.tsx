"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import styles from "./NavbarUserMenu.module.css";

export default function NavbarUserMenu() {
    const { user, logout, loading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Toggle dropdown
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (loading) {
        return (
            <div className={styles.wrapper}>
                <div style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>جاري التحميل...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.authButtons}>
                <Link href="/login" className={styles.loginBtn}>
                    تسجيل الدخول
                </Link>
                <Link href="/register" className={styles.registerBtn}>
                    إنشاء حساب
                </Link>
            </div>
        );
    }

    // Get first letter of username for avatar
    const firstLetter = user.username.trim().charAt(0).toUpperCase();

    return (
        <div className={styles.wrapper} ref={dropdownRef}>
            <button className={styles.userBtn} onClick={toggleDropdown}>
                <div className={styles.avatar}>{firstLetter}</div>
                <span>{user.username}</span>
                <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}>▼</span>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div style={{ padding: "0.6rem 1.2rem", fontSize: "0.8rem", color: "#71717a" }}>
                        مرحباً، {user.username}
                    </div>
                    <div className={styles.dropdownDivider} />
                    
                    <Link href="/bookmarks" className={styles.dropdownItem} onClick={() => setIsOpen(false)}>
                        <span>❤️</span>
                        <span>مفضلتي والتقدم</span>
                    </Link>
                    
                    <div className={styles.dropdownDivider} />
                    
                    <button 
                        className={`${styles.dropdownItem} ${styles.logoutBtn}`}
                        onClick={() => {
                            setIsOpen(false);
                            logout();
                        }}
                    >
                        <span>🚪</span>
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            )}
        </div>
    );
}
