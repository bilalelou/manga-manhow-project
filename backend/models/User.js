const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "اسم المستخدم مطلوب"],
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: [true, "البريد الإلكتروني مطلوب"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "كلمة المرور مطلوبة"],
            minlength: 6,
        },
        avatar: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            enum: ["user", "admin", "translator"],
            default: "user",
        },
        bookmarks: [
            {
                manga: { type: mongoose.Schema.Types.ObjectId, ref: "Manga" },
                lastReadChapter: { type: Number, default: 0 },
                addedAt: { type: Date, default: Date.now },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
