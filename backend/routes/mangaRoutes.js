const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Manga = require("../models/Manga");
const Chapter = require("../models/Chapter");
const { mockMangas, mockChapters } = require("../data/mockData");
const { protect, adminOrTranslator } = require("../middleware/authMiddleware");

// @desc Get all mangas with optional filters
// @route GET /api/mangas
router.get("/", async (req, res) => {
    try {
        const isDbConnected = mongoose.connection.readyState === 1;
        const { featured, hot, type, limit, sort, q, genre, status, page } = req.query;

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

            const totalItems = data.length;
            const parsedLimit = limit ? parseInt(limit) : 4;
            const parsedPage = page ? parseInt(page) : 1;
            const skip = (parsedPage - 1) * parsedLimit;
            
            data = data.slice(skip, skip + parsedLimit);

            return res.status(200).json({ 
                status: "success", 
                count: data.length, 
                pagination: {
                    page: parsedPage,
                    limit: parsedLimit,
                    totalItems,
                    totalPages: Math.ceil(totalItems / parsedLimit)
                },
                data, 
                isFallback: true 
            });
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

        const totalItems = await Manga.countDocuments(query);
        const parsedLimit = limit ? parseInt(limit) : 4;
        const parsedPage = page ? parseInt(page) : 1;
        const skip = (parsedPage - 1) * parsedLimit;

        let mangaQuery = Manga.find(query);

        // Sorting
        if (sort === "views") {
            mangaQuery = mangaQuery.sort({ views: -1 });
        } else if (sort === "rating") {
            mangaQuery = mangaQuery.sort({ rating: -1 });
        } else {
            mangaQuery = mangaQuery.sort({ createdAt: -1 });
        }

        // Apply pagination limit and skip
        mangaQuery = mangaQuery.skip(skip).limit(parsedLimit);

        const mangas = await mangaQuery;
        res.status(200).json({ 
            status: "success", 
            count: mangas.length, 
            pagination: {
                page: parsedPage,
                limit: parsedLimit,
                totalItems,
                totalPages: Math.ceil(totalItems / parsedLimit)
            },
            data: mangas 
        });
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

// @desc Create a new manga
// @route POST /api/mangas
router.post("/", protect, adminOrTranslator, async (req, res) => {
    try {
        const { title, titleAr, description, coverImage, type, status, genres, author, artist, rating, isHot, isFeatured } = req.body;
        
        if (!title) {
            return res.status(400).json({ status: "error", message: "عنوان المانجا مطلوب" });
        }

        const slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const existingManga = await Manga.findOne({ slug });
        if (existingManga) {
            return res.status(400).json({ status: "error", message: "المانجا بهذا الاسم موجودة بالفعل" });
        }

        const manga = await Manga.create({
            title,
            titleAr,
            slug,
            description,
            coverImage,
            type,
            status,
            genres: Array.isArray(genres) ? genres : (genres ? genres.split(",").map(g => g.trim()).filter(Boolean) : []),
            author,
            artist,
            rating: Number(rating) || 0,
            isHot: !!isHot,
            isFeatured: !!isFeatured
        });

        res.status(201).json({ status: "success", data: manga });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// @desc Update a manga
// @route PUT /api/mangas/:id
router.put("/:id", protect, adminOrTranslator, async (req, res) => {
    try {
        const { title, titleAr, description, coverImage, type, status, genres, author, artist, rating, isHot, isFeatured } = req.body;
        const manga = await Manga.findById(req.params.id);

        if (!manga) {
            return res.status(404).json({ status: "error", message: "المانجا غير موجودة" });
        }

        manga.title = title || manga.title;
        manga.titleAr = titleAr !== undefined ? titleAr : manga.titleAr;
        manga.description = description !== undefined ? description : manga.description;
        manga.coverImage = coverImage !== undefined ? coverImage : manga.coverImage;
        manga.type = type || manga.type;
        manga.status = status || manga.status;
        if (genres !== undefined) {
            manga.genres = Array.isArray(genres) ? genres : (genres ? genres.split(",").map(g => g.trim()).filter(Boolean) : []);
        }
        manga.author = author !== undefined ? author : manga.author;
        manga.artist = artist !== undefined ? artist : manga.artist;
        manga.rating = rating !== undefined ? Number(rating) || 0 : manga.rating;
        manga.isHot = isHot !== undefined ? !!isHot : manga.isHot;
        manga.isFeatured = isFeatured !== undefined ? !!isFeatured : manga.isFeatured;

        // Recalculate slug if title changed
        if (title && title !== manga.title) {
            const newSlug = title.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            const existingManga = await Manga.findOne({ slug: newSlug, _id: { $ne: manga._id } });
            if (existingManga) {
                return res.status(400).json({ status: "error", message: "المانجا بهذا الاسم موجودة بالفعل" });
            }
            manga.slug = newSlug;
        }

        await manga.save();
        res.status(200).json({ status: "success", data: manga });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// @desc Delete a manga and its chapters
// @route DELETE /api/mangas/:id
router.delete("/:id", protect, adminOrTranslator, async (req, res) => {
    try {
        const mangaId = req.params.id;
        const manga = await Manga.findById(mangaId);

        if (!manga) {
            return res.status(404).json({ status: "error", message: "المانجا غير موجودة" });
        }

        // Delete all chapters associated with this manga
        await Chapter.deleteMany({ manga: mangaId });

        // Delete the manga itself
        await Manga.findByIdAndDelete(mangaId);

        res.status(200).json({ status: "success", message: "تم حذف العمل وكافة الفصول التابعة له بنجاح" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

module.exports = router;
