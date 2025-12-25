// Utility to check database connections and provide detailed status
import { DatabaseStatus, localDB, authService } from '../integrations/supabase/client';

export const checkDatabaseStatus = async () => {
  console.log('🔍 Checking database connections...');

  const status = await DatabaseStatus.logAllConnections();

  // Additional checks
  const collections = ['services', 'testimonials', 'gallery', 'contact_inquiries', 'settings'];
  const collectionStatus = await Promise.all(
    collections.map(async (collection) => {
      try {
        const data = await localDB.find(collection);
        return { collection, count: data.length, status: 'ok' };
      } catch (error) {
        return { collection, count: 0, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' };
      }
    })
  );

  console.log('📊 Collection Status:');
  collectionStatus.forEach(({ collection, count, status, error }) => {
    if (status === 'ok') {
      console.log(`  ✅ ${collection}: ${count} records`);
    } else {
      console.log(`  ❌ ${collection}: ${error}`);
    }
  });

  // Auth status
  const users = authService.getUsers ? authService.getUsers() : [];
  const currentUser = authService.getCurrentUser ? authService.getCurrentUser() : null;

  console.log('👤 Authentication Status:');
  console.log(`  Users registered: ${users.length}`);
  console.log(`  Current user: ${currentUser ? `${currentUser.fullName} (${currentUser.email})` : 'None'}`);
  console.log(`  Is Admin: ${currentUser?.isAdmin ? 'Yes' : 'No'}`);

  return {
    connections: status,
    collections: collectionStatus,
    auth: {
      userCount: users.length,
      currentUser,
      isAuthenticated: !!currentUser
    }
  };
};

// Test actual MongoDB connection via API (backend server)
export const testMongoDBConnection = async () => {
  const apiUrl = 'http://localhost:5000/api';

  try {
    console.log('🔄 Testing MongoDB connection via backend API...');

    // Test health endpoint
    const healthResponse = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Add timeout
      signal: AbortSignal.timeout(5000)
    });

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend API is running:', healthData);

      // Test database connection status
      try {
        const dbTestResponse = await fetch(`${apiUrl}/services`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000)
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

// Force localStorage mode (useful when backend auth is not working)
export const forceLocalStorageMode = () => {
  // Import the api module and set mode
  import('../lib/api').then(apiModule => {
    (apiModule as any).apiMode = 'localStorage';
    console.log('🔄 Forced localStorage mode - reloading page...');
    window.location.reload();
  });
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).checkDB = checkDatabaseStatus;
  (window as any).dbStatus = DatabaseStatus;
  (window as any).testMongoDB = testMongoDBConnection;
  (window as any).forceLocalStorage = forceLocalStorageMode;

  console.log('💡 Database utilities available:');
  console.log('  - checkDB() - Check all database connections and status');
  console.log('  - dbStatus.logAllConnections() - Log connection status');
  console.log('  - dbStatus.checkConnection() - Check localStorage status');
  console.log('  - dbStatus.checkMongoDBConnection() - Check MongoDB config');
  console.log('  - testMongoDB() - Test actual MongoDB connection via API');
  console.log('  - forceLocalStorage() - Force localStorage mode (for testing)');
}

// Export for use in components
export { DatabaseStatus };
export default checkDatabaseStatus;
