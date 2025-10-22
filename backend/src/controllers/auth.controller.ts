import { Request, Response } from 'express';
import User, { IUser } from '@/models/User.model';
import { generateToken, sanitizeUser } from '@/utils/helpers';
import bcrypt from 'bcryptjs';

interface AuthRequest extends Request {
  user?: IUser;
}

// Register new user (Optional: restrict to admin only in production)
export const register = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { username, email, password, role, profile } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with given email or username already exists' });
    }

    const user = new User({ username, email, password, role, profile });
    await user.save();

    const token = generateToken(user._id.toString());
    const sanitizedUser = sanitizeUser(user);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: sanitizedUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    const token = generateToken(user._id.toString());
    user.lastLogin = new Date();
    await user.save();

    const sanitizedUser = sanitizeUser(user);

    return res.status(200).json({
      success: true,
      token,
      user: sanitizedUser,
      message: 'Login successful',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

// Get logged in user profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  return res.status(200).json({ success: true, user: sanitizeUser(req.user) });
};

// Update profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.profile = { ...user.profile, ...req.body.profile };
    await user.save();

    return res.status(200).json({ success: true, message: 'Profile updated successfully', user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

// Change password
export const changePassword = async (req: AuthRequest, res: Response): Promise<Response> => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to change password', error: error.message });
  }
};
