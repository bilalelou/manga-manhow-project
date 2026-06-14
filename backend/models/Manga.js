const mongoose = require("mongoose");

const mangaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "عنوان المانجا مطلوب"],
            trim: true,
        },
        titleAr: {
            type: String,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            default: "",
        },
        coverImage: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            enum: ["manga", "manhwa", "manhua"],
            default: "manga",
        },
        status: {
            type: String,
            enum: ["ongoing", "completed", "hiatus", "dropped"],
            default: "ongoing",
        },
        genres: [
            {
                type: String,
                trim: true,
            },
        ],
        author: {
            type: String,
            default: "غير معروف",
        },
        artist: {
            type: String,
            default: "",
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 10,
        },
        views: {
            type: Number,
            default: 0,
        },
        bookmarks: {
            type: Number,
            default: 0,
        },
        isHot: {
            type: Boolean,
            default: false,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search and sorting
mangaSchema.index({ title: "text", titleAr: "text", description: "text" });
mangaSchema.index({ views: -1 });
mangaSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Manga", mangaSchema);
