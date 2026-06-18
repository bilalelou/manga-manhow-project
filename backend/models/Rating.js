const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
    {
        manga: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Manga",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        value: {
            type: Number,
            required: [true, "قيمة التقييم مطلوبة"],
            min: [1, "الحد الأدنى للتقييم هو 1"],
            max: [10, "الحد الأقصى للتقييم هو 10"],
        },
    },
    {
        timestamps: true,
    }
);

// Ensure a user can only rate a manga once
ratingSchema.index({ manga: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
