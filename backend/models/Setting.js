const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: String
  }
}, {
  timestamps: true
});

// Static method to get setting by key
settingSchema.statics.getValue = async function(key, defaultValue = '') {
  const setting = await this.findOne({ key });
  return setting ? setting.value : defaultValue;
};

// Static method to set setting value
settingSchema.statics.setValue = async function(key, value) {
  return this.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, new: true }
  );
};

module.exports = mongoose.model('Setting', settingSchema);
