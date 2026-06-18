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

        const isDbConnected = mongoose.connection.readyState === 1;
        if (!isDbConnected) {
            const manga = mockMangas.find(m => m._id === mangaId || m.slug === mangaId);
            if (!manga) {
                return res.status(404).json({ status: "error", message: "المانجا غير موجودة في نمط المحاكاة" });
            }

            if (!mockChapters[manga._id]) {
                mockChapters[manga._id] = [];
            }

            const existing = mockChapters[manga._id].find(c => c.chapterNumber === Number(chapterNumber));
            if (existing) {
                return res.status(400).json({ status: "error", message: `الفصل رقم ${chapterNumber} موجود بالفعل لهذا العمل` });
            }

            let formattedPages = [];
            if (Array.isArray(pages)) {
                formattedPages = pages.map((p, index) => ({
                    pageNumber: index + 1,
                    imageUrl: typeof p === "string" ? p : p.imageUrl
                }));
            }

            const newChapter = {
                _id: "mock-chapter-id-" + Math.random().toString(36).substring(2, 11),
                manga: manga._id,
                chapterNumber: Number(chapterNumber),
                title: title || "",
                pages: formattedPages,
                views: 0,
                createdAt: new Date().toISOString()
            };

            mockChapters[manga._id].push(newChapter);
            return res.status(201).json({ status: "success", data: newChapter });
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

// @desc Create multiple chapters
// @route POST /api/chapters/bulk
router.post("/bulk", protect, adminOrTranslator, async (req, res) => {
    try {
        const { mangaId, chapters } = req.body;

        if (!mangaId || !Array.isArray(chapters) || chapters.length === 0) {
            return res.status(400).json({ status: "error", message: "معرف المانجا وقائمة الفصول مطلوبة" });
        }

        const isDbConnected = mongoose.connection.readyState === 1;
        if (!isDbConnected) {
            const manga = mockMangas.find(m => m._id === mangaId || m.slug === mangaId);
            if (!manga) {
                return res.status(404).json({ status: "error", message: "المانجا غير موجودة في نمط المحاكاة" });
            }

            if (!mockChapters[manga._id]) {
                mockChapters[manga._id] = [];
            }

            const results = [];
            const errors = [];

            for (const chap of chapters) {
                const { chapterNumber, title, pages } = chap;

                if (chapterNumber === undefined || isNaN(Number(chapterNumber))) {
                    errors.push({ chapterNumber, message: "رقم الفصل غير صالح أو غير موجود" });
                    continue;
                }

                const chNum = Number(chapterNumber);

                const existingChapter = mockChapters[manga._id].find(c => c.chapterNumber === chNum);
                if (existingChapter) {
                    errors.push({ chapterNumber: chNum, message: `الفصل رقم ${chNum} موجود بالفعل لهذا العمل` });
                    continue;
                }

                let formattedPages = [];
                if (Array.isArray(pages)) {
                    formattedPages = pages.map((page, index) => ({
                        pageNumber: index + 1,
                        imageUrl: typeof page === "string" ? page : page.imageUrl
                    }));
                }

                const newChapter = {
                    _id: "mock-chapter-id-" + Math.random().toString(36).substring(2, 11),
                    manga: manga._id,
                    chapterNumber: chNum,
                    title: title || "",
                    pages: formattedPages,
                    views: 0,
                    createdAt: new Date().toISOString()
                };

                mockChapters[manga._id].push(newChapter);
                results.push(newChapter);
            }

            return res.status(201).json({ 
                status: "success", 
                message: `تمت إضافة ${results.length} فصول بنجاح.`,
                addedCount: results.length,
                addedChapters: results.map(r => r.chapterNumber),
                errors 
            });
        }

        const manga = await Manga.findById(mangaId);
        if (!manga) {
            return res.status(404).json({ status: "error", message: "المانجا غير موجودة" });
        }

        const results = [];
        const errors = [];

        for (const chap of chapters) {
            const { chapterNumber, title, pages } = chap;

            if (chapterNumber === undefined || isNaN(Number(chapterNumber))) {
                errors.push({ chapterNumber, message: "رقم الفصل غير صالح أو غير موجود" });
                continue;
            }

            const chNum = Number(chapterNumber);

            // Check if chapter already exists for this manga
            const existingChapter = await Chapter.findOne({ manga: mangaId, chapterNumber: chNum });
            if (existingChapter) {
                errors.push({ chapterNumber: chNum, message: `الفصل رقم ${chNum} موجود بالفعل لهذا العمل` });
                continue;
            }

            // Format pages array
            let formattedPages = [];
            if (Array.isArray(pages)) {
                formattedPages = pages.map((page, index) => ({
                    pageNumber: index + 1,
                    imageUrl: typeof page === "string" ? page : page.imageUrl
                }));
            }

            const chapter = await Chapter.create({
                manga: mangaId,
                chapterNumber: chNum,
                title: title || "",
                pages: formattedPages
            });

            results.push(chapter);
        }

        res.status(201).json({ 
            status: "success", 
            message: `تمت إضافة ${results.length} فصول بنجاح.`,
            addedCount: results.length,
            addedChapters: results.map(r => r.chapterNumber),
            errors 
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// @desc Delete a chapter
// @route DELETE /api/chapters/:id
router.delete("/:id", protect, adminOrTranslator, async (req, res) => {
    try {
        const isDbConnected = mongoose.connection.readyState === 1;
        if (!isDbConnected) {
            const chapId = req.params.id;
            let found = false;
            for (const mangaId in mockChapters) {
                const idx = mockChapters[mangaId].findIndex(c => c._id === chapId);
                if (idx !== -1) {
                    mockChapters[mangaId].splice(idx, 1);
                    found = true;
                    break;
                }
            }
            if (!found) {
                return res.status(404).json({ status: "error", message: "الفصل غير موجود في نمط المحاكاة" });
            }
            return res.status(200).json({ status: "success", message: "تم حذف الفصل بنجاح" });
        }

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
