const express = require('express');
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');

const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Routes
router.route('/')
  .get(authorize('admin', 'faculty'), getDepartments)
  .post(authorize('admin'), createDepartment);

router.route('/:id')
  .get(authorize('admin', 'faculty'), getDepartment)
  .put(authorize('admin'), updateDepartment)
  .delete(authorize('admin'), deleteDepartment);

module.exports = router;