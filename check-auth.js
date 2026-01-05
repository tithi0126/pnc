// Check authentication and server status
const API_BASE_URL = 'https://api.pncpriyamnutritioncare.com/api';

async function checkAuth() {
  try {
    // Get token from localStorage (this would normally be done in browser)
    const token = localStorage.getItem('token') || 'your_token_here';

    console.log('Checking token validity...');

    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Token is valid!');
      console.log('User:', result.user);
    } else {
      console.log('❌ Token is invalid!');
      console.log('Error:', result.error);
      console.log('Details:', result.details);
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    console.log('Checking server status...');

    const response = await fetch(`${API_BASE_URL}/health`);

    if (response.ok) {
      console.log('✅ Server is running!');
      const data = await response.json();
      console.log('Server response:', data);
    } else {
      console.log('❌ Server is not responding!');
      console.log('Status:', response.status);
    }

  } catch (error) {
    console.error('❌ Server check failed:', error.message);
  }
}

// Run checks
async function runChecks() {
  console.log('🔍 Checking PNC API Status...\n');

  await checkServer();
  console.log('\n' + '='.repeat(50) + '\n');

  // Note: Token check would need to be run in browser console
  console.log('To check token validity, run this in browser console:');
  console.log(`
    const token = localStorage.getItem('token');
    fetch('${API_BASE_URL}/auth/verify-token', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      }
    })
    .then(r => r.json())
    .then(console.log)
    .catch(console.error);
  `);
}

runChecks();
