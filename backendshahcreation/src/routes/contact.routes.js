import { Router } from 'express';
import {
  // Contact Page Settings
  getContactPageSettings,
  updateContactPageSettings,
  updatePhoneDetails,
  updateAddress,
  resetContactSettings,
  // Contact Inquiries
  getAllInquiries,
  getInquiryById,
  createInquiry,
  toggleInquiryReadStatus,
  bulkMarkAsRead,
  deleteInquiry,
  bulkDeleteInquiries,
  getInquiryStats,
  exportInquiries,
} from '../controllers/contact.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// ==================== PUBLIC ROUTES ====================

// Get contact page settings (public)
router.get('/settings', getContactPageSettings);

// Submit contact inquiry (public)
router.post('/inquiries', createInquiry);

// ==================== ADMIN ROUTES - SETTINGS ====================

router.put('/settings', authenticateToken, updateContactPageSettings);
router.patch('/settings/phone', authenticateToken, updatePhoneDetails);
router.patch('/settings/address', authenticateToken, updateAddress);
router.post('/settings/reset', authenticateToken, resetContactSettings);

// ==================== ADMIN ROUTES - INQUIRIES ====================

router.get('/inquiries/all', authenticateToken, getAllInquiries);
router.get('/inquiries/stats', authenticateToken, getInquiryStats);
router.get('/inquiries/export', authenticateToken, exportInquiries);
router.get('/inquiries/:id', authenticateToken, getInquiryById);
router.patch('/inquiries/:id/read', authenticateToken, toggleInquiryReadStatus);
router.post('/inquiries/bulk-mark-read', authenticateToken, bulkMarkAsRead);
router.delete('/inquiries/:id', authenticateToken, deleteInquiry);
router.post('/inquiries/bulk-delete', authenticateToken, bulkDeleteInquiries);

export default router;
