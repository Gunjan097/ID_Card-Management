import express from "express";
import { addClass, getClasses, removeClass } from "../controllers/classController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addClass);
router.get("/", protect, getClasses);
router.delete("/:className", protect, removeClass);


export default router;
