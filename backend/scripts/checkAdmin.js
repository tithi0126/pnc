const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkAdminUser = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitality-hub';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      console.log('Admin user not found!');
      return;
    }

    console.log('Admin user found:');
    console.log('ID:', adminUser._id);
    console.log('Email:', adminUser.email);
    console.log('Full Name:', adminUser.fullName);
    console.log('Roles:', adminUser.roles);
    console.log('Is Active:', adminUser.isActive);

    // Check if user has admin role
    const hasAdminRole = adminUser.roles.includes('admin');
    console.log('Has Admin Role:', hasAdminRole);

    if (!hasAdminRole) {
      console.log('Promoting user to admin...');
      adminUser.roles.push('admin');
      await adminUser.save();
      console.log('User promoted to admin successfully!');
    }

  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
checkAdminUser();
