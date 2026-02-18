import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = '24h'; // tokens are valid for 24 hours

// Creates a JWT token for authenticated users
export const generateToken = (userId, email, role, fullName = null) => {
  return jwt.sign(
    { userId, email, role, fullName },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Middleware that checks if the request has a valid JWT token
// Token can be in Authorization header or in cookies
export const verifyToken = async (req, res, next) => {
  try {
    // Extract token from Authorization header (Bearer token) or cookies
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }
    
    // Verify the token and decode user info
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach decoded user info to request object
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please login again.' 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Higher-order middleware for role-based access control
// Usage: checkRole('admin', 'manager') only allows those roles
export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated.' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Insufficient permissions.' 
      });
    }
    
    next();
  };
};

// Convenience middleware for common role checks
export const adminOnly = checkRole('admin');
export const managerOrAdmin = checkRole('admin', 'manager');
