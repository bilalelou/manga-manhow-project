const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Chapter = require("../models/Chapter");
const Manga = require("../models/Manga");
const { mockMangas, mockChapters } = require("../data/mockData");
const { protect, adminOrTranslator } = require("../middleware/authMiddleware");

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

// @desc Create a new chapter
// @route POST /api/chapters
router.post("/", protect, adminOrTranslator, async (req, res) => {
    try {
        const { mangaId, chapterNumber, title, pages } = req.body;

        if (!mangaId || chapterNumber === undefined) {
            return res.status(400).json({ status: "error", message: "معرف المانجا ورقم الفصل مطلوبان" });
        }

        const manga = await Manga.findById(mangaId);
        if (!manga) {
            return res.status(404).json({ status: "error", message: "المانجا غير موجودة" });
        }

        // Check if chapter already exists for this manga
        const existingChapter = await Chapter.findOne({ manga: mangaId, chapterNumber });
        if (existingChapter) {
            return res.status(400).json({ status: "error", message: `الفصل رقم ${chapterNumber} موجود بالفعل لهذا العمل` });
        }

        // Format pages array
        let formattedPages = [];
        if (Array.isArray(pages)) {
            formattedPages = pages.map((page, index) => ({
                pageNumber: Number(page.pageNumber) || index + 1,
                imageUrl: typeof page === "string" ? page : page.imageUrl
            }));
        }

        const chapter = await Chapter.create({
            manga: mangaId,
            chapterNumber: Number(chapterNumber),
            title: title || "",
            pages: formattedPages
        });

        res.status(201).json({ status: "success", data: chapter });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// @desc Delete a chapter
// @route DELETE /api/chapters/:id
router.delete("/:id", protect, adminOrTranslator, async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (!chapter) {
            return res.status(404).json({ status: "error", message: "الفصل غير موجود" });
        }

        await Chapter.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: "success", message: "تم حذف الفصل بنجاح" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
