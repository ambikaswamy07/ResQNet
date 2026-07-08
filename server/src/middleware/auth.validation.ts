import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware handler to intercept validation results and respond with errors if present
 */
export const validateResult = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array({ onlyFirstError: true }).map(err => ({
        field: err.type === 'field' ? err.path : err.type,
        message: err.msg
      }))
    });
    return;
  }
  next();
};

/**
 * Reusable password validation chain meeting strict security policies:
 * - Minimum 8 characters, maximum 32 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const passwordValidation = body('password')
  .isString()
  .withMessage('Password must be a string')
  .isLength({ min: 8, max: 32 })
  .withMessage('Password must be between 8 and 32 characters long')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number')
  .matches(/[^A-Za-z0-9]/)
  .withMessage('Password must contain at least one special character');

/**
 * Reusable newPassword validation chain matching same security criteria as password
 */
const newPasswordValidation = body('newPassword')
  .isString()
  .withMessage('New password must be a string')
  .isLength({ min: 8, max: 32 })
  .withMessage('New password must be between 8 and 32 characters long')
  .matches(/[A-Z]/)
  .withMessage('New password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('New password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('New password must contain at least one number')
  .matches(/[^A-Za-z0-9]/)
  .withMessage('New password must contain at least one special character');

/**
 * Registration request inputs validation chains
 */
export const registerValidation = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Name must be between 3 and 50 characters long'),

  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .trim()
    .toLowerCase(),

  passwordValidation,

  body('phone')
    .isString()
    .withMessage('Phone must be a string')
    .trim()
    .matches(/^\d{10,15}$/)
    .withMessage('Phone number must contain only digits and be between 10 and 15 digits long'),

  body('role')
    .isString()
    .withMessage('Role must be a string')
    .trim()
    .isIn(['Citizen', 'Volunteer', 'Dispatcher', 'Hospital', 'Admin'])
    .withMessage('Role must be one of: Citizen, Volunteer, Dispatcher, Hospital, Admin'),

  validateResult
];

/**
 * Login request inputs validation chains
 */
export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .trim()
    .toLowerCase(),

  body('password')
    .isString()
    .withMessage('Password is required')
    .notEmpty()
    .withMessage('Password cannot be empty'),

  validateResult
];

/**
 * Forgot Password request inputs validation chains
 */
export const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .trim()
    .toLowerCase(),

  validateResult
];

/**
 * Reset Password request inputs validation chains
 */
export const resetPasswordValidation = [
  body('token')
    .isString()
    .withMessage('Token must be a string')
    .trim()
    .notEmpty()
    .withMessage('Token is required'),

  newPasswordValidation,

  validateResult
];

/**
 * Email Verification request inputs validation chains
 */
export const verifyEmailValidation = [
  body('token')
    .isString()
    .withMessage('Token must be a string')
    .trim()
    .notEmpty()
    .withMessage('Token is required'),

  validateResult
];
