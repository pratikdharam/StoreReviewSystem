import express from "express";
import { submitRating, updateRating } from "../controllers/ratingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, submitRating);
router.put("/:id", verifyToken, updateRating);

export default router;
