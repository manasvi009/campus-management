const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  courseCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  duration: {
    type: Number, // in years
    required: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  totalSemesters: {
    type: Number,
    required: true
  },
  courseType: {
    type: String,
    enum: ['UG', 'PG', 'Diploma'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);