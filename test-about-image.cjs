const mongoose = require('./backend/utils/database');
const Setting = require('./backend/models/Setting');

async function testAboutImage() {
  try {
    await mongoose.connectDB();

    // Update or create the about_image_url setting
    await Setting.findOneAndUpdate(
      { key: 'about_image_url' },
      {
        key: 'about_image_url',
        value: 'https://images.unsplash.com/800x600/?portrait,doctor,medical&w=400&h=500&fit=crop&crop=face',
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    console.log('about_image_url setting updated successfully');

    // Verify it was saved
    const setting = await Setting.findOne({ key: 'about_image_url' });
    console.log('Saved setting:', setting);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testAboutImage();
