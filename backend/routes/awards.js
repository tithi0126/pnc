const express = require('express');
const Award = require('../models/Award');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get active awards (public)
router.get('/', async (req, res) => {
  try {
    const awards = await Award.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .select('-__v');

    res.json(awards);
  } catch (error) {
    console.error('Error fetching awards:', error);
    res.status(500).json({ error: 'Server error fetching awards.' });
  }
});

// Get active awards (alias for compatibility)
router.get('/active', async (req, res) => {
  try {
    const awards = await Award.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .select('-__v');

    res.json(awards);
  } catch (error) {
    console.error('Error fetching active awards:', error);
    res.status(500).json({ error: 'Server error fetching awards.' });
  }
});

// Get all awards for admin
router.get('/admin', auth, isAdmin, async (req, res) => {
  try {
    const { filter } = req.query;
    let query = {};

    if (filter === 'active') {
      query.isActive = true;
    } else if (filter === 'inactive') {
      query.isActive = false;
    }

    const awards = await Award.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .select('-__v');

    res.json(awards);
  } catch (error) {
    console.error('Error fetching awards for admin:', error);
    res.status(500).json({ error: 'Server error fetching awards.' });
  }
});

// Get single award
router.get('/:id', async (req, res) => {
  try {
    const award = await Award.findById(req.params.id).select('-__v');

    if (!award) {
      return res.status(404).json({ error: 'Award not found' });
    }

    // Only return active awards for public access
    if (!req.user || !req.user.isAdmin) {
      if (!award.isActive) {
        return res.status(404).json({ error: 'Award not found' });
      }
    }

    res.json(award);
  } catch (error) {
    console.error('Error fetching award:', error);
    res.status(500).json({ error: 'Server error fetching award.' });
  }
});

// Create award (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, organization, date, type, images, isActive, sortOrder } = req.body;

    const award = new Award({
      title,
      description,
      organization,
      date,
      type: type || 'award',
      images: images || [],
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 0
    });

    await award.save();
    res.status(201).json(award);
  } catch (error) {
    console.error('Error creating award:', error);
    res.status(500).json({ error: 'Server error creating award.' });
  }
});

// Update award (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { title, description, organization, date, type, images, isActive, sortOrder } = req.body;

    const award = await Award.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        organization,
        date,
        type,
        images,
        isActive,
        sortOrder
      },
      { new: true, runValidators: true }
    );

    if (!award) {
      return res.status(404).json({ error: 'Award not found' });
    }

    res.json(award);
  } catch (error) {
    console.error('Error updating award:', error);
    res.status(500).json({ error: 'Server error updating award.' });
  }
});

// Toggle award status (admin only)
router.patch('/:id/toggle', auth, isAdmin, async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);

    if (!award) {
      return res.status(404).json({ error: 'Award not found' });
    }

    award.isActive = !award.isActive;
    await award.save();

    res.json(award);
  } catch (error) {
    console.error('Error toggling award status:', error);
    res.status(500).json({ error: 'Server error toggling award status.' });
  }
});

// Delete award (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const award = await Award.findByIdAndDelete(req.params.id);

    if (!award) {
      return res.status(404).json({ error: 'Award not found' });
    }

    res.json({ message: 'Award deleted successfully' });
  } catch (error) {
    console.error('Error deleting award:', error);
    res.status(500).json({ error: 'Server error deleting award.' });
  }
});

module.exports = router;
