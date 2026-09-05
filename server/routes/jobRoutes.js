import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  addOrUpdateJobSkill,
} from '../controllers/jobController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect);

router.get('/', getJobs);
router.get('/:id', getJobById);

router.post('/', authorize(ROLES.PLACEMENT, ROLES.SUPER_ADMIN), createJob);
router.put('/:id', authorize(ROLES.PLACEMENT, ROLES.SUPER_ADMIN), updateJob);
router.delete('/:id', authorize(ROLES.PLACEMENT, ROLES.SUPER_ADMIN), deleteJob);

router.post('/:id/skills', authorize(ROLES.PLACEMENT, ROLES.SUPER_ADMIN), addOrUpdateJobSkill);

export default router;
