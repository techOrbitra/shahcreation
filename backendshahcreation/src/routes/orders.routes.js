import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrder,
  addOrderNotes,
  deleteOrder,
  bulkDeleteOrders,
  bulkUpdateStatus,
  getOrderStats,
  getOrdersByPhone,
  exportOrders,
} from '../controllers/orders.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/', createOrder); // Create order from frontend
router.get('/track/:phone', getOrdersByPhone); // Customer order tracking

// Admin routes
router.get('/', authenticateToken, getAllOrders);
router.get('/stats', authenticateToken, getOrderStats);
router.get('/export', authenticateToken, exportOrders);
router.get('/:id', authenticateToken, getOrderById);
router.patch('/:id/status', authenticateToken, updateOrderStatus);
router.put('/:id', authenticateToken, updateOrder);
router.patch('/:id/notes', authenticateToken, addOrderNotes);
router.delete('/:id', authenticateToken, deleteOrder);
router.post('/bulk-delete', authenticateToken, bulkDeleteOrders);
router.post('/bulk-update-status', authenticateToken, bulkUpdateStatus);

export default router;
