const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin, Faculty
const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    // If faculty, only show students from their department
    if (req.user.role === 'faculty') {
      const faculty = await require('../models/Faculty').findOne({ userId: req.user._id });
      if (faculty) {
        query.departmentId = faculty.departmentId;
      }
    }

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .populate('userId', 'name email phone')
      .populate('departmentId', 'departmentName')
      .populate('courseId', 'courseName')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStudents: total,
    };

    res.json({
      success: true,
      data: students,
      pagination,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Admin, Faculty, Student(own)
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email phone profileImage')
      .populate('departmentId', 'departmentName')
      .populate('courseId', 'courseName');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check permissions
    if (req.user.role === 'student' && student.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Student with this enrollment or roll number already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin, Student(own)
const updateStudent = async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check permissions
    if (req.user.role === 'student' && student.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.deleteOne();

    res.json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get student by user ID
// @route   GET /api/students/user/:userId
// @access  Private
const getStudentByUserId = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.userId })
      .populate('userId', 'name email phone profileImage')
      .populate('departmentId', 'departmentName')
      .populate('courseId', 'courseName');

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentByUserId,
};