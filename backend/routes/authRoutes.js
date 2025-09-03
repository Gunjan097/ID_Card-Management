import express from "express";
import { superAdminSignup, superAdminLogin, createAdmin, adminLogin, schoolLogin } from "../controllers/authController.js";
import { protect, superAdminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Super Admin Routes
router.post("/superadmin-signup", superAdminSignup);
router.post("/superadmin-login", superAdminLogin);
router.post("/create-admin", protect, superAdminOnly, createAdmin);

// Admin Login
router.post("/admin-login", adminLogin);

// School Login
router.post("/schoolLogin", schoolLogin);

export default router;
