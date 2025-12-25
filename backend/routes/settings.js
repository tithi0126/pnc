const express = require('express');
const Setting = require('../models/Setting');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all settings (public - for website display)
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find({});
    const settingsMap = {};

    settings.forEach(setting => {
      settingsMap[setting.key] = setting.value || '';
    });

    res.json(settingsMap);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Server error fetching settings.' });
  }
});

// Get single setting value
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const defaultValue = req.query.default || '';

    const value = await Setting.getValue(key, defaultValue);
    res.json({ key, value });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Server error fetching setting.' });
  }
});

// Update multiple settings (admin only)
router.put('/', auth, isAdmin, async (req, res) => {
  try {
    const updates = req.body;
    const results = {};

    for (const [key, value] of Object.entries(updates)) {
      const setting = await Setting.setValue(key, value);
      results[key] = setting.value;
    }

    res.json({
      message: 'Settings updated successfully.',
      settings: results
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Server error updating settings.' });
  }
});

// Update single setting (admin only)
router.put('/:key', auth, isAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await Setting.setValue(key, value);

    res.json({
      message: 'Setting updated successfully.',
      setting: {
        key: setting.key,
        value: setting.value
      }
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Server error updating setting.' });
  }
});

// Delete setting (admin only)
router.delete('/:key', auth, isAdmin, async (req, res) => {
  try {
    const { key } = req.params;

    const result = await Setting.findOneAndDelete({ key });

    if (!result) {
      return res.status(404).json({ error: 'Setting not found.' });
    }

    res.json({ message: 'Setting deleted successfully.' });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({ error: 'Server error deleting setting.' });
  }
});

module.exports = router;
