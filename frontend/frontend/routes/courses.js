const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Routes
router.route('/')
  .get(authorize('admin', 'faculty'), getCourses)
  .post(authorize('admin'), createCourse);

router.route('/:id')
  .get(authorize('admin', 'faculty'), getCourse)
  .put(authorize('admin'), updateCourse)
  .delete(authorize('admin'), deleteCourse);

module.exports = router;