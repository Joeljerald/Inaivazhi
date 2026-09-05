import express from 'express';
import { applyForJob, getApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect);

router.post('/', applyForJob);
router.get('/', getApplications);
router.put('/:id', authorize(ROLES.PLACEMENT, ROLES.SUPER_ADMIN), updateApplicationStatus);

export default router;
