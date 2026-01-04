require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Define Setting schema
const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, default: '' }
});

const Setting = mongoose.model('Setting', SettingSchema);

// Fix image URLs in database
const fixImageUrls = async () => {
  try {
    console.log('🔍 Finding image URLs in database...');

    // Get the correct base URL
    const correctBaseUrl = process.env.PUBLIC_BASE_URL || 'https://pncpriyamnutritioncare.com';

    // Find all settings
    const allSettings = await Setting.find({});
    let fixedCount = 0;

    for (const setting of allSettings) {
      if (setting.value && typeof setting.value === 'string') {
        let originalValue = setting.value;
        let newValue = originalValue;

        // Fix malformed URLs
        if (newValue.includes('https:/.') && !newValue.includes('https://')) {
          newValue = newValue.replace('https:/', 'https://');
        }

        // Fix wrong API path
        if (newValue.includes('/api/uploads/')) {
          newValue = newValue.replace('/api/uploads/', '/api/uploads/');
        }

        // Ensure correct base URL
        if (newValue.includes('/api/uploads/') && !newValue.startsWith(correctBaseUrl)) {
          const filename = newValue.split('/api/uploads/')[1];
          if (filename) {
            newValue = `${correctBaseUrl}/api/uploads/${filename}`;
          }
        }

        if (originalValue !== newValue) {
          console.log(`🔧 ${setting.key}:`);
          console.log(`   Before: ${originalValue}`);
          console.log(`   After:  ${newValue}`);

          await Setting.updateOne(
            { key: setting.key },
            { value: newValue }
          );

          fixedCount++;
        }
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} URLs in database`);
    console.log(`Using base URL: ${correctBaseUrl}`);

  } catch (error) {
    console.error('❌ Error fixing URLs:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the fix
connectDB().then(fixImageUrls);
