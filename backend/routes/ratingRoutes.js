const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");
const Manga = require("../models/Manga");
const { protect } = require("../middleware/authMiddleware");

// Helper function to update manga average rating
const updateMangaAverageRating = async (mangaId) => {
    try {
        const ratings = await Rating.find({ manga: mangaId });
        if (ratings.length === 0) {
            await Manga.findByIdAndUpdate(mangaId, { rating: 0 });
            return 0;
        }

        const sum = ratings.reduce((acc, rating) => acc + rating.value, 0);
        const average = Number((sum / ratings.length).toFixed(1));

        await Manga.findByIdAndUpdate(mangaId, { rating: average });
        return average;
    } catch (err) {
        console.error("Error updating manga average rating:", err);
    }
};

// @desc    Submit or update manga rating (1 to 10)
// @route   POST /api/ratings
// @access  Private
router.post("/", protect, async (req, res, next) => {
    try {
        const { mangaId, value } = req.body;

        if (!mangaId || value === undefined) {
            return res.status(400).json({
                status: "error",
                message: "يرجى توفير معرف المانجا وقيمة التقييم",
            });
        }

        const ratingVal = Number(value);
        if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 10) {
            return res.status(400).json({
                status: "error",
                message: "يجب أن تكون قيمة التقييم رقمًا بين 1 و 10",
            });
        }

        // Verify manga exists
        const manga = await Manga.findById(mangaId);
        if (!manga) {
            return res.status(404).json({
                status: "error",
                message: "المانجا غير موجودة",
            });
        }

        // Find existing rating or create one
        let rating = await Rating.findOne({ manga: mangaId, user: req.user._id });

        if (rating) {
            rating.value = ratingVal;
            await rating.save();
        } else {
            rating = await Rating.create({
                manga: mangaId,
                user: req.user._id,
                value: ratingVal,
            });
        }

        // Recalculate average and save to Manga model
        const newAverage = await updateMangaAverageRating(mangaId);

        res.status(200).json({
            status: "success",
            data: {
                rating,
                newAverage,
            },
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get current user's rating for a manga
// @route   GET /api/ratings/manga/:mangaId/me
// @access  Private
router.get("/manga/:mangaId/me", protect, async (req, res, next) => {
    try {
        const rating = await Rating.findOne({
            manga: req.params.mangaId,
            user: req.user._id,
        });

        res.status(200).json({
            status: "success",
            data: rating || null,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
