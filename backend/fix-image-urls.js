require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      family: 4
    });

    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Define Setting schema (simplified)
const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, default: '' }
});

const Setting = mongoose.model('Setting', SettingSchema);

// Function to normalize image URLs
const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return imageUrl;

  // Fix malformed URLs (missing // after https:)
  if (imageUrl.startsWith('https:/') && !imageUrl.startsWith('https://')) {
    imageUrl = imageUrl.replace('https:/', 'https://');
  }

  // Fix URLs with wrong path (/api/uploads/ should be /uploads/)
  if (imageUrl.includes('/api/uploads/')) {
    imageUrl = imageUrl.replace('/api/uploads/', '/uploads/');
  }

  // If it's already a full URL with the current API base, return as-is
  const apiBase = 'https://api.pncpriyamnutritioncare.com';

  if (imageUrl.startsWith(apiBase)) {
    return imageUrl;
  }

  // If it's an old URL with different port, replace with current base
  if (imageUrl.includes('/uploads/')) {
    const filename = imageUrl.split('/uploads/')[1];
    if (filename) {
      return `${apiBase}/uploads/${filename}`;
    }
  }

  // Return as-is if we can't normalize it
  return imageUrl;
};

const fixImageUrls = async () => {
  try {
    console.log('🔍 Finding settings with image URLs...');

    // Find all settings that might contain image URLs
    const imageRelatedKeys = [
      'hero_image_url',
      'about_image_url',
      // Add more keys if needed
    ];

    const settings = await Setting.find({
      key: { $in: imageRelatedKeys }
    });

    console.log(`Found ${settings.length} settings to check`);

    let fixedCount = 0;

    for (const setting of settings) {
      const originalValue = setting.value;
      const normalizedValue = normalizeImageUrl(originalValue);

      if (originalValue !== normalizedValue) {
        console.log(`🔧 Fixing ${setting.key}:`);
        console.log(`   Original: ${originalValue}`);
        console.log(`   Fixed:    ${normalizedValue}`);

        await Setting.updateOne(
          { key: setting.key },
          { value: normalizedValue }
        );

        fixedCount++;
      } else {
        console.log(`✅ ${setting.key} is already correct`);
      }
    }

    console.log(`\n🎉 Fixed ${fixedCount} malformed image URLs in database`);

    // Also check for any other settings that might contain image URLs
    console.log('\n🔍 Checking all settings for any image URLs...');
    const allSettings = await Setting.find({});
    let otherFixed = 0;

    for (const setting of allSettings) {
      if (setting.value && typeof setting.value === 'string' && setting.value.includes('/uploads/')) {
        const originalValue = setting.value;
        const normalizedValue = normalizeImageUrl(originalValue);

        if (originalValue !== normalizedValue) {
          console.log(`🔧 Fixing ${setting.key}:`);
          console.log(`   Original: ${originalValue}`);
          console.log(`   Fixed:    ${normalizedValue}`);

          await Setting.updateOne(
            { key: setting.key },
            { value: normalizedValue }
          );

          otherFixed++;
        }
      }
    }

    if (otherFixed > 0) {
      console.log(`\n🎉 Fixed ${otherFixed} additional malformed image URLs`);
    }

    console.log('\n✅ Database image URL fix complete!');

  } catch (error) {
    console.error('Error fixing image URLs:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the fix
connectDB().then(() => {
  fixImageUrls();
});
