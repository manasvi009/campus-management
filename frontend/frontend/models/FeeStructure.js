const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  tuitionFee: {
    type: Number,
    required: true,
    min: 0
  },
  examFee: {
    type: Number,
    required: true,
    min: 0
  },
  hostelFee: {
    type: Number,
    required: true,
    min: 0
  },
  transportFee: {
    type: Number,
    required: true,
    min: 0
  },
  totalFee: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate fee structures
feeStructureSchema.index({ courseId: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);