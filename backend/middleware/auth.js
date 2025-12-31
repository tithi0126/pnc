const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('Auth middleware: No token provided');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    console.log('Auth middleware: Using JWT secret (length):', jwtSecret.length);

    const decoded = jwt.verify(token, jwtSecret);
    console.log('Auth middleware: Token decoded, userId:', decoded.userId);

    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log('Auth middleware: User not found for ID:', decoded.userId);
      return res.status(401).json({ error: 'User not found.' });
    }

    if (!user.isActive) {
      console.log('Auth middleware: User account deactivated:', user.email);
      return res.status(401).json({ error: 'Account is deactivated.' });
    }

    console.log('Auth middleware: Authentication successful for user:', user.email);
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.log('Auth middleware: Token verification failed:', error.message);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('Role middleware: No user found in request');
      return res.status(401).json({ error: 'Authentication required.' });
    }

    console.log('Role middleware: Checking roles for user:', req.user.email);
    console.log('Role middleware: User roles:', req.user.roles);
    console.log('Role middleware: Required roles:', roles);

    const hasRole = roles.some(role => req.user.roles && req.user.roles.includes(role));

    console.log('Role middleware: Has required role:', hasRole);

    if (!hasRole) {
      console.log('Role middleware: Insufficient permissions for user:', req.user.email);
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }

    console.log('Role middleware: Access granted for user:', req.user.email);
    next();
  };
};

const isAdmin = requireRole(['admin']);
const isModerator = requireRole(['admin', 'moderator']);

module.exports = {
  auth,
  isAdmin,
  isModerator,
  requireRole
};
