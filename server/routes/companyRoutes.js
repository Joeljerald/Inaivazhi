import express from 'express';
import { body } from 'express-validator';
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { validateRequest } from '../middleware/validate.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect);

router.get('/', getCompanies);
router.get('/:id', getCompanyById);

router.post(
  '/',
  authorize(ROLES.PLACEMENT, ROLES.SUPER_ADMIN),
  [
    body('name').notEmpty().withMessage('Company name is required'),
    body('industry').notEmpty().withMessage('Industry is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('contactPerson').notEmpty().withMessage('Contact person is required'),
    body('contactEmail').isEmail().withMessage('Valid contact email is required'),
    validateRequest,
  ],
  createCompany
);

router.put('/:id', authorize(ROLES.PLACEMENT, ROLES.SUPER_ADMIN), updateCompany);
router.delete('/:id', authorize(ROLES.SUPER_ADMIN), deleteCompany);

export default router;
