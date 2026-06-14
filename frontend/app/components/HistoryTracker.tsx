"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface HistoryTrackerProps {
    mangaId: string;
    chapterNumber: number;
}

export default function HistoryTracker({ mangaId, chapterNumber }: HistoryTrackerProps) {
    const { addHistory, user } = useAuth();

    useEffect(() => {
        if (user) {
            addHistory(mangaId, chapterNumber);
        }
    }, [mangaId, chapterNumber, user]);

    return null; // Renders nothing, just executes the hook
}
