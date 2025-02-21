import express from "express";
import { 
  getAllStores, 
  getStore, 
  addStore, 
  updateStore, 
  deleteStore 
} from "../controllers/storeController.js";
import { verifyToken, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllStores);
router.get("/:id", getStore);

// Admin only routes
router.post("/", verifyToken, authorizeRole(["admin"]), addStore);
router.put("/:id", verifyToken, authorizeRole(["admin"]), updateStore);
router.delete("/:id", verifyToken, authorizeRole(["admin"]), deleteStore);

export default router;