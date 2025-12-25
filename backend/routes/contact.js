const express = require('express');
const ContactInquiry = require('../models/ContactInquiry');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Submit contact inquiry (public)
router.post('/', async (req, res) => {
  try {
    const inquiry = new ContactInquiry(req.body);
    await inquiry.save();

    res.status(201).json({
      message: 'Thank you for your inquiry. We will get back to you soon!',
      inquiry: {
        id: inquiry._id,
        name: inquiry.name,
        email: inquiry.email,
        createdAt: inquiry.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating contact inquiry:', error);
    res.status(500).json({ error: 'Server error submitting inquiry.' });
  }
});

// Get all contact inquiries (admin only)
router.get('/admin', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const inquiries = await ContactInquiry.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    res.status(500).json({ error: 'Server error fetching inquiries.' });
  }
});

// Get single contact inquiry (admin only)
router.get('/:id', auth, isAdmin, async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ error: 'Contact inquiry not found.' });
    }

    res.json(inquiry);
  } catch (error) {
    console.error('Error fetching contact inquiry:', error);
    res.status(500).json({ error: 'Server error fetching inquiry.' });
  }
});

// Update contact inquiry (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ error: 'Contact inquiry not found.' });
    }

    res.json(inquiry);
  } catch (error) {
    console.error('Error updating contact inquiry:', error);
    res.status(500).json({ error: 'Server error updating inquiry.' });
  }
});

// Update inquiry status (admin only)
router.patch('/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'read', 'responded', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ error: 'Contact inquiry not found.' });
    }

    res.json(inquiry);
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ error: 'Server error updating inquiry status.' });
  }
});

// Update inquiry notes (admin only)
router.patch('/:id/notes', auth, isAdmin, async (req, res) => {
  try {
    const { notes } = req.body;

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { notes },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ error: 'Contact inquiry not found.' });
    }

    res.json(inquiry);
  } catch (error) {
    console.error('Error updating inquiry notes:', error);
    res.status(500).json({ error: 'Server error updating inquiry notes.' });
  }
});

// Delete contact inquiry (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ error: 'Contact inquiry not found.' });
    }

    res.json({ message: 'Contact inquiry deleted successfully.' });
  } catch (error) {
    console.error('Error deleting contact inquiry:', error);
    res.status(500).json({ error: 'Server error deleting inquiry.' });
  }
});

module.exports = router;
