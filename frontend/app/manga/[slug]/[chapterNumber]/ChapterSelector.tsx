"use client";

import React from "react";
import { useRouter } from "next/navigation";
import styles from "./chapterReader.module.css";

interface ChapterOption {
    chapterNumber: number;
    title: string;
}

interface ChapterSelectorProps {
    slug: string;
    chapters: ChapterOption[];
    currentChapterNumber: number;
}

export default function ChapterSelector({
    slug,
    chapters,
    currentChapterNumber,
}: ChapterSelectorProps) {
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedChapter = e.target.value;
        if (selectedChapter) {
            router.push(`/manga/${slug}/${selectedChapter}`);
        }
    };

    // Sort chapters descending for the dropdown list so newest chapters are at the top
    const sortedOptions = [...chapters].sort((a, b) => b.chapterNumber - a.chapterNumber);

    return (
        <div className={styles.chapterSelectWrapper}>
            <select
                className={styles.chapterSelect}
                value={currentChapterNumber}
                onChange={handleChange}
                id="chapter-dropdown-selector"
            >
                {sortedOptions.map((ch) => (
                    <option key={ch.chapterNumber} value={ch.chapterNumber}>
                        الفصل {ch.chapterNumber} {ch.title ? `: ${ch.title.split(":")[1] || ch.title}` : ""}
                    </option>
                ))}
            </select>
            <span className={styles.selectArrow}>▼</span>
        </div>
    );
}
