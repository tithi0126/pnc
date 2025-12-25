const mongoose = require('mongoose');
const Service = require('../models/Service');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const exportServices = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nutrition_care';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Fetch all services from database (both active and inactive)
    const services = await Service.find({})
      .sort({ sortOrder: 1 })
      .select('-__v -createdAt -updatedAt'); // Exclude MongoDB internal fields

    console.log(`Found ${services.length} services in database`);

    if (services.length === 0) {
      console.log('No services found in database');
      return;
    }

    // Create export data structure
    const exportData = {
      exportDate: new Date().toISOString(),
      totalServices: services.length,
      activeServices: services.filter(s => s.isActive).length,
      inactiveServices: services.filter(s => !s.isActive).length,
      services: services.map(service => ({
        _id: service._id,
        title: service.title,
        shortDescription: service.shortDescription,
        fullDescription: service.fullDescription,
        icon: service.icon,
        duration: service.duration,
        idealFor: service.idealFor,
        benefits: service.benefits,
        isActive: service.isActive,
        sortOrder: service.sortOrder
      }))
    };

    // Create exports directory if it doesn't exist
    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `services-export-${timestamp}.json`;
    const filepath = path.join(exportsDir, filename);

    // Write data to JSON file
    fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));
    console.log(`✅ Services data exported successfully to: ${filepath}`);
    console.log(`📊 Export Summary:`);
    console.log(`   - Total services: ${exportData.totalServices}`);
    console.log(`   - Active services: ${exportData.activeServices}`);
    console.log(`   - Inactive services: ${exportData.inactiveServices}`);
    console.log(`📁 File location: ${filepath}`);

    // Display services list
    console.log('\n📋 Services in export:');
    exportData.services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title} (${service.isActive ? 'Active' : 'Inactive'}) - Sort: ${service.sortOrder}`);
    });

    // Also create a simplified version without MongoDB IDs for easy re-import
    const simplifiedData = {
      exportDate: exportData.exportDate,
      totalServices: exportData.totalServices,
      services: services.map(service => ({
        title: service.title,
        shortDescription: service.shortDescription,
        fullDescription: service.fullDescription,
        icon: service.icon,
        duration: service.duration,
        idealFor: service.idealFor,
        benefits: service.benefits,
        isActive: service.isActive,
        sortOrder: service.sortOrder
      }))
    };

    const simplifiedFilename = `services-export-simplified-${timestamp}.json`;
    const simplifiedFilepath = path.join(exportsDir, simplifiedFilename);
    fs.writeFileSync(simplifiedFilepath, JSON.stringify(simplifiedData, null, 2));
    console.log(`\n✅ Simplified export (for re-import) created: ${simplifiedFilepath}`);

  } catch (error) {
    console.error('❌ Error exporting services:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the export function
if (require.main === module) {
  exportServices();
}

module.exports = { exportServices };
