const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  facultyCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  qualification: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: Number, // in years
    default: 0
  },
  subjectsAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  joiningDate: {
    type: Date,
    required: true
  },
  employmentStatus: {
    type: String,
    enum: ['active', 'inactive', 'retired'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Faculty', facultySchema);