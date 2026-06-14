"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

interface BookmarkButtonProps {
    mangaId: string;
    slug: string;
}

export default function BookmarkButton({ mangaId, slug }: BookmarkButtonProps) {
    const { user, isBookmarked, toggleBookmark } = useAuth();
    const router = useRouter();
    const [isConnecting, setIsConnecting] = useState(false);

    const bookmarked = isBookmarked(mangaId);

    const handleToggle = async () => {
        if (!user) {
            // Redirect to login with current page as redirect back
            const redirectUrl = `/manga/${slug}`;
            router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
            return;
        }

        setIsConnecting(true);
        try {
            await toggleBookmark(mangaId);
        } catch (error) {
            console.error("Failed to toggle bookmark:", error);
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isConnecting}
            className={`btn ${bookmarked ? "btn-primary" : "btn-outline"}`}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                minWidth: "150px",
                borderColor: bookmarked ? "#ef4444" : "rgba(255, 255, 255, 0.2)",
                background: bookmarked ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" : "transparent",
                color: "#ffffff",
                transition: "all 0.2s ease",
                boxShadow: bookmarked ? "0 4px 12px rgba(239, 68, 68, 0.3)" : "none",
            }}
        >
            <span style={{ fontSize: "1.1rem" }}>{bookmarked ? "❤️" : "🤍"}</span>
            <span>{bookmarked ? "في المفضلة" : "أضف للمفضلة"}</span>
        </button>
    );
}
