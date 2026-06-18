const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// Helper to generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "يرجى إدخال جميع الحقول المطلوبة"
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({
                status: "error",
                message: "البريد الإلكتروني أو اسم المستخدم مسجل بالفعل"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user (defaults to role: "user")
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                status: "success",
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(400).json({
                status: "error",
                message: "بيانات المستخدم غير صالحة"
            });
        }
    } catch (error) {
        next(error);
    }
});

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "يرجى إدخال البريد الإلكتروني وكلمة المرور"
            });
        }

        const mongoose = require("mongoose");
        const isDbConnected = mongoose.connection.readyState === 1;

        if (!isDbConnected) {
            if (email === "admin@mangaverse.com" && password === "password123") {
                return res.status(200).json({
                    status: "success",
                    data: {
                        _id: "mock-admin-id",
                        username: "admin",
                        email: "admin@mangaverse.com",
                        role: "admin",
                        token: generateToken("mock-admin-id")
                    }
                });
            } else {
                return res.status(401).json({
                    status: "error",
                    message: "الحساب غير مسجل في نمط المحاكاة (استخدم البريد الإلكتروني admin@mangaverse.com والرقم السري password123)"
                });
            }
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                status: "success",
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401).json({
                status: "error",
                message: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
            });
        }
    } catch (error) {
        next(error);
    }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req, res, next) => {
    try {
        res.status(200).json({
            status: "success",
            data: req.user
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
