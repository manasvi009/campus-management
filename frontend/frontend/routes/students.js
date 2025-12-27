const express = require('express');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentByUserId,
} = require('../controllers/studentController');

const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Routes
router.route('/')
  .get(authorize('admin', 'faculty'), getStudents)
  .post(authorize('admin'), createStudent);

router.route('/:id')
  .get(authorize('admin', 'faculty', 'student'), getStudent)
  .put(authorize('admin', 'student'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

router.get('/user/:userId', getStudentByUserId);

module.exports = router;