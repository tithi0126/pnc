// Test script to verify database connection logging
import { DatabaseStatus, testMongoDBConnection } from './dbChecker';

export const testDatabaseConnections = async () => {
  console.log('🧪 Testing Database Connections...');

  // Test localStorage connection
  console.log('\n1. Testing localStorage connection:');
  const localStatus = DatabaseStatus.checkConnection();
  console.log('Result:', localStatus);

  // Test MongoDB configuration
  console.log('\n2. Testing MongoDB configuration:');
  const mongoStatus = await DatabaseStatus.checkMongoDBConnection();
  console.log('Result:', mongoStatus);

  // Test full status check
  console.log('\n3. Testing full status check:');
  const fullStatus = await DatabaseStatus.logAllConnections();

  // Test API-based MongoDB connection (if backend exists)
  console.log('\n4. Testing API-based MongoDB connection:');
  const apiTest = await testMongoDBConnection();
  console.log('API Test Result:', apiTest);

  console.log('\n✅ Database connection testing completed!');
  return { localStatus, mongoStatus, fullStatus, apiTest };
};

// Make it available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testDBConnections = testDatabaseConnections;
  console.log('🧪 Database test utility available: run testDBConnections()');
}
