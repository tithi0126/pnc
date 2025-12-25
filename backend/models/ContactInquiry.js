const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  service: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'archived'],
    default: 'new'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better query performance
contactInquirySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ContactInquiry', contactInquirySchema);
