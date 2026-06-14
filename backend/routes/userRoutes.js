const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Manga = require("../models/Manga");
const { protect, admin } = require("../middleware/authMiddleware");

// @desc    Get user bookmarks
// @route   GET /api/users/bookmarks
// @access  Private
router.get("/bookmarks", protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: "bookmarks.manga",
            select: "title titleAr slug coverImage type status rating"
        });

        res.status(200).json({
            status: "success",
            data: user.bookmarks
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Toggle bookmark for a manga
// @route   POST /api/users/bookmarks/toggle
// @access  Private
router.post("/bookmarks/toggle", protect, async (req, res, next) => {
    try {
        const { mangaId } = req.body;

        if (!mangaId) {
            return res.status(400).json({
                status: "error",
                message: "معرف المانجا مطلوب"
            });
        }

        // Verify manga exists
        const manga = await Manga.findById(mangaId);
        if (!manga) {
            return res.status(404).json({
                status: "error",
                message: "المانجا غير موجودة"
            });
        }

        const user = await User.findById(req.user._id);

        // Check if already bookmarked
        const bookmarkIndex = user.bookmarks.findIndex(
            (b) => b.manga.toString() === mangaId
        );

        let isBookmarked = false;

        if (bookmarkIndex > -1) {
            // Remove from bookmarks
            user.bookmarks.splice(bookmarkIndex, 1);
        } else {
            // Add to bookmarks
            user.bookmarks.push({ manga: mangaId, lastReadChapter: 0 });
            isBookmarked = true;
        }

        await user.save();

        res.status(200).json({
            status: "success",
            data: {
                isBookmarked,
                bookmarksCount: user.bookmarks.length
            }
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Add reading history & update bookmark lastReadChapter
// @route   POST /api/users/history
// @access  Private
router.post("/history", protect, async (req, res, next) => {
    try {
        const { mangaId, chapterNumber } = req.body;

        if (!mangaId || chapterNumber === undefined) {
            return res.status(400).json({
                status: "error",
                message: "معرف المانجا ورقم الفصل مطلوبان"
            });
        }

        const user = await User.findById(req.user._id);

        // 1. Add to history array (limit history size to e.g. 50 items to save space, remove oldest)
        // Check if exact same entry (same manga and chapter) already exists in history, remove it first to move it to the top
        user.history = user.history.filter(
            (h) => !(h.manga.toString() === mangaId && h.chapterNumber === Number(chapterNumber))
        );

        // Add to the beginning of the history
        user.history.unshift({
            manga: mangaId,
            chapterNumber: Number(chapterNumber),
            readAt: Date.now()
        });

        // Slice history to max 50 items
        if (user.history.length > 50) {
            user.history = user.history.slice(0, 50);
        }

        // 2. Update lastReadChapter if this manga is bookmarked
        const bookmark = user.bookmarks.find(
            (b) => b.manga.toString() === mangaId
        );
        if (bookmark) {
            // Only update if the newly read chapter is greater or we just track progress
            if (Number(chapterNumber) > bookmark.lastReadChapter) {
                bookmark.lastReadChapter = Number(chapterNumber);
            }
        }

        await user.save();

        res.status(200).json({
            status: "success",
            message: "تم تحديث سجل القراءة بنجاح"
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get user reading history
// @route   GET /api/users/history
// @access  Private
router.get("/history", protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: "history.manga",
            select: "title titleAr slug coverImage type"
        });

        res.status(200).json({
            status: "success",
            data: user.history
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get all users list
// @route   GET /api/users
// @access  Private/Admin
router.get("/", protect, admin, async (req, res, next) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        res.status(200).json({
            status: "success",
            data: users
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
router.put("/:id/role", protect, admin, async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!["user", "admin", "translator"].includes(role)) {
            return res.status(400).json({
                status: "error",
                message: "نوع الحساب غير صالح"
            });
        }

        const targetUser = await User.findById(req.params.id);
        if (!targetUser) {
            return res.status(404).json({
                status: "error",
                message: "المستخدم غير موجود"
            });
        }

        // Prevent self demotion
        if (targetUser._id.toString() === req.user._id.toString() && role !== "admin") {
            return res.status(400).json({
                status: "error",
                message: "لا يمكنك سحب صلاحيات المسؤول من حسابك الخاص بنفسك"
            });
        }

        targetUser.role = role;
        await targetUser.save();

        res.status(200).json({
            status: "success",
            data: {
                _id: targetUser._id,
                username: targetUser.username,
                email: targetUser.email,
                role: targetUser.role
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
