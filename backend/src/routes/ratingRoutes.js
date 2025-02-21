import express from "express";
import { 
  submitRating, 
  updateRating, 
  getUserRating,
  getStoreOwnerRatings 
} from "../controllers/ratingController.js";
import { verifyToken, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Submit new rating
router.post("/", verifyToken, submitRating);

// Update existing rating
router.put("/:id", verifyToken, updateRating);

// Get user's rating for a specific store
router.get("/user/:storeId", verifyToken, getUserRating);

// Get store owner's store ratings
router.get("/store-owner", verifyToken, authorizeRole(["store_owner"]), getStoreOwnerRatings);

export default router;