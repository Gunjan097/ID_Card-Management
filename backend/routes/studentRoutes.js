import express from "express";
import { createStudent, getAllStudents, deleteStudent } from "../controllers/studentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createStudent);
router.get("/", protect, getAllStudents);
router.delete("/:id", protect, deleteStudent);

export default router;
