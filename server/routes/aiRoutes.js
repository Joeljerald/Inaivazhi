import express from 'express';
import { getStudentRoadmap, searchCandidatesAI } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect);

router.post('/student-roadmap', getStudentRoadmap);
router.post('/candidate-match', authorize(ROLES.TRAINER, ROLES.PLACEMENT, ROLES.SUPER_ADMIN), searchCandidatesAI);

export default router;
