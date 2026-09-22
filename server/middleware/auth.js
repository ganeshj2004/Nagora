import jwt from 'jsonwebtoken';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === '') {
    throw new Error('JWT_SECRET environment variable is missing or empty. Please set JWT_SECRET in your environment configuration.');
  }
  return secret;
}

export function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token required.' });
  }

  // Demo token bypass for development/testing ONLY (strictly disabled in production)
  if (process.env.NODE_ENV !== 'production' && token === 'demo-admin-jwt-token') {
    req.user = { role: 'admin', username: 'admin' };
    return next();
  }

  try {
    const jwtSecret = getJwtSecret();
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required.' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    if (err.message.includes('JWT_SECRET')) {
      console.error('❌ [SECURITY ERROR]:', err.message);
      return res.status(500).json({ success: false, message: 'Server authentication configuration error.' });
    }
    return res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}


