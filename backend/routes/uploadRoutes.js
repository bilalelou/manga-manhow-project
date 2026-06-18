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

// Allowed image extensions (validated by extension AND mimetype)
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const ALLOWED_MIMETYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Sanitize original filename to prevent path traversal
        const safeOriginalName = path.basename(file.originalname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(safeOriginalName).toLowerCase();
        cb(null, uniqueSuffix + ext);
    }
});

// Hardened File filter: check both mimetype AND file extension
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("الملف يجب أن يكون صورة فقط!"), false);
    }
    
    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
        return cb(new Error("صيغة الصورة غير مدعومة. الصيغ المسموحة: JPG, PNG, WebP, GIF"), false);
    }
    
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return cb(new Error("امتداد الملف غير مسموح. الامتدادات المسموحة: .jpg, .jpeg, .png, .webp, .gif"), false);
    }
    
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per image
});

// Multer error handling wrapper
const handleMulterError = (uploadFn) => {
    return (req, res, next) => {
        uploadFn(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // Multer-specific errors (file too large, too many files, etc.)
                let message = "حدث خطأ أثناء رفع الملف";
                if (err.code === "LIMIT_FILE_SIZE") {
                    message = "حجم الملف يتجاوز الحد المسموح (10MB)";
                } else if (err.code === "LIMIT_FILE_COUNT") {
                    message = "تم تجاوز عدد الملفات المسموح";
                } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
                    message = "اسم حقل الملف غير صحيح";
                }
                return res.status(400).json({ status: "error", message });
            } else if (err) {
                // Custom filter errors
                return res.status(400).json({ status: "error", message: err.message });
            }
            next();
        });
    };
};

// @desc Upload single image (e.g. manga cover)
// @route POST /api/upload/single
router.post("/single", protect, adminOrTranslator, handleMulterError(upload.single("image")), (req, res) => {
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
router.post("/multiple", protect, adminOrTranslator, handleMulterError(upload.array("images", 100)), (req, res) => {
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
