import express from "express";
import { createSchool, getAllSchools, deleteSchool , changeSchoolPassword } from "../controllers/schoolController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { checkManageSchoolsPermission } from "../middlewares/permissionMiddleware.js";

const router = express.Router();

// All routes are protected and need school management permission
router.post("/", protect, adminOnly, checkManageSchoolsPermission, createSchool);
router.get("/", protect, adminOnly, checkManageSchoolsPermission, getAllSchools);
router.delete("/:id", protect, adminOnly, checkManageSchoolsPermission, deleteSchool);

router.put(
  "/:id/change-password",
  protect,
  adminOnly,
  checkManageSchoolsPermission,
  changeSchoolPassword
);

export default router;
