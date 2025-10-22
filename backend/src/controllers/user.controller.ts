import { Request, Response } from 'express';
import User, { IUser } from '@/models/User.model';
import { generatePassword, sanitizeUser } from '@/utils/helpers';

interface AuthRequest extends Request {
  user?: IUser;
}

// Get all users (Admin only)
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { search, role, isActive, page = 1, limit = 10 } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: +page,
        totalPages: Math.ceil(total / +limit),
        totalItems: total,
        itemsPerPage: +limit
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

// Get a single user by ID
export const getUserById = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Allow users to view their own profile; admin can view any
    if (req.user?.role !== 'admin' && req.user?._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
};

// Create a new user (Admin only)
export const createUser = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { username, email, password, role, profile } = req.body;

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    const userPassword = password || generatePassword();

    const newUser = new User({
      username,
      email,
      password: userPassword,
      role: role || 'user',
      profile
    });
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: sanitizeUser(newUser),
      ...(password ? {} : { generatedPassword: userPassword })
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
  }
};

// Update a user (Admin or self)
export const updateUser = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (req.user?.role !== 'admin' && req.user?._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { username, email, role, profile, isActive } = req.body;

    if (req.user?.role !== 'admin') {
      delete req.body.role;
      delete req.body.isActive;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (profile) user.profile = { ...user.profile, ...profile };
    if (role && req.user.role === 'admin') user.role = role;
    if (isActive !== undefined && req.user.role === 'admin') user.isActive = isActive;

    await user.save();

    return res.status(200).json({ success: true, message: 'User updated', data: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
  }
};

// Soft delete (deactivate) user (Admin only)
export const deleteUser = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (req.user?._id.toString() === req.params.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = false;
    await user.save();

    return res.status(200).json({ success: true, message: 'User deactivated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
};

// Reset user password (Admin only)
export const resetPassword = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newPassword = req.body.password || generatePassword();

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      newPassword: req.body.password ? undefined : newPassword
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message });
  }
};

// Update user settings (own only)
export const updateSettings = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (req.user?._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update these settings' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.set({ settings: { ...user.get('settings'), ...req.body } });
    await user.save();

    return res.status(200).json({ success: true, message: 'Settings updated', data: user.settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
  }
};
