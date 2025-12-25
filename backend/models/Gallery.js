const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  altText: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General',
    enum: ['General', 'Healthy Food', 'Consultation', 'Events', 'Sports Nutrition', 'Recipes']
  },
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
gallerySchema.index({ isActive: 1, category: 1, sortOrder: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);
