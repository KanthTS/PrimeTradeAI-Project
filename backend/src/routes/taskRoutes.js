const express = require('express');
const { body, param } = require('express-validator');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Get tasks for current user (admin gets all)
 *   post:
 *     tags: [Tasks]
 *     summary: Create a task
 */
router
  .route('/')
  .get(protect, getTasks)
  .post(
    protect,
    [
      body('title').trim().notEmpty().withMessage('Title is required.'),
      body('description').optional().trim().isLength({ max: 500 }),
      body('status').optional().isIn(['pending', 'in-progress', 'done']),
    ],
    validate,
    createTask
  );

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get single task
 *   put:
 *     tags: [Tasks]
 *     summary: Update task
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete task
 */
router
  .route('/:id')
  .all([protect, param('id').isMongoId().withMessage('Invalid task id.'), validate])
  .get(getTaskById)
  .put(
    [
      body('title').optional().trim().notEmpty().withMessage('Title cannot be empty.'),
      body('description').optional().trim().isLength({ max: 500 }),
      body('status').optional().isIn(['pending', 'in-progress', 'done']),
    ],
    validate,
    updateTask
  )
  .delete(deleteTask);

module.exports = router;
