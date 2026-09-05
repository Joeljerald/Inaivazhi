import express from 'express';
import { createAssociation, getAssociations } from '../controllers/associationController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize(ROLES.PLACEMENT, ROLES.SUPER_ADMIN), createAssociation);
router.get('/', getAssociations);

export default router;
