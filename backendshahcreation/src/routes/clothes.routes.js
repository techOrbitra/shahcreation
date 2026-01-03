import { Router } from 'express';
import {
  getAllClothes,
  getClothBySlug,
  getClothById,
  createCloth,
  updateCloth,
  deleteCloth,
  bulkDeleteClothes,
  toggleFeatured,
  updateStock,
  getRelatedClothes,
} from '../controllers/clothes.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getAllClothes);
router.get('/slug/:slug', getClothBySlug);
router.get('/:slug/related', getRelatedClothes);

// Admin routes
router.get('/admin/:id', authenticateToken, getClothById);
router.post('/', authenticateToken, createCloth);
router.put('/:id', authenticateToken, updateCloth);
router.delete('/:id', authenticateToken, deleteCloth);
router.post('/bulk-delete', authenticateToken, bulkDeleteClothes);
router.patch('/:id/featured', authenticateToken, toggleFeatured);
router.patch('/:id/stock', authenticateToken, updateStock);

export default router;
