const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  departmentCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  hodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  description: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);