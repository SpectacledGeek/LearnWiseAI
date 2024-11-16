import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, getUserById } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// User Routes
router.post("/register", registerUser); // Register User
router.post("/login", loginUser); // Login User
router.post("/logout", protect, logoutUser); // Logout User
router.get("/current", protect, getCurrentUser); // Get Current User
router.get("/:id", getUserById); // Get User by ID

export default router;
