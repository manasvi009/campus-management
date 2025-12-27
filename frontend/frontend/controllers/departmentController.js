const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private/Admin, Faculty
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('hodId', 'name email')
      .sort({ departmentName: 1 });

    res.json({
      success: true,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Private/Admin, Faculty
const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('hodId', 'name email');

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({
      success: true,
      data: department,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);

    res.status(201).json({
      success: true,
      data: department,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Department with this name or code already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({
      success: true,
      data: department,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Department with this name or code already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.deleteOne();

    res.json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};