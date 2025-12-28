const express = require('express');
const Testimonial = require('../models/Testimonial');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get approved testimonials (public)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true })
      .sort({ isFeatured: -1, createdAt: -1 })
      .select('-__v');

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Server error fetching testimonials.' });
  }
});

// Get approved testimonials (alias for compatibility)
router.get('/approved', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true })
      .sort({ isFeatured: -1, createdAt: -1 })
      .select('-__v');

    console.log('Found', testimonials.length, 'approved testimonials');
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching approved testimonials:', error);
    res.status(500).json({ error: 'Server error fetching testimonials.' });
  }
});

// Get all testimonials for admin
router.get('/admin', auth, isAdmin, async (req, res) => {
  try {
    const { filter } = req.query;
    let query = {};

    if (filter === 'approved') {
      query.isApproved = true;
    } else if (filter === 'pending') {
      query.isApproved = false;
    }

    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials for admin:', error);
    res.status(500).json({ error: 'Server error fetching testimonials.' });
  }
});

// Get single testimonial
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found.' });
    }

    // Only return approved testimonials for public access
    if (!req.user && !testimonial.isApproved) {
      return res.status(404).json({ error: 'Testimonial not found.' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: 'Server error fetching testimonial.' });
  }
});

// Create new testimonial
router.post('/', async (req, res) => {
  try {
    // Handle both isApproved and is_approved field names
    const isApproved = req.body.isApproved !== undefined 
      ? req.body.isApproved 
      : (req.body.is_approved !== undefined ? req.body.is_approved : false);
    
    // Handle both isFeatured and is_featured field names
    const isFeatured = req.body.isFeatured !== undefined 
      ? req.body.isFeatured 
      : (req.body.is_featured !== undefined ? req.body.is_featured : false);
    
    // Handle both imageUrl and image_url field names
    const imageUrl = req.body.imageUrl || req.body.image_url || '';
    
    const testimonial = new Testimonial({
      name: req.body.name,
      role: req.body.role,
      location: req.body.location,
      content: req.body.content,
      rating: req.body.rating || 5,
      imageUrl: imageUrl,
      isApproved: isApproved,
      isFeatured: isFeatured
    });

    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Server error creating testimonial.' });
  }
});

// Update testimonial (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found.' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Server error updating testimonial.' });
  }
});

// Delete testimonial (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found.' });
    }

    res.json({ message: 'Testimonial deleted successfully.' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Server error deleting testimonial.' });
  }
});

// Toggle approval status (admin only)
router.patch('/:id/approval', auth, isAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found.' });
    }

    testimonial.isApproved = !testimonial.isApproved;
    await testimonial.save();

    res.json(testimonial);
  } catch (error) {
    console.error('Error toggling testimonial approval:', error);
    res.status(500).json({ error: 'Server error updating testimonial approval.' });
  }
});

// Toggle featured status (admin only)
router.patch('/:id/featured', auth, isAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found.' });
    }

    testimonial.isFeatured = !testimonial.isFeatured;
    await testimonial.save();

    res.json(testimonial);
  } catch (error) {
    console.error('Error toggling testimonial featured status:', error);
    res.status(500).json({ error: 'Server error updating testimonial featured status.' });
  }
});

module.exports = router;
