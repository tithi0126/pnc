const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pnc');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Models
const Service = require('./models/Service');
const Testimonial = require('./models/Testimonial');
const Gallery = require('./models/Gallery');

// Check if image file exists
const checkImageExists = (imageUrl) => {
  if (!imageUrl) return { exists: false, localPath: null };

  try {
    // Extract filename from URL
    const urlParts = imageUrl.split('/uploads/');
    if (urlParts.length < 2) return { exists: false, localPath: null };

    const filename = urlParts[1].split('?')[0]; // Remove query parameters
    const localPath = path.join(__dirname, '../uploads', filename);

    const exists = fs.existsSync(localPath);
    return { exists, localPath, filename };
  } catch (error) {
    return { exists: false, localPath: null, error: error.message };
  }
};

// Check images in database
const checkImages = async () => {
  console.log('Checking images in database...\n');

  const collections = [
    { name: 'Services', model: Service, imageField: 'imageUrl' },
    { name: 'Testimonials', model: Testimonial, imageField: 'imageUrl' },
    { name: 'Gallery', model: Gallery, imageField: 'images' }
  ];

  let totalChecked = 0;
  let totalMissing = 0;

  for (const collection of collections) {
    console.log(`=== Checking ${collection.name} ===`);

    const documents = await collection.model.find({});
    console.log(`Found ${documents.length} documents\n`);

    for (const doc of documents) {
      const images = collection.imageField === 'images' ? doc.images : [doc.imageUrl];

      for (const imageUrl of images) {
        if (!imageUrl) continue;

        totalChecked++;
        const check = checkImageExists(imageUrl);

        if (!check.exists) {
          console.log(`❌ MISSING: ${collection.name} - ${doc._id}`);
          console.log(`   URL: ${imageUrl}`);
          console.log(`   Expected file: ${check.filename || 'N/A'}`);
          totalMissing++;
        } else {
          console.log(`✅ FOUND: ${collection.name} - ${doc._id}`);
        }
        console.log('');
      }
    }
  }

  console.log('=== SUMMARY ===');
  console.log(`Total images checked: ${totalChecked}`);
  console.log(`Missing images: ${totalMissing}`);
  console.log(`Success rate: ${((totalChecked - totalMissing) / totalChecked * 100).toFixed(1)}%`);
};

// List all files in uploads directory
const listUploadFiles = () => {
  console.log('\n=== FILES IN UPLOADS DIRECTORY ===');

  const uploadDir = path.join(__dirname, '../uploads');

  if (!fs.existsSync(uploadDir)) {
    console.log('❌ Uploads directory does not exist');
    return;
  }

  const files = fs.readdirSync(uploadDir);
  console.log(`Found ${files.length} files:`);

  files.forEach(file => {
    const filePath = path.join(uploadDir, file);
    const stats = fs.statSync(filePath);
    console.log(`- ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  });
};

// Main function
const main = async () => {
  console.log('🔍 Image Checker for PNC Database\n');

  await connectDB();

  // Check images in database
  await checkImages();

  // List actual files
  listUploadFiles();

  console.log('\n✅ Image check completed');

  await mongoose.disconnect();
  process.exit(0);
};

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}

module.exports = { checkImageExists, checkImages, listUploadFiles };
