const express = require('express');
const Product = require('../models/Product');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get active and available products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      isAvailable: true
    })
      .sort({ sortOrder: 1, createdAt: -1 })
      .select('-__v');

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error fetching products.' });
  }
});

// Get all products for admin
router.get('/admin', auth, isAdmin, async (req, res) => {
  try {
    const { category, filter } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (filter === 'active') {
      query.isActive = true;
      query.isAvailable = true;
    } else if (filter === 'inactive') {
      query.isActive = false;
    } else if (filter === 'unavailable') {
      query.isAvailable = false;
    }

    const products = await Product.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .select('-__v');

    res.json(products);
  } catch (error) {
    console.error('Error fetching products for admin:', error);
    res.status(500).json({ error: 'Server error fetching products.' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Only return active and available products for public access
    if (!req.user || !req.user.isAdmin) {
      if (!product.isActive || !product.isAvailable) {
        return res.status(404).json({ error: 'Product not found' });
      }
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Server error fetching product.' });
  }
});

// Create product (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      imageUrl,
      additionalImages,
      isAvailable,
      isActive
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      additionalImages: additionalImages || [],
      category: 'General', // Default category
      stockQuantity: 0, // Default stock
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: 0, // Default sort order
      razorpayProductId: '' // Default empty
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Server error creating product.' });
  }
});

// Update product (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const updateData = { ...req.body };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Server error updating product.' });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Server error deleting product.' });
  }
});

// Toggle active status (admin only)
router.patch('/:id/toggle', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Error toggling product status:', error);
    res.status(500).json({ error: 'Server error updating product status.' });
  }
});

// Toggle availability status (admin only)
router.patch('/:id/toggle-availability', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Error toggling product availability:', error);
    res.status(500).json({ error: 'Server error updating product availability.' });
  }
});

module.exports = router;
