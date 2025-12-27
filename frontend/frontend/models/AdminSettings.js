const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String // URL to logo
  },
  academicYear: {
    type: String,
    required: true,
    trim: true
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  permissions: {
    type: Map,
    of: Boolean,
    default: {}
  }
}, {
  timestamps: true
});

// Only one settings document
adminSettingsSchema.index({}, { unique: true, sparse: true });

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);