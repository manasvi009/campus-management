const express = require('express');
const {
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyByUserId,
} = require('../controllers/facultyController');

const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Routes
router.route('/')
  .get(authorize('admin'), getFaculty)
  .post(authorize('admin'), createFaculty);

router.route('/:id')
  .get(authorize('admin', 'faculty'), getFacultyById)
  .put(authorize('admin', 'faculty'), updateFaculty)
  .delete(authorize('admin'), deleteFaculty);

router.get('/user/:userId', getFacultyByUserId);

module.exports = router;