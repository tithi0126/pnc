const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String
  },
  icon: {
    type: String,
    default: 'Apple'
  },
  duration: {
    type: String
  },
  idealFor: {
    type: String
  },
  benefits: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
serviceSchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('Service', serviceSchema);
