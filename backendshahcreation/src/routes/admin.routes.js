import { Router } from 'express';
import { getAllAdmins, createAdmin, deleteAdmin, toggleAdminStatus } from '../controllers/admin.controller.js';
import { authenticateToken, requireSuperAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);
router.use(requireSuperAdmin);

router.get('/', getAllAdmins);
router.post('/', createAdmin);
router.delete('/:id', deleteAdmin);
router.patch('/:id/status', toggleAdminStatus);

export default router;
