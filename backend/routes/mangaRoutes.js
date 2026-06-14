const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Manga = require("../models/Manga");
const Chapter = require("../models/Chapter");
const { mockMangas, mockChapters } = require("../data/mockData");

// @desc Get all mangas with optional filters
// @route GET /api/mangas
router.get("/", async (req, res) => {
    try {
        const isDbConnected = mongoose.connection.readyState === 1;
        const { featured, hot, type, limit, sort, q, genre, status } = req.query;

        if (!isDbConnected) {
            console.log("⚠️ DB disconnected, serving mock mangas.");
            let data = [...mockMangas];
            
            if (featured) data = data.filter(m => m.isFeatured === (featured === "true"));
            if (hot) data = data.filter(m => m.isHot === (hot === "true"));
            if (type) data = data.filter(m => m.type === type);
            if (status) data = data.filter(m => m.status === status);
            if (genre) data = data.filter(m => m.genres && m.genres.includes(genre));
            if (q) {
                const queryLower = q.toLowerCase();
                data = data.filter(m => 
                    m.title.toLowerCase().includes(queryLower) || 
                    (m.titleAr && m.titleAr.toLowerCase().includes(queryLower)) || 
                    (m.description && m.description.toLowerCase().includes(queryLower))
                );
            }

            if (sort === "views") {
                data.sort((a, b) => b.views - a.views);
            } else if (sort === "rating") {
                data.sort((a, b) => b.rating - a.rating);
            } else {
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }

            if (limit) {
                data = data.slice(0, parseInt(limit));
            }

            return res.status(200).json({ status: "success", count: data.length, data, isFallback: true });
        }

        let query = {};
        if (featured) query.isFeatured = featured === "true";
        if (hot) query.isHot = hot === "true";
        if (type) query.type = type;
        if (status) query.status = status;
        if (genre) query.genres = genre;
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: "i" } },
                { titleAr: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } }
            ];
        }

        let mangaQuery = Manga.find(query);

        // Sorting
        if (sort === "views") {
            mangaQuery = mangaQuery.sort({ views: -1 });
        } else if (sort === "rating") {
            mangaQuery = mangaQuery.sort({ rating: -1 });
        } else {
            mangaQuery = mangaQuery.sort({ createdAt: -1 });
        }

        // Limit
        if (limit) {
            mangaQuery = mangaQuery.limit(parseInt(limit));
        }

        const mangas = await mangaQuery;
        res.status(200).json({ status: "success", count: mangas.length, data: mangas });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// @desc Get single manga by slug with its chapters
// @route GET /api/mangas/:slug
router.get("/:slug", async (req, res) => {
    try {
        const isDbConnected = mongoose.connection.readyState === 1;
        const targetSlug = req.params.slug.toLowerCase();

        if (!isDbConnected) {
            console.log(`⚠️ DB disconnected, serving mock manga for ${targetSlug}.`);
            const manga = mockMangas.find(m => m.slug === targetSlug);
            if (!manga) {
                return res.status(404).json({ status: "error", message: "المانجا غير موجودة" });
            }

            const chapters = mockChapters[manga._id] || [];
            return res.status(200).json({
                status: "success",
                data: {
                    manga,
                    chapters: [...chapters].sort((a, b) => b.chapterNumber - a.chapterNumber)
                },
                isFallback: true
            });
        }

        const manga = await Manga.findOne({ slug: targetSlug });
        if (!manga) {
            return res.status(404).json({ status: "error", message: "المانجا غير موجودة" });
        }

        // Increment views
        manga.views += 1;
        await manga.save();

        // Fetch chapters sorted by chapter number descending
        const chapters = await Chapter.find({ manga: manga._id })
            .select("chapterNumber title views createdAt")
            .sort({ chapterNumber: -1 });

        res.status(200).json({
            status: "success",
            data: {
                manga,
                chapters
            }
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
