import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { authorizeRole, verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, authorizeRole(["admin"]) , getAllUsers); 

export default router; 
