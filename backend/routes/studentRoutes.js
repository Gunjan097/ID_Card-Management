import express from "express";
import { createStudent, getAllStudents, deleteStudent } from "../controllers/studentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// router.post("/", protect, createStudent);
router.get("/", protect, getAllStudents);
router.delete("/:id", protect, deleteStudent);

router.post(
    "/",
    protect,
    upload.single("photo"),
    createStudent
);

export default router;
