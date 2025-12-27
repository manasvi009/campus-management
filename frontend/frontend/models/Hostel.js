const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  hostelName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  hostelType: {
    type: String,
    enum: ['boys', 'girls', 'mixed'],
    required: true
  },
  totalRooms: {
    type: Number,
    required: true,
    min: 1
  },
  wardenName: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hostel', hostelSchema);