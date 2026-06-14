"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Bookmark {
    manga: {
        _id: string;
        title: string;
        titleAr: string;
        slug: string;
        coverImage: string;
        type: string;
        status: string;
        rating: number;
    };
    lastReadChapter: number;
    addedAt: string;
}

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    bookmarks: Bookmark[];
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (username: string, email: string, password: string, secretKey?: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    toggleBookmark: (mangaId: string) => Promise<boolean>;
    addHistory: (mangaId: string, chapterNumber: number) => Promise<void>;
    fetchBookmarks: () => Promise<void>;
    isBookmarked: (mangaId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial load: Check token from localStorage and verify
    useEffect(() => {
        const loadUser = async () => {
            const storedToken = localStorage.getItem("manga_token");
            if (storedToken) {
                try {
                    setToken(storedToken);
                    const res = await fetch(`${API_URL}/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    });
                    const data = await res.json();
                    if (data.status === "success") {
                        setUser(data.data);
                        // Fetch bookmarks immediately if authenticated
                        fetchBookmarksData(storedToken);
                    } else {
                        // Token expired or invalid
                        localStorage.removeItem("manga_token");
                        setToken(null);
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                    // On network error, we don't clear token immediately, just set user null
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    // Helper to fetch bookmarks
    const fetchBookmarksData = async (authToken: string) => {
        try {
            const res = await fetch(`${API_URL}/users/bookmarks`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const data = await res.json();
            if (data.status === "success") {
                setBookmarks(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch bookmarks:", error);
        }
    };

    const fetchBookmarks = async () => {
        if (token) {
            await fetchBookmarksData(token);
        }
    };

    // Check if manga is bookmarked
    const isBookmarked = (mangaId: string) => {
        return bookmarks.some((b) => b.manga && b.manga._id === mangaId);
    };

    // Register user
    const register = async (username: string, email: string, password: string, secretKey?: string) => {
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, secretKey }),
            });
            const data = await res.json();
            if (data.status === "success") {
                const { token: userToken, ...userData } = data.data;
                localStorage.setItem("manga_token", userToken);
                setToken(userToken);
                setUser(userData);
                setBookmarks([]);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "فشل الاتصال بالخادم. يرجى المحاولة لاحقاً." };
        }
    };

    // Login user
    const login = async (email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (data.status === "success") {
                const { token: userToken, ...userData } = data.data;
                localStorage.setItem("manga_token", userToken);
                setToken(userToken);
                setUser(userData);
                fetchBookmarksData(userToken);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "فشل الاتصال بالخادم. يرجى المحاولة لاحقاً." };
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("manga_token");
        setToken(null);
        setUser(null);
        setBookmarks([]);
    };

    // Toggle Bookmark
    const toggleBookmark = async (mangaId: string): Promise<boolean> => {
        if (!token) return false;
        try {
            const res = await fetch(`${API_URL}/users/bookmarks/toggle`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ mangaId }),
            });
            const data = await res.json();
            if (data.status === "success") {
                // Refresh bookmarks
                await fetchBookmarksData(token);
                return data.data.isBookmarked;
            }
            return false;
        } catch (error) {
            console.error("Failed to toggle bookmark:", error);
            return false;
        }
    };

    // Add reading history
    const addHistory = async (mangaId: string, chapterNumber: number) => {
        if (!token) return;
        try {
            await fetch(`${API_URL}/users/history`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ mangaId, chapterNumber }),
            });
            // Update bookmark lastReadChapter locally to reflect progress immediately
            setBookmarks(prev =>
                prev.map((b) => {
                    if (b.manga && b.manga._id === mangaId) {
                        return {
                            ...b,
                            lastReadChapter: Math.max(b.lastReadChapter, chapterNumber)
                        };
                    }
                    return b;
                })
            );
        } catch (error) {
            console.error("Failed to record history:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                bookmarks,
                login,
                register,
                logout,
                toggleBookmark,
                addHistory,
                fetchBookmarks,
                isBookmarked,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
