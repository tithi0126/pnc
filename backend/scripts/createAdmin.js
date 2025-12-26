const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitality-hub';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
      return;
    }

    // Create admin user
    const adminUser = new User({
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed by the pre-save middleware
      fullName: 'Admin User',
      roles: ['admin']
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Please use these credentials to log in to the admin panel.');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createAdminUser();
