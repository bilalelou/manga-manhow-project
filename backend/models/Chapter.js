const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
    {
        manga: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Manga",
            required: true,
        },
        chapterNumber: {
            type: Number,
            required: [true, "رقم الفصل مطلوب"],
        },
        title: {
            type: String,
            default: "",
        },
        pages: [
            {
                pageNumber: { type: Number, required: true },
                imageUrl: { type: String, required: true },
            },
        ],
        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure unique chapter number per manga
chapterSchema.index({ manga: 1, chapterNumber: 1 }, { unique: true });
chapterSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Chapter", chapterSchema);
