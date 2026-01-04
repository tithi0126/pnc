const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./utils/database');

// Import routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const testimonialRoutes = require('./routes/testimonials');
const galleryRoutes = require('./routes/gallery');
const awardRoutes = require('./routes/awards');
const contactRoutes = require('./routes/contact');
const userRoutes = require('./routes/users');
const settingRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/upload');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (for uploaded images) with CORS headers
app.use('/api/uploads', (req, res, next) => {
  // Set CORS headers for static files
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'PNC API is running',
    timestamp: new Date().toISOString()
  });
});

// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'healthy',
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
//     timestamp: new Date().toISOString()
//   });
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5003;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    // console.error(`[FATAL] Port ${PORT} is already in use. Either stop the process occupying it or set a different PORT (e.g. in a .env file).`);
    // console.error('On Windows: run `netstat -ano | findstr :'+PORT+'` to find the PID, then `taskkill /PID <pid> /F` to kill it.');
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});

module.exports = app;
