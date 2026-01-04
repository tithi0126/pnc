const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { uploadSingle, handleUploadError } = require('../utils/upload');
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Upload image route
router.post('/', uploadSingle('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const baseUrl =
      process.env.PUBLIC_BASE_URL ||
      `${req.protocol}://${req.get('host')}`;

    const cleanBaseUrl = baseUrl.replace(/\/$/, '');

    const imageUrl = `${cleanBaseUrl}/api/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Error handling middleware for upload errors
router.use(handleUploadError);

module.exports = router;
