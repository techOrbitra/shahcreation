import { Router } from "express";
import { login, getProfile } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { getCurrentAdmin } from "../controllers/auth.controller.js";
const router = Router();

router.post("/login", login);
router.get("/profile", authenticateToken, getProfile);
router.get("/me", authenticateToken, getCurrentAdmin); // Add this line

export default router;
