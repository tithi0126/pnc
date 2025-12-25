// Utility script to check and fix existing services
// Run this in browser console to diagnose service display issues

import { servicesAPI } from '@/lib/api';

export async function checkServices() {
  try {
    console.log('🔍 Checking services...');

    // Get all services (admin view)
    const allServices = await servicesAPI.getAllAdmin();
    console.log(`Total services in admin: ${allServices.length}`);

    // Get active services (public view)
    const activeServices = await servicesAPI.getAll();
    console.log(`Active services on website: ${activeServices.length}`);

    // Check each service
    allServices.forEach((service, index) => {
      console.log(`\nService ${index + 1}: ${service.title}`);
      console.log(`  - isActive: ${service.isActive}`);
      console.log(`  - is_active: ${(service as any).is_active}`);
      console.log(`  - Visible on website: ${service.isActive ? '✅ Yes' : '❌ No'}`);
    });

    // Fix any services with wrong field names
    if (allServices.length > 0) {
      console.log('\n🔧 Attempting to fix services with incorrect field names...');
      const fixedCount = await servicesAPI.fixExistingServices();
      console.log(`Fixed ${fixedCount} services`);

      if (fixedCount > 0) {
        console.log('Please refresh the services page to see the changes.');
      }
    }

    return {
      totalServices: allServices.length,
      activeServices: activeServices.length,
      allServices
    };

  } catch (error) {
    console.error('❌ Error checking services:', error);
    return null;
  }
}

// Make it available globally for console use
(window as any).checkServices = checkServices;
