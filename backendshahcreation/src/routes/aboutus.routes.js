import { Router } from "express";
import {
  getAboutPageContent,
  updateAboutPageContent,
  updateHeroSection,
  updateMVV,
  updateStorySection,
  updateStats,
  updateFeatures,
  addFeature,
  deleteFeature,
  resetToDefault,
} from "../controllers/aboutus.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

// Public route
router.get("/", getAboutPageContent);

// Admin routes
router.put("/", authenticateToken, updateAboutPageContent); // Update all
router.patch("/hero", authenticateToken, updateHeroSection);
router.patch("/mvv", authenticateToken, updateMVV);
router.patch("/story", authenticateToken, updateStorySection);
router.patch("/stats", authenticateToken, updateStats);
router.patch("/features", authenticateToken, updateFeatures);
router.post("/features", authenticateToken, addFeature);
router.delete("/features/:index", authenticateToken, deleteFeature);
router.post("/reset", authenticateToken, resetToDefault);

export default router;
