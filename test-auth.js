// Test authentication script
const jwt = require('jsonwebtoken');

// Test JWT token generation and verification
const testAuth = () => {
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  const userId = '507f1f77bcf86cd799439011'; // Example MongoDB ObjectId

  console.log('Testing JWT Authentication:');
  console.log('JWT Secret length:', jwtSecret.length);

  // Generate token
  const token = jwt.sign(
    { userId },
    jwtSecret,
    { expiresIn: '7d' }
  );

  console.log('Generated token (first 50 chars):', token.substring(0, 50) + '...');

  // Verify token
  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Token verification successful!');
    console.log('Decoded userId:', decoded.userId);
  } catch (error) {
    console.log('Token verification failed:', error.message);
  }

  // Test with wrong secret
  try {
    jwt.verify(token, 'wrong-secret');
    console.log('ERROR: Token verified with wrong secret!');
  } catch (error) {
    console.log('Good: Token correctly rejected with wrong secret');
  }
};

testAuth();
