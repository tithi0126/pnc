const express = require('express');
const crypto = require('crypto');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Razorpay configuration - these should be in environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_secret';

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Import Razorpay dynamically to avoid issues if not installed
    let Razorpay;
    try {
      Razorpay = require('razorpay');
    } catch (error) {
      return res.status(500).json({
        error: 'Payment gateway not configured',
        message: 'Razorpay is not properly configured on the server'
      });
    }

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount, // Amount in paisa
      currency: currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      error: 'Failed to create payment order',
      message: error.message
    });
  }
});

// Verify payment signature
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification parameters'
      });
    }

    // Create signature for verification
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      // Here you would typically:
      // 1. Update order status in database
      // 2. Send confirmation email
      // 3. Update inventory if needed
      // 4. Trigger any post-payment actions

      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed - invalid signature'
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
});

// Get payment status (admin only)
router.get('/status/:paymentId', auth, isAdmin, async (req, res) => {
  try {
    // This would typically query your database for payment status
    // For now, return a placeholder response
    res.json({
      paymentId: req.params.paymentId,
      status: 'completed', // This should come from your database
      amount: 0,
      currency: 'INR',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

module.exports = router;
