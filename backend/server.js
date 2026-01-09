const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./utils/database');

// CORS configuration - SIMPLIFIED
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:5003',
  'https://pncpriyamnutritioncare.com',
  'https://www.pncpriyamnutritioncare.com',
  'https://api.pncpriyamnutritioncare.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // For debugging
      console.log('CORS Blocked Origin:', origin);
      console.log('Allowed Origins:', allowedOrigins);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

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
const productRoutes = require('./routes/products');
const paymentRoutes = require('./routes/payments');

const app = express();

// Connect to MongoDB
connectDB();

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log('Origin:', req.headers.origin);
  console.log('User-Agent:', req.headers['user-agent']);
  next();
});

// Middleware - CORS MUST come first
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingRoutes);

// Apply CORS to upload route specifically
app.use('/api/upload', cors(corsOptions), uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'PNC API is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for CORS
app.get('/api/test-cors', (req, res) => {
  res.json({
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'CORS Error',
      message: err.message,
      allowedOrigins: allowedOrigins
    });
  }
  
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5003;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Allowed Origins: ${allowedOrigins.join(', ')}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});

module.exports = app;