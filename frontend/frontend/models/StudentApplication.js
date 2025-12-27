const mongoose = require('mongoose');

const studentApplicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true
  },
  resumeLink: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'selected', 'rejected'],
    default: 'applied'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate applications
studentApplicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('StudentApplication', studentApplicationSchema);