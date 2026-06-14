"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import styles from "../login/auth.module.css";

function RegisterContent() {
    const { register, user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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

        if (!username || !email || !password) {
            setError("يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        if (username.length < 3) {
            setError("يجب أن يكون اسم المستخدم 3 أحرف على الأقل");
            return;
        }

        if (password.length < 6) {
            setError("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
            return;
        }

        if (password !== confirmPassword) {
            setError("كلمتا المرور غير متطابقتين");
            return;
        }

        setSubmitting(true);
        try {
            const res = await register(username, email, password);
            if (res.success) {
                router.push(redirect);
            } else {
                setError(res.message || "حدث خطأ ما أثناء إنشاء الحساب");
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
                    <h1 className={styles.title}>إنشاء حساب جديد</h1>
                    <p className={styles.subtitle}>انضم إلينا لحفظ تقدم قراءتك للمانجا</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.errorMsg}>
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className={styles.group}>
                        <label className={styles.label} htmlFor="username">
                            اسم المستخدم
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="username"
                                type="text"
                                placeholder="مثال: bilal"
                                className={styles.input}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={submitting}
                                required
                            />
                        </div>
                    </div>

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
                                placeholder="•••••••• (6 رموز على الأقل)"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={submitting}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label} htmlFor="confirmPassword">
                            تأكيد كلمة المرور
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                className={styles.input}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={submitting}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.button} disabled={submitting}>
                        {submitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                    </button>
                </form>

                <div className={styles.footer}>
                    <span>لديك حساب بالفعل؟</span>
                    <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className={styles.link}>
                        تسجيل الدخول
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

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0f', color: '#f0f0f5' }}>
                جاري التحميل...
            </div>
        }>
            <RegisterContent />
        </Suspense>
    );
}
