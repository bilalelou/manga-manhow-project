const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token, exclude password
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({
                    status: "error",
                    message: "المستخدم غير موجود أو تم حذفه"
                });
            }

            return next();
        } catch (error) {
            console.error("❌ Auth Error:", error.message);
            return res.status(401).json({
                status: "error",
                message: "غير مصرح بالدخول، التوكن غير صالح"
            });
        }
    }

    return res.status(401).json({
        status: "error",
        message: "غير مصرح بالدخول، لا يوجد توكن"
    });
};

// Middleware for admin authorization
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            status: "error",
            message: "غير مصرح، يتطلب صلاحيات مدير"
        });
    }
};

// Middleware for admin or translator authorization
const adminOrTranslator = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "translator")) {
        next();
    } else {
        res.status(403).json({
            status: "error",
            message: "غير مصرح، يتطلب صلاحيات مدير أو مترجم"
        });
    }
};

module.exports = { protect, admin, adminOrTranslator };
