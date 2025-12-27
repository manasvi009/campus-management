const mongoose = require('mongoose');

const roomAllocationSchema = new mongoose.Schema({
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  allocatedDate: {
    type: Date,
    default: Date.now
  },
  vacatedDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate allocations
roomAllocationSchema.index({ hostelId: 1, roomNumber: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('RoomAllocation', roomAllocationSchema);