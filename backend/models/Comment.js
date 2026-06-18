const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        manga: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Manga",
            required: true,
        },
        chapterNumber: {
            type: Number,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: [true, "محتوى التعليق مطلوب"],
            trim: true,
            maxlength: [1000, "لا يمكن للتعليق أن يتجاوز 1000 حرف"],
        },
        // Nested replies: null = root comment, ObjectId = reply to that comment
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        // Like/Dislike system: arrays of user IDs for toggle behavior
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        dislikes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        // Report system
        reports: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                reason: {
                    type: String,
                    enum: [
                        "spam",
                        "offensive",
                        "spoiler",
                        "harassment",
                        "other",
                    ],
                    required: true,
                },
                reportedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        // Hidden by moderation (auto-hide after X reports or manual)
        isHidden: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual: count of likes
commentSchema.virtual("likesCount").get(function () {
    return this.likes ? this.likes.length : 0;
});

// Virtual: count of dislikes
commentSchema.virtual("dislikesCount").get(function () {
    return this.dislikes ? this.dislikes.length : 0;
});

// Virtual: count of reports
commentSchema.virtual("reportsCount").get(function () {
    return this.reports ? this.reports.length : 0;
});

// Indexes for fast querying
commentSchema.index({ manga: 1, chapterNumber: 1, parentComment: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

module.exports = mongoose.model("Comment", commentSchema);
