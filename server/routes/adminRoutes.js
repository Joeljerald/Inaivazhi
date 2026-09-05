import express from 'express';
import { getAllUsers, createUserAdmin, toggleUserStatus, deleteUserAdmin } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect, authorize(ROLES.SUPER_ADMIN));

router.get('/users', getAllUsers);
router.post('/users', createUserAdmin);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUserAdmin);

export default router;
