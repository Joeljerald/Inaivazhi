import { validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error: Invalid input parameters',
      errors: errors.array().map((err) => ({ field: err.path || err.param, message: err.msg })),
    });
  }
  next();
};
