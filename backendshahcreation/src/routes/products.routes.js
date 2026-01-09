import { Router } from "express";
import {
  getAllProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  toggleFeatured,
  updateStock,
  getRelatedProducts,
  uploadProductImages,
} from "../controllers/products.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:slug/related", getRelatedProducts);

// Admin routes
router.get("/admin/:id", authenticateToken, getProductById);
router.post("/", authenticateToken, createProduct);
router.post(
  "/upload-images",
  authenticateToken,
  upload.array("images", 10),
  uploadProductImages
);
router.put("/:id", authenticateToken, updateProduct);
router.delete("/:id", authenticateToken, deleteProduct);
router.post("/bulk-delete", authenticateToken, bulkDeleteProducts);
router.patch("/:id/featured", authenticateToken, toggleFeatured);
router.patch("/:id/stock", authenticateToken, updateStock);

export default router;
