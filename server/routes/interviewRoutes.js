import express from 'express';
import { createInterviewRound, getInterviews, updateInterviewStatus } from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize(ROLES.PLACEMENT, ROLES.SUPER_ADMIN), createInterviewRound);
router.get('/', getInterviews);
router.put('/:id', authorize(ROLES.PLACEMENT, ROLES.SUPER_ADMIN), updateInterviewStatus);

export default router;
