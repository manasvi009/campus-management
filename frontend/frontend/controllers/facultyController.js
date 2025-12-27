const Faculty = require('../models/Faculty');

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Private/Admin
const getFaculty = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Faculty.countDocuments();
    const faculty = await Faculty.find()
      .populate('userId', 'name email phone')
      .populate('departmentId', 'departmentName')
      .populate('subjectsAssigned', 'subjectName subjectCode')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalFaculty: total,
    };

    res.json({
      success: true,
      data: faculty,
      pagination,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single faculty
// @route   GET /api/faculty/:id
// @access  Private/Admin, Faculty(own)
const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('userId', 'name email phone profileImage')
      .populate('departmentId', 'departmentName')
      .populate('subjectsAssigned', 'subjectName subjectCode');

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Check permissions
    if (req.user.role === 'faculty' && faculty.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create faculty
// @route   POST /api/faculty
// @access  Private/Admin
const createFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.create(req.body);

    res.status(201).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Faculty with this code already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update faculty
// @route   PUT /api/faculty/:id
// @access  Private/Admin, Faculty(own)
const updateFaculty = async (req, res) => {
  try {
    let faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Check permissions
    if (req.user.role === 'faculty' && faculty.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
// @access  Private/Admin
const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    await faculty.deleteOne();

    res.json({
      success: true,
      message: 'Faculty deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get faculty by user ID
// @route   GET /api/faculty/user/:userId
// @access  Private
const getFacultyByUserId = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ userId: req.params.userId })
      .populate('userId', 'name email phone profileImage')
      .populate('departmentId', 'departmentName')
      .populate('subjectsAssigned', 'subjectName subjectCode');

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }

    res.json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyByUserId,
};