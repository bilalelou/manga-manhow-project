"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import styles from "./auth.module.css";

function LoginContent() {
    const { login, user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const redirect = searchParams.get("redirect") || "/";

    // If already logged in, redirect away
    useEffect(() => {
        if (user && !loading) {
            router.push(redirect);
        }
    }, [user, loading, router, redirect]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
            return;
        }

        setSubmitting(true);
        try {
            const res = await login(email, password);
            if (res.success) {
                router.push(redirect);
            } else {
                setError(res.message || "حدث خطأ ما أثناء تسجيل الدخول");
            }
        } catch (err) {
            setError("تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: 600 }}>جاري التحميل...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>

            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>أهلاً بك مجدداً</h1>
                    <p className={styles.subtitle}>سجل الدخول لمتابعة فصولك المفضلة</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.errorMsg}>
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className={styles.group}>
                        <label className={styles.label} htmlFor="email">
                            البريد الإلكتروني
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={submitting}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label} htmlFor="password">
                            كلمة المرور
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={submitting}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.button} disabled={submitting}>
                        {submitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                    </button>
                </form>

                <div className={styles.footer}>
                    <span>ليس لديك حساب؟</span>
                    <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className={styles.link}>
                        إنشاء حساب جديد
                    </Link>
                </div>

                <Link href="/" className={styles.homeLink}>
                    <span>🏠</span>
                    <span>العودة للرئيسية</span>
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0f', color: '#f0f0f5' }}>
                جاري التحميل...
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
