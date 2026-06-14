const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect, adminOrTranslator } = require("../middleware/authMiddleware");

// Ensure upload folder exists
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("الملف يجب أن يكون صورة فقط!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per image
});

// @desc Upload single image (e.g. manga cover)
// @route POST /api/upload/single
router.post("/single", protect, adminOrTranslator, upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: "error", message: "يرجى اختيار ملف صورة للرفع" });
        }
        // Returns relative URL to serve locally
        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ status: "success", url: fileUrl });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// @desc Upload multiple images (e.g. chapter pages)
// @route POST /api/upload/multiple
router.post("/multiple", protect, adminOrTranslator, upload.array("images", 100), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ status: "error", message: "يرجى اختيار صور للرفع" });
        }
        // Sort files by original name so they are ordered page 1, page 2...
        const sortedFiles = [...req.files].sort((a, b) => a.originalname.localeCompare(b.originalname, undefined, { numeric: true, sensitivity: 'base' }));
        
        const fileUrls = sortedFiles.map(file => `/uploads/${file.filename}`);
        res.status(200).json({ status: "success", urls: fileUrls });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

module.exports = router;
