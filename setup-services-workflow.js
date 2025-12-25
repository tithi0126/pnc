#!/usr/bin/env node

/**
 * Services Data Workflow Setup
 *
 * This script demonstrates how services data flows from the admin panel
 * to the main website in the Priyam Nutrition Care application.
 *
 * Workflow:
 * 1. Admin Panel → MongoDB (via servicesAPI.create/update)
 * 2. Main Website → MongoDB (via servicesAPI.getAll - only active services)
 * 3. ServicesPreview → First 3 active services on homepage
 * 4. Services Page → All active services
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Priyam Nutrition Care - Services Data Workflow Setup\n');

// Check if backend is running
console.log('1. Checking backend server status...');
exec('curl -s http://localhost:5000/api/health', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ Backend server not running');
    console.log('   Please start the backend server:');
    console.log('   cd backend && npm start\n');
    return;
  }

  console.log('✅ Backend server is running\n');

  // Test services API
  console.log('2. Testing services API endpoints...');
  testServicesAPI();
});

async function testServicesAPI() {
  try {
    // Test public endpoint
    const publicResponse = await fetch('http://localhost:5000/api/services');
    const publicServices = await publicResponse.json();

    console.log(`✅ Public API (/api/services): ${publicServices.length} active services`);
    console.log('   Services displayed on main website:');
    publicServices.slice(0, 3).forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.title}`);
    });
    if (publicServices.length > 3) {
      console.log(`   ... and ${publicServices.length - 3} more services on /services page`);
    }

    console.log('\n📋 Services Data Flow:');
    console.log('   Admin Panel → MongoDB Database');
    console.log('   ↓ (servicesAPI.create/update/delete)');
    console.log('   Main Website → Active Services Only');
    console.log('   ↓ (servicesAPI.getAll)');
    console.log('   ServicesPreview (homepage) + Services Page\n');

    console.log('🎯 How to manage services:');
    console.log('   1. Go to Admin Dashboard: http://localhost:5173/admin/dashboard');
    console.log('   2. Login with admin credentials');
    console.log('   3. Navigate to "Services" tab');
    console.log('   4. Create/Edit/Delete services');
    console.log('   5. Changes are automatically saved to MongoDB');
    console.log('   6. Active services appear on the main website immediately\n');

    console.log('🔧 Available Scripts:');
    console.log('   • backend/scripts/seedServices.js - Add sample services to database');
    console.log('   • backend/test-api.js - Test API endpoints');
    console.log('   • npm run dev - Start frontend development server\n');

    console.log('📊 Current Database Status:');
    console.log(`   • Active Services: ${publicServices.length}`);
    console.log('   • Database: MongoDB (persistent storage)');
    console.log('   • API Mode: HTTP (connected to backend)\n');

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

// Export for module usage
module.exports = { setupServicesWorkflow: testServicesAPI };

// Run if called directly
if (require.main === module) {
  // Check if we need to show help
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
Priyam Nutrition Care - Services Workflow Setup

Usage: node setup-services-workflow.js [options]

Options:
  --help, -h    Show this help message
  --seed        Run the services seeding script
  --test        Run API tests only

Examples:
  node setup-services-workflow.js          # Full setup check
  node setup-services-workflow.js --seed   # Seed database with services
  node setup-services-workflow.js --test   # Test API endpoints only
    `);
    return;
  }

  // Run seeding if requested
  if (process.argv.includes('--seed')) {
    console.log('🌱 Seeding services database...');
    exec('cd backend && node scripts/seedServices.js', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Seeding failed:', error);
        return;
      }
      console.log(stdout);
      testServicesAPI();
    });
    return;
  }

  // Run tests only if requested
  if (process.argv.includes('--test')) {
    testServicesAPI();
    return;
  }

  // Default: full setup check
  testServicesAPI();
}
