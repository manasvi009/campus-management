const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  driverName: {
    type: String,
    required: true,
    trim: true
  },
  driverContact: {
    type: String,
    required: true,
    trim: true
  },
  routeName: {
    type: String,
    required: true,
    trim: true
  },
  pickupPoints: [{
    type: String,
    trim: true
  }],
  studentsAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Transport', transportSchema);