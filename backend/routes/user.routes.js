import express from "express";
import { getUserProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", protect, getUserProfile);

export default router;
