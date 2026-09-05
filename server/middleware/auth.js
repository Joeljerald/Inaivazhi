import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'skillbridge_super_secret_jwt_key_2026_hackathon');

      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User associated with token no longer exists.' });
      }

      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'User account has been deactivated.' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('[Auth Middleware] JWT Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token verification failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no bearer token provided.' });
  }
};
