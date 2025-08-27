import express from "express";
import {
  createStudent,
  getAllStudents,
  getStudentsByClassName,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Create student (with photo upload)
router.post("/", protect, upload.single("photo"), createStudent);

// Get all students (with pagination + search + optional class filter)
router.get("/", protect, getAllStudents);

// Get students by class name (with pagination)
router.get("/class/:className", protect, getStudentsByClassName);

// Get single student by ID
router.get("/:id", protect, getStudentById);

// Update student
router.put("/:id", protect, upload.single("photo"), updateStudent);

// Delete student
router.delete("/:id", protect, deleteStudent);

export default router;
