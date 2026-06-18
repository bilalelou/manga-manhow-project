"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

interface StarRatingProps {
    mangaId: string;
    initialAverageRating: number;
    onRatingUpdated?: (newAvg: number) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function StarRating({ mangaId, initialAverageRating, onRatingUpdated }: StarRatingProps) {
    const { user, token } = useAuth();
    const router = useRouter();
    const [userRating, setUserRating] = useState<number | null>(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

    // Fetch user's current rating for this manga if logged in
    useEffect(() => {
        const fetchMyRating = async () => {
            if (!token || !user) return;
            try {
                const res = await fetch(`${API_URL}/ratings/manga/${mangaId}/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (data.status === "success" && data.data) {
                    setUserRating(data.data.value);
                }
            } catch (err) {
                console.error("Error fetching my rating:", err);
            }
        };

        fetchMyRating();
    }, [mangaId, token, user]);

    const handleRate = async (ratingValue: number) => {
        if (!user || !token) {
            setMessage({ text: "يجب عليك تسجيل الدخول لتقييم المانجا", type: "info" });
            setTimeout(() => setMessage(null), 4000);
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch(`${API_URL}/ratings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    mangaId,
                    value: ratingValue,
                }),
            });

            const data = await res.json();

            if (data.status === "success") {
                setUserRating(ratingValue);
                setMessage({ text: "تم تسجيل تقييمك بنجاح!", type: "success" });
                router.refresh();
                if (onRatingUpdated && data.data && data.data.newAverage !== undefined) {
                    onRatingUpdated(data.data.newAverage);
                }
            } else {
                setMessage({ text: data.message || "فشل تسجيل التقييم", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "حدث خطأ أثناء الاتصال بالخادم لتقديم التقييم", type: "error" });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 4000);
        }
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            background: "rgba(30, 30, 45, 0.4)",
            padding: "16px 20px",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            marginTop: "15px",
            width: "100%",
            maxWidth: "360px"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", fontWeight: 500 }}>
                    {user ? "تقييمك الشخصي:" : "سجل دخولك للتقييم:"}
                </span>
                {userRating !== null && (
                    <span style={{
                        fontSize: "0.85rem",
                        color: "#fbbf24",
                        background: "rgba(251, 191, 36, 0.1)",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontWeight: "bold"
                    }}>
                        {userRating} / 10
                    </span>
                )}
            </div>

            {/* Stars Container */}
            <div 
                style={{ 
                    display: "flex", 
                    gap: "4px", 
                    direction: "ltr", 
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "5px 0"
                }}
                onMouseLeave={() => setHoverRating(null)}
            >
                {[...Array(10)].map((_, index) => {
                    const starValue = index + 1;
                    const isFilled = hoverRating !== null 
                        ? starValue <= hoverRating 
                        : userRating !== null 
                            ? starValue <= userRating 
                            : false;

                    return (
                        <button
                            key={starValue}
                            type="button"
                            onClick={() => handleRate(starValue)}
                            onMouseEnter={() => !loading && setHoverRating(starValue)}
                            disabled={loading}
                            style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: loading ? "not-allowed" : "pointer",
                                outline: "none",
                                transition: "transform 0.1s ease",
                                transform: hoverRating === starValue ? "scale(1.25)" : "scale(1)"
                            }}
                            title={`تقييم بـ ${starValue} من 10`}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="22"
                                height="22"
                                style={{
                                    transition: "fill 0.2s ease, filter 0.2s ease",
                                    fill: isFilled ? "#fbbf24" : "rgba(255, 255, 255, 0.15)",
                                    filter: isFilled ? "drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))" : "none"
                                }}
                            >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        </button>
                    );
                })}
            </div>

            {/* Action Messages */}
            {message && (
                <div style={{
                    fontSize: "0.8rem",
                    color: message.type === "success" 
                        ? "#10b981" 
                        : message.type === "error" 
                            ? "#ef4444" 
                            : "#60a5fa",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    marginTop: "2px"
                }}>
                    {message.text}
                </div>
            )}
        </div>
    );
}
