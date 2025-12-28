const express = require('express');
const Service = require('../models/Service');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all services (public - only active ones)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .select('-__v');

    // console.log('Found', services.length, 'active services');
    res.json(services);
  } catch (error) {
    // console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Server error fetching services.' });
  }
});

// Get active services (alias for compatibility)
router.get('/active', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .select('-__v');

    // console.log('Found', services.length, 'active services');
    res.json(services);
  } catch (error) {
    // console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Server error fetching services.' });
  }
});

// Get all services for admin (including inactive)
router.get('/admin', auth, isAdmin, async (req, res) => {
  try {
    const services = await Service.find({})
      .sort({ sortOrder: 1 })
      .select('-__v');

    // console.log('Found', services.length, 'total services for admin');
    services.forEach((s, i) => console.log(`${i+1}. ${s.title} - isActive: ${s.isActive}`));

    res.json(services);
  } catch (error) {
    // console.error('Error fetching services for admin:', error);
    res.status(500).json({ error: 'Server error fetching services.' });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    // Only return active services for public access
    if (!req.user && !service.isActive) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    res.json(service);
  } catch (error) {
    // console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Server error fetching service.' });
  }
});

// Create new service (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {

    // Handle both isActive and is_active field names
    const isActive = req.body.isActive !== undefined
      ? req.body.isActive
      : (req.body.is_active !== undefined ? req.body.is_active : true);

    // Handle benefits array
    const benefits = Array.isArray(req.body.benefits)
      ? req.body.benefits
      : (typeof req.body.benefits === 'string' ? JSON.parse(req.body.benefits || '[]') : []);

    const service = new Service({
      title: req.body.title,
      shortDescription: req.body.shortDescription || req.body.short_description,
      fullDescription: req.body.fullDescription || req.body.full_description,
      icon: req.body.icon,
      duration: req.body.duration,
      idealFor: req.body.idealFor || req.body.ideal_for,
      benefits: benefits,
      isActive: isActive,
      sortOrder: req.body.sortOrder || req.body.sort_order || 0
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Server error creating service.' });
  }
});

// Update service (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Server error updating service.' });
  }
});

// Delete service (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    res.json({ message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Server error deleting service.' });
  }
});

module.exports = router;
