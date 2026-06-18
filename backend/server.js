const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

const path = require("path");

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Security: HTTP Headers Protection
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Performance: Gzip Compression
app.use(compression());

// Rate Limiting: General API (100 requests per 15 minutes per IP)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: "error",
        message: "تم تجاوز عدد الطلبات المسموح بها. يرجى المحاولة لاحقاً."
    }
});

// Rate Limiting: Auth routes (5 attempts per 15 minutes per IP)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: "error",
        message: "تم تجاوز عدد محاولات تسجيل الدخول. يرجى المحاولة بعد 15 دقيقة."
    }
});

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploaded Files
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Mount Routes with Rate Limiting
app.use("/api", generalLimiter);
app.use("/api/auth", authLimiter);

app.use("/api/mangas", require("./routes/mangaRoutes"));
app.use("/api/chapters", require("./routes/chapterRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/ratings", require("./routes/ratingRoutes"));

// Test health route
app.get("/api/health", (req, res) => {
    const mongoose = require("mongoose");
    res.status(200).json({
        status: "success",
        message: "Server is healthy and running",
        timestamp: new Date(),
        environment: process.env.NODE_ENV,
        database: {
            status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
            readyState: mongoose.connection.readyState
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`❌ Error: ${err.message}`);
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Internal Server Error"
    });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`❌ Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
