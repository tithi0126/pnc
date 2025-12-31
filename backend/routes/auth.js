const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      fullName,
      roles: ['user'] // Default role
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found for email:', email);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    console.log('User found:', user.email, 'Active:', user.isActive, 'Roles:', user.roles);

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password for user:', user.email);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('Login failed: User account deactivated:', user.email);
      return res.status(401).json({ error: 'Account is deactivated.' });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    console.log('Generating JWT token with secret length:', jwtSecret.length);

    const token = jwt.sign(
      { userId: user._id },
      jwtSecret,
      { expiresIn: '7d' }
    );

    console.log('Login successful for user:', user.email);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  console.log('Profile request for user:', req.user.email);
  console.log('User roles:', req.user.roles);
  console.log('Has admin role:', req.user.roles.includes('admin'));

  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      fullName: req.user.fullName,
      roles: req.user.roles,
      avatarUrl: req.user.avatarUrl
    }
  });
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, avatarUrl } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, avatarUrl },
      { new: true }
    );

    res.json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error updating profile.' });
  }
});

module.exports = router;
