import express from "express";
import {
  createStudent,
  getAllStudents,
  deleteStudent,
  getStudentsByClassName,
  exportStudentsToCSV,
  importStudentsFromCSV
} from "../controllers/studentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { getStudentById, updateStudent } from "../controllers/studentController.js";


const router = express.Router();

router.post("/", protect, upload.single("photo"), createStudent);
router.get("/", protect, getAllStudents);
router.get("/class/:className", protect, getStudentsByClassName);
router.put("/:id", protect, upload.single("photo"), updateStudent); // ✅ Edit student
router.delete("/:id", protect, deleteStudent);
router.get("/export/:className", protect, exportStudentsToCSV);
router.post("/import/:className", protect, upload.single("csv"), importStudentsFromCSV);
router.get("/:id", protect, getStudentById);

// CSV Export
router.get("/export/:className", protect, exportStudentsToCSV);

// CSV Import
router.post(
  "/import/:className",
  protect,
  upload.single("csvFile"),
  importStudentsFromCSV
);


export default router;
