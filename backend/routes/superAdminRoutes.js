// routes/superAdminRoutes.js
import express from "express";
import {
  getAllAdmins,
  deleteAdmin,
  getAllSchools,
  deleteSchool,
  superAdminChangePassword
} from "../controllers/superAdminController.js";

import { protect, superAdminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Must be authenticated and super admin
router.get("/admins", protect, superAdminOnly, getAllAdmins);
router.delete("/admin/:id", protect, superAdminOnly, deleteAdmin);

router.get("/schools", protect, superAdminOnly, getAllSchools);
router.delete("/school/:id", protect, superAdminOnly, deleteSchool);
router.put("/change-password", protect, superAdminOnly, superAdminChangePassword);
export default router;
