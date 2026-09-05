import express from 'express';
import {
  getTrainers,
  getAssignedStudents,
  filterStudentsBySkills,
  getMostSuitableStudents,
} from '../controllers/trainerController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect);

router.get('/', getTrainers);
router.get('/:id/students', authorize(ROLES.TRAINER, ROLES.PLACEMENT, ROLES.SUPER_ADMIN), getAssignedStudents);
router.post('/filter-students', authorize(ROLES.TRAINER, ROLES.PLACEMENT, ROLES.SUPER_ADMIN), filterStudentsBySkills);
router.get('/most-suitable/:jobId', authorize(ROLES.TRAINER, ROLES.PLACEMENT, ROLES.SUPER_ADMIN), getMostSuitableStudents);

export default router;
