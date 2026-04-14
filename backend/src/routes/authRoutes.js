const express = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 */
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters.'),
    body('email').isEmail().withMessage('Provide a valid email.'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.'),
    body('role')
      .optional()
      .trim()
      .toLowerCase()
      .isIn(['user', 'admin'])
      .withMessage('Role must be either user or admin.'),
  ],
  validate,
  register
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Provide a valid email.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  login
);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user
 */
router.get('/me', protect, me);
router.get('/admin-only', protect, authorize('admin'), (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome admin!' });
});

module.exports = router;
