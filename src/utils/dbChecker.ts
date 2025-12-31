// Utility to check database connections and provide detailed status
export const checkDatabaseStatus = async () => {
  console.log('🔍 Checking database connections...');

  const mongoStatus = await testMongoDBConnection();

  console.log('📊 Database Status:');
  console.log(`  MongoDB: ${mongoStatus.connected ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`  Message: ${mongoStatus.message}`);

  // Auth status - check if user is logged in via localStorage token
  const token = localStorage.getItem('authToken');
  const isAuthenticated = !!token;

  console.log('👤 Authentication Status:');
  console.log(`  Authenticated: ${isAuthenticated ? 'Yes' : 'No'}`);
  console.log(`  Token present: ${token ? 'Yes' : 'No'}`);

  return {
    mongodb: mongoStatus,
    auth: {
      isAuthenticated,
      hasToken: !!token
    }
  };
};

// Test actual MongoDB connection via API (backend server)
export const testMongoDBConnection = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

  try {
    console.log('🔄 Testing MongoDB connection via backend API...');

    // Test health endpoint
    const healthResponse = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Add timeout
      signal: AbortSignal.timeout(5003)
    });

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend API is running:', healthData);

      // Test database connection status
      try {
        const dbTestResponse = await fetch(`${apiUrl}/services`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5003)
        });

        if (dbTestResponse.ok) {
          const services = await dbTestResponse.json();
          console.log('✅ MongoDB connected successfully via API');
          return {
            connected: true,
            message: `✅ MongoDB connected - ${Array.isArray(services) ? services.length : 'unknown'} services loaded`,
            data: healthData,
            apiUrl
          };
        } else {
          console.log('⚠️ Backend API running but database not responding');
          return {
            connected: false,
            message: 'Backend API running but MongoDB not connected',
            apiUrl,
            error: 'Database connection issue'
          };
        }
      } catch (dbError) {
        console.log('⚠️ Backend API running but database test failed');
        return {
          connected: false,
          message: 'Backend API running but database operations failed',
          apiUrl,
          error: dbError instanceof Error ? dbError.message : 'Database test failed'
        };
      }
    } else {
      throw new Error(`Health check failed with status ${healthResponse.status}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log('❌ MongoDB connection test failed:', errorMessage);

    if (errorMessage.includes('fetch')) {
      console.log('💡 Backend server is not running. To enable MongoDB:');
      console.log('   1. Start the backend server: cd backend && npm install && npm start');
      console.log('   2. Make sure MongoDB is running on localhost:27017');
      console.log('   3. Check that backend/utils/database.js has correct connection string');

      return {
        connected: false,
        message: 'Backend server not running - start with: cd backend && npm start',
        setup_instructions: 'Backend server required for MongoDB connectivity',
        error: errorMessage
      };
    }

    return {
      connected: false,
      message: `Connection failed: ${errorMessage}`,
      error: errorMessage
    };
  }
};


// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).checkDB = checkDatabaseStatus;
  (window as any).testMongoDB = testMongoDBConnection;

  console.log('💡 Database utilities available:');
  console.log('  - checkDB() - Check database connection status');
  console.log('  - testMongoDB() - Test MongoDB connection via API');
}

export default checkDatabaseStatus;
