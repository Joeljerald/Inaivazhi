import express from 'express';
import {
  createEvaluation,
  getStudentEvaluations,
  createFeedback,
  getStudentFeedback,
} from '../controllers/evaluationController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect);

router.post('/evaluations', authorize(ROLES.TRAINER, ROLES.SUPER_ADMIN), createEvaluation);
router.get('/evaluations/student/:studentId', getStudentEvaluations);

router.post('/feedback', authorize(ROLES.TRAINER, ROLES.SUPER_ADMIN), createFeedback);
router.get('/feedback/student/:studentId', getStudentFeedback);

export default router;
