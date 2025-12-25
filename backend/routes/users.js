const express = require('express');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error fetching users.' });
  }
});

// Get single user (admin only)
router.get('/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error fetching user.' });
  }
});

// Update user roles (admin only)
router.patch('/:id/roles', auth, isAdmin, async (req, res) => {
  try {
    const { roles } = req.body;

    // Validate roles
    const validRoles = ['admin', 'moderator', 'user'];
    const invalidRoles = roles.filter(role => !validRoles.includes(role));

    if (invalidRoles.length > 0) {
      return res.status(400).json({
        error: `Invalid roles: ${invalidRoles.join(', ')}. Valid roles are: ${validRoles.join(', ')}`
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { roles },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user roles:', error);
    res.status(500).json({ error: 'Server error updating user roles.' });
  }
});

// Add role to user (admin only)
router.post('/:id/roles', auth, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    const validRoles = ['admin', 'moderator', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: `Invalid role. Valid roles are: ${validRoles.join(', ')}`
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!user.roles.includes(role)) {
      user.roles.push(role);
      await user.save();
    }

    res.json({ message: `${role} role added to user.` });
  } catch (error) {
    console.error('Error adding role to user:', error);
    res.status(500).json({ error: 'Server error adding role to user.' });
  }
});

// Remove role from user (admin only)
router.delete('/:id/roles/:role', auth, isAdmin, async (req, res) => {
  try {
    const { id, role } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Prevent removing admin role from the last admin
    if (role === 'admin') {
      const adminCount = await User.countDocuments({ roles: 'admin' });
      if (adminCount <= 1 && user.roles.includes('admin')) {
        return res.status(400).json({ error: 'Cannot remove admin role from the last administrator.' });
      }
    }

    user.roles = user.roles.filter(r => r !== role);
    await user.save();

    res.json({ message: `${role} role removed from user.` });
  } catch (error) {
    console.error('Error removing role from user:', error);
    res.status(500).json({ error: 'Server error removing role from user.' });
  }
});

// Deactivate user (admin only)
router.patch('/:id/deactivate', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Prevent deactivating the current admin
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot deactivate your own account.' });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: 'User account deactivated.' });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({ error: 'Server error deactivating user.' });
  }
});

// Activate user (admin only)
router.patch('/:id/activate', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User account activated.', user });
  } catch (error) {
    console.error('Error activating user:', error);
    res.status(500).json({ error: 'Server error activating user.' });
  }
});

module.exports = router;
