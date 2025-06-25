import express from "express";
import { createClass, getAllClasses, deleteClass } from "../controllers/classController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createClass);
router.get("/", protect, getAllClasses);
router.delete("/:id", protect, deleteClass);

export default router;
