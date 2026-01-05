const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async (retries = 5) => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitality-hub';

    if (!mongoURI) {
      throw new Error('MongoDB URI is required');
    }

    // Log URI without credentials for security
    const logURI = mongoURI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@');
    console.log("MongoDB URI:", logURI);
    console.log("Environment:", process.env.NODE_ENV || 'development');

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
      family: 4 // Use IPv4, skip trying IPv6
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error('MongoDB connection error:', error.message);

    if (retries > 0) {
      console.log(`Retrying connection... ${retries} attempts remaining`);
      setTimeout(() => connectDB(retries - 1), 5000); // Wait 5 seconds before retry
    } else {
      console.error('Failed to connect to MongoDB after multiple attempts');

      // In production, don't exit the process - let the app continue without DB
      if (process.env.NODE_ENV === 'production') {
        console.error('Running in production without database connection. Some features may not work.');
      } else {
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
