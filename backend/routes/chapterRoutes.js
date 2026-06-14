const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Chapter = require("../models/Chapter");
const Manga = require("../models/Manga");
const { mockMangas, mockChapters } = require("../data/mockData");

// @desc Get chapter by manga slug and chapter number
// @route GET /api/chapters/:mangaSlug/:chapterNumber
router.get("/:mangaSlug/:chapterNumber", async (req, res) => {
    try {
        const isDbConnected = mongoose.connection.readyState === 1;
        const targetSlug = req.params.mangaSlug.toLowerCase();
        const chNumber = parseInt(req.params.chapterNumber);

        if (!isDbConnected) {
            console.log(`⚠️ DB disconnected, serving mock chapter ${chNumber} for ${targetSlug}.`);
            const manga = mockMangas.find(m => m.slug === targetSlug);
            if (!manga) {
                return res.status(404).json({ status: "error", message: "المانجا غير موجودة" });
            }

            const chapters = mockChapters[manga._id] || [];
            const chapter = chapters.find(c => c.chapterNumber === chNumber);

            if (!chapter) {
                return res.status(404).json({ status: "error", message: "الفصل غير موجود" });
            }

            return res.status(200).json({
                status: "success",
                data: chapter,
                isFallback: true
            });
        }

        const manga = await Manga.findOne({ slug: targetSlug });
        if (!manga) {
            return res.status(404).json({ status: "error", message: "المانجا غير موجودة" });
        }

        const chapter = await Chapter.findOne({
            manga: manga._id,
            chapterNumber: chNumber
        });

        if (!chapter) {
            return res.status(404).json({ status: "error", message: "الفصل غير موجود" });
        }

        // Increment views
        chapter.views += 1;
        await chapter.save();

        res.status(200).json({
            status: "success",
            data: chapter
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
