import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '@/config/config';
import User, { IUser } from '@/models/User.model';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // console.log('Authenticating user...',req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  console.log('Auth header:', req.headers.authorization);
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    console.log('Decoded JWT:', decoded);
    const user = await User.findById(decoded.userId);
    console.log('User found:', user);

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid token or user inactive' });
    }

    req.user = user;
    next();
  } catch (e) {
    console.error('JWT verification error:', e.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

export const checkOwnershipOrAdmin = (model: any) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role === 'admin') {
        return next();
      }
      const resource = await model.findById(req.params.id);
      if (!resource) {
        return res.status(404).json({ success: false, message: 'Resource not found' });
      }
      if (resource.createdBy.userId.toString() !== req.user?._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this resource' });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
