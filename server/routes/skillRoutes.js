import express from 'express';
import { getSkills, getSkillById, createSkill, updateSkill, deleteSkill } from '../controllers/skillController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect);

router.get('/', getSkills);
router.get('/:id', getSkillById);

router.post('/', authorize(ROLES.TRAINER, ROLES.PLACEMENT, ROLES.SUPER_ADMIN), createSkill);
router.put('/:id', authorize(ROLES.PLACEMENT, ROLES.SUPER_ADMIN), updateSkill);
router.delete('/:id', authorize(ROLES.SUPER_ADMIN), deleteSkill);

export default router;
