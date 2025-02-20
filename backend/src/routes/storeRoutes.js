import express from "express";
import { getAllStores, addStore } from "../controllers/storeController.js";
import { authorizeRole, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllStores);
router.post("/", verifyToken, authorizeRole(["admin"]) , addStore);

export default router; 

