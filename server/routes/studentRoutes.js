import express from 'express';
import {
  getStudents,
  getStudentById,
  getStudentSkills,
  addOrUpdateStudentSkill,
  deleteStudentSkill,
  getStudentSkillGap,
  getStudentRecommendations,
} from '../controllers/studentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getStudents);
router.get('/:id', getStudentById);

router.get('/:id/skills', getStudentSkills);
router.post('/:id/skills', addOrUpdateStudentSkill);
router.delete('/:id/skills/:skillId', deleteStudentSkill);

router.get('/:studentId/jobs/:jobId/skill-gap', getStudentSkillGap);
router.get('/:studentId/jobs/:jobId/recommendations', getStudentRecommendations);

export default router;
