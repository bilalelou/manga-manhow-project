const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Manga = require("../models/Manga");
const { protect } = require("../middleware/authMiddleware");

// Auto-hide threshold: if a comment gets this many reports, hide it
const REPORT_HIDE_THRESHOLD = 3;

// @desc    Get comments for a chapter (root comments + their replies)
// @route   GET /api/comments/manga/:mangaId/chapter/:chapterNumber
// @access  Public
router.get("/manga/:mangaId/chapter/:chapterNumber", async (req, res, next) => {
    try {
        const { mangaId, chapterNumber } = req.params;
        const { sort } = req.query; // "newest" (default) or "likes"

        // Build sort criteria
        let sortCriteria;
        if (sort === "likes") {
            // We can't sort by virtual directly; we'll sort in-memory
            sortCriteria = { createdAt: -1 };
        } else {
            sortCriteria = { createdAt: -1 };
        }

        // Fetch root comments (no parent)
        const rootComments = await Comment.find({
            manga: mangaId,
            chapterNumber: Number(chapterNumber),
            parentComment: null,
        })
            .populate("user", "username avatar role")
            .sort(sortCriteria)
            .lean();

        // Fetch all replies for this chapter
        const replies = await Comment.find({
            manga: mangaId,
            chapterNumber: Number(chapterNumber),
            parentComment: { $ne: null },
        })
            .populate("user", "username avatar role")
            .sort({ createdAt: 1 }) // replies oldest first
            .lean();

        // Build a map of parentId -> replies
        const repliesMap = {};
        for (const reply of replies) {
            const parentId = reply.parentComment.toString();
            if (!repliesMap[parentId]) {
                repliesMap[parentId] = [];
            }
            repliesMap[parentId].push(reply);
        }

        // Attach replies to their parent comments
        let commentsWithReplies = rootComments.map((comment) => ({
            ...comment,
            replies: repliesMap[comment._id.toString()] || [],
        }));

        // Sort by likes if requested (sort root comments by likes count descending)
        if (sort === "likes") {
            commentsWithReplies.sort(
                (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
            );
        }

        res.status(200).json({
            status: "success",
            results: commentsWithReplies.length,
            data: commentsWithReplies,
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Create a root comment
// @route   POST /api/comments
// @access  Private
router.post("/", protect, async (req, res, next) => {
    try {
        const { mangaId, chapterNumber, content } = req.body;

        if (!mangaId || chapterNumber === undefined || !content) {
            return res.status(400).json({
                status: "error",
                message: "يرجى توفير معرف المانجا، رقم الفصل، ومحتوى التعليق",
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

        const comment = await Comment.create({
            manga: mangaId,
            chapterNumber: Number(chapterNumber),
            user: req.user._id,
            content,
            parentComment: null,
        });

        const populatedComment = await Comment.findById(comment._id).populate(
            "user",
            "username avatar role"
        );

        res.status(201).json({
            status: "success",
            data: populatedComment,
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Reply to a comment (one level deep only)
// @route   POST /api/comments/:id/reply
// @access  Private
router.post("/:id/reply", protect, async (req, res, next) => {
    try {
        const { content } = req.body;
        const parentId = req.params.id;

        if (!content || !content.trim()) {
            return res.status(400).json({
                status: "error",
                message: "محتوى الرد مطلوب",
            });
        }

        // Find parent comment
        const parentComment = await Comment.findById(parentId);
        if (!parentComment) {
            return res.status(404).json({
                status: "error",
                message: "التعليق الأصلي غير موجود",
            });
        }

        // Prevent nested replies beyond one level: if parent is itself a reply, attach to its parent
        const actualParentId = parentComment.parentComment
            ? parentComment.parentComment
            : parentComment._id;

        const reply = await Comment.create({
            manga: parentComment.manga,
            chapterNumber: parentComment.chapterNumber,
            user: req.user._id,
            content: content.trim(),
            parentComment: actualParentId,
        });

        const populatedReply = await Comment.findById(reply._id).populate(
            "user",
            "username avatar role"
        );

        res.status(201).json({
            status: "success",
            data: populatedReply,
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Toggle like on a comment
// @route   POST /api/comments/:id/like
// @access  Private
router.post("/:id/like", protect, async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({
                status: "error",
                message: "التعليق غير موجود",
            });
        }

        const userId = req.user._id.toString();
        const likeIndex = comment.likes.findIndex(
            (id) => id.toString() === userId
        );

        if (likeIndex > -1) {
            // Already liked → remove like (toggle off)
            comment.likes.splice(likeIndex, 1);
        } else {
            // Add like
            comment.likes.push(req.user._id);
            // Remove dislike if it exists (mutual exclusion)
            const dislikeIndex = comment.dislikes.findIndex(
                (id) => id.toString() === userId
            );
            if (dislikeIndex > -1) {
                comment.dislikes.splice(dislikeIndex, 1);
            }
        }

        await comment.save();

        res.status(200).json({
            status: "success",
            data: {
                likes: comment.likes,
                dislikes: comment.dislikes,
                likesCount: comment.likes.length,
                dislikesCount: comment.dislikes.length,
            },
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Toggle dislike on a comment
// @route   POST /api/comments/:id/dislike
// @access  Private
router.post("/:id/dislike", protect, async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({
                status: "error",
                message: "التعليق غير موجود",
            });
        }

        const userId = req.user._id.toString();
        const dislikeIndex = comment.dislikes.findIndex(
            (id) => id.toString() === userId
        );

        if (dislikeIndex > -1) {
            // Already disliked → remove dislike (toggle off)
            comment.dislikes.splice(dislikeIndex, 1);
        } else {
            // Add dislike
            comment.dislikes.push(req.user._id);
            // Remove like if it exists (mutual exclusion)
            const likeIndex = comment.likes.findIndex(
                (id) => id.toString() === userId
            );
            if (likeIndex > -1) {
                comment.likes.splice(likeIndex, 1);
            }
        }

        await comment.save();

        res.status(200).json({
            status: "success",
            data: {
                likes: comment.likes,
                dislikes: comment.dislikes,
                likesCount: comment.likes.length,
                dislikesCount: comment.dislikes.length,
            },
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Report a comment
// @route   POST /api/comments/:id/report
// @access  Private
router.post("/:id/report", protect, async (req, res, next) => {
    try {
        const { reason } = req.body;
        const validReasons = ["spam", "offensive", "spoiler", "harassment", "other"];

        if (!reason || !validReasons.includes(reason)) {
            return res.status(400).json({
                status: "error",
                message: "يرجى اختيار سبب صالح للإبلاغ",
            });
        }

        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({
                status: "error",
                message: "التعليق غير موجود",
            });
        }

        // Check if user already reported this comment
        const alreadyReported = comment.reports.some(
            (r) => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReported) {
            return res.status(400).json({
                status: "error",
                message: "لقد قمت بالإبلاغ عن هذا التعليق مسبقاً",
            });
        }

        // Add report
        comment.reports.push({
            user: req.user._id,
            reason,
        });

        // Auto-hide if threshold reached
        if (comment.reports.length >= REPORT_HIDE_THRESHOLD) {
            comment.isHidden = true;
        }

        await comment.save();

        res.status(200).json({
            status: "success",
            message: "تم الإبلاغ عن التعليق بنجاح. شكراً لمساعدتنا في الحفاظ على بيئة آمنة.",
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Delete a comment (and its replies)
// @route   DELETE /api/comments/:id
// @access  Private
router.delete("/:id", protect, async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                status: "error",
                message: "التعليق غير موجود",
            });
        }

        // Check if user is owner of the comment OR has admin/translator roles
        const isOwner = comment.user.toString() === req.user._id.toString();
        const isAuthorizedStaff =
            req.user.role === "admin" || req.user.role === "translator";

        if (!isOwner && !isAuthorizedStaff) {
            return res.status(403).json({
                status: "error",
                message: "غير مصرح لك بحذف هذا التعليق",
            });
        }

        // If it's a root comment, also delete all its replies
        if (!comment.parentComment) {
            await Comment.deleteMany({ parentComment: comment._id });
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "success",
            message: "تم حذف التعليق بنجاح",
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
