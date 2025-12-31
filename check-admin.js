// Check admin user in database
const checkAdminUser = async () => {
  try {
    require('dotenv').config();

    const mongoose = require('mongoose');
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pnc_nutrition_care';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const User = require('./backend/models/User');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });

    if (!adminUser) {
      console.log('❌ Admin user not found!');
      console.log('Run: node backend/scripts/createAdmin.js');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('Email:', adminUser.email);
    console.log('Full Name:', adminUser.fullName);
    console.log('Roles:', adminUser.roles);
    console.log('Is Active:', adminUser.isActive);
    console.log('Has Admin Role:', adminUser.roles.includes('admin'));

    // Check if there are any users with admin role
    const adminUsers = await User.find({ roles: 'admin' });
    console.log('Total admin users:', adminUsers.length);

    // List all users
    const allUsers = await User.find({}, 'email fullName roles isActive');
    console.log('\nAll users:');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - Roles: ${user.roles} - Active: ${user.isActive}`);
    });

  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

checkAdminUser();
