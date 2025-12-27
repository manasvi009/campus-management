const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  internalMarks: {
    type: Number,
    min: 0,
    max: 50,
    default: 0
  },
  externalMarks: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  practicalMarks: {
    type: Number,
    min: 0,
    max: 50,
    default: 0
  },
  totalMarks: {
    type: Number,
    min: 0,
    max: 200,
    required: true
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate results
resultSchema.index({ studentId: 1, subjectId: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);