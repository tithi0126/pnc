const express = require('express');
const Gallery = require('../models/Gallery');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get active gallery images (public)
router.get('/', async (req, res) => {
  try {
    const gallery = await Gallery.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .select('-__v');

    res.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Server error fetching gallery.' });
  }
});

// Get all gallery images for admin
router.get('/admin', auth, isAdmin, async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    const gallery = await Gallery.find(query)
      .sort({ sortOrder: 1 })
      .select('-__v');

    res.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery for admin:', error);
    res.status(500).json({ error: 'Server error fetching gallery.' });
  }
});

// Get single gallery image
router.get('/:id', async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ error: 'Gallery image not found.' });
    }

    // Only return active images for public access
    if (!req.user && !image.isActive) {
      return res.status(404).json({ error: 'Gallery image not found.' });
    }

    res.json(image);
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    res.status(500).json({ error: 'Server error fetching gallery image.' });
  }
});

// Create new gallery image (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    // Handle both camelCase and snake_case field names
    const imageUrl = req.body.imageUrl || req.body.image_url || '';
    const altText = req.body.altText || req.body.alt_text || '';
    const isActive = req.body.isActive !== undefined 
      ? req.body.isActive 
      : (req.body.is_active !== undefined ? req.body.is_active : true);
    const sortOrder = req.body.sortOrder !== undefined 
      ? req.body.sortOrder 
      : (req.body.sort_order !== undefined ? req.body.sort_order : 0);
    
    const image = new Gallery({
      title: req.body.title,
      altText: altText,
      imageUrl: imageUrl,
      category: req.body.category || 'General',
      isActive: isActive,
      sortOrder: sortOrder
    });

    await image.save();

    res.status(201).json(image);
  } catch (error) {
    console.error('Error creating gallery image:', error);
    res.status(500).json({ error: 'Server error creating gallery image.' });
  }
});

// Update gallery image (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    console.log('Gallery update request for ID:', req.params.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Handle both camelCase and snake_case field names
    const updateData = { ...req.body };

    // Remove the id field if it exists (should not be part of update data)
    if (updateData.id) {
      console.log('Removing id field from update data');
      delete updateData.id;
    }

    if (req.body.image_url !== undefined && !req.body.imageUrl) {
      updateData.imageUrl = req.body.image_url;
      delete updateData.image_url;
    }

    if (req.body.alt_text !== undefined && !req.body.altText) {
      updateData.altText = req.body.alt_text;
      delete updateData.alt_text;
    }

    if (req.body.is_active !== undefined && req.body.isActive === undefined) {
      updateData.isActive = req.body.is_active;
      delete updateData.is_active;
    }

    if (req.body.sort_order !== undefined && req.body.sortOrder === undefined) {
      updateData.sortOrder = req.body.sort_order;
      delete updateData.sort_order;
    }

    console.log('Final update data:', JSON.stringify(updateData, null, 2));

    // Validate required fields
    if (!updateData.title || !updateData.imageUrl) {
      console.log('Missing required fields - title or imageUrl');
      return res.status(400).json({
        error: 'Title and image URL are required fields.'
      });
    }

    const image = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!image) {
      console.log('Gallery image not found for ID:', req.params.id);
      return res.status(404).json({ error: 'Gallery image not found.' });
    }

    console.log('Gallery image updated successfully:', image._id);
    res.json(image);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ error: 'Server error updating gallery image.' });
  }
});

// Delete gallery image (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);

    if (!image) {
      return res.status(404).json({ error: 'Gallery image not found.' });
    }

    res.json({ message: 'Gallery image deleted successfully.' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: 'Server error deleting gallery image.' });
  }
});

// Toggle active status (admin only)
router.patch('/:id/toggle', auth, isAdmin, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ error: 'Gallery image not found.' });
    }

    image.isActive = !image.isActive;
    await image.save();

    res.json(image);
  } catch (error) {
    console.error('Error toggling gallery image status:', error);
    res.status(500).json({ error: 'Server error updating gallery image status.' });
  }
});

module.exports = router;
