import express from "express";
import { getDashboardStats } from "../controllers/userController.js";
import { verifyToken, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only Admins can access this route
router.get("/dashboard", verifyToken, authorizeRole(["admin"]), getDashboardStats);

export default router;
