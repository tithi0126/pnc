const connectDB = require('./backend/utils/database');
const Setting = require('./backend/models/Setting');

async function checkSettings() {
  try {
    await connectDB();
    const setting = await Setting.findOne({ key: 'about_image_url' });
    console.log('about_image_url setting:', setting);

    // Also check all settings
    const allSettings = await Setting.find({});
    console.log('Total settings:', allSettings.length);
    allSettings.forEach(s => console.log(`${s.key}: ${s.value ? s.value.substring(0, 50) + '...' : 'null'}`));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    const mongoose = require('mongoose');
    mongoose.connection.close();
  }
}

checkSettings();
