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
import multer from "multer";
import { importStudents } from "../controllers/studentController.js";
import { exportStudents } from "../controllers/studentController.js";

const router = express.Router();

// Create student (with photo upload)
router.post("/", protect, upload.single("photo"), createStudent);

// Get all students (with pagination + search + optional class filter)
router.get("/", protect, getAllStudents);

const uploadFile = multer({ dest: "uploads/" }); 
router.post("/import", protect, uploadFile.single("file"), importStudents);
router.get("/export", protect, exportStudents);

// Get students by class name (with pagination)
router.get("/class/:className", protect, getStudentsByClassName);

// Get single student by ID
router.get("/:id", protect, getStudentById);

// Update student
router.put("/:id", protect, upload.single("photo"), updateStudent);

// Delete student
router.delete("/:id", protect, deleteStudent);

//Import student

export default router;
