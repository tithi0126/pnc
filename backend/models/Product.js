const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  imageUrl: {
    type: String,
    required: true
  },
  additionalImages: [{
    type: String
  }],
  category: {
    type: String,
    default: 'General',
    enum: ['Nutrition Supplements', 'Health Foods', 'Wellness Products', 'Consultation Packages', 'General']
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  razorpayProductId: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
productSchema.index({ isActive: 1, isAvailable: 1, category: 1, sortOrder: 1 });

module.exports = mongoose.model('Product', productSchema);
