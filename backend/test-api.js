// Test script to verify services API endpoints
const testServicesAPI = async () => {
  const baseUrl = 'http://localhost:5003/api';

  console.log('Testing Services API Endpoints...\n');

  try {
    // Test public services endpoint (should return only active services)
    console.log('1. Testing public services endpoint (/api/services)...');
    const publicResponse = await fetch(`${baseUrl}/services`);
    if (publicResponse.ok) {
      const publicServices = await publicResponse.json();
      console.log(`✅ Found ${publicServices.length} active services for public website:`);
      publicServices.forEach((service, index) => {
        console.log(`   ${index + 1}. ${service.title} (${service.isActive ? 'Active' : 'Inactive'})`);
      });
    } else {
      console.log(`❌ Public services endpoint failed: ${publicResponse.status}`);
    }

    console.log('\n2. Testing admin services endpoint (/api/services/admin)...');
    // Test admin services endpoint (requires authentication)
    const adminResponse = await fetch(`${baseUrl}/services/admin`, {
      headers: {
        'Authorization': 'Bearer dummy-token' // This will fail but should show the endpoint is available
      }
    });

    if (adminResponse.status === 401) {
      console.log('✅ Admin endpoint available (authentication required as expected)');
    } else if (adminResponse.ok) {
      const adminServices = await adminResponse.json();
      console.log(`✅ Found ${adminServices.length} total services for admin panel:`);
      adminServices.forEach((service, index) => {
        console.log(`   ${index + 1}. ${service.title} (${service.isActive ? 'Active' : 'Inactive'})`);
      });
    } else {
      console.log(`❌ Admin services endpoint failed: ${adminResponse.status}`);
    }

  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('\nMake sure the backend server is running on http://localhost:5003');
  }
};

// Run the test
testServicesAPI();
