import * as jwt from 'jsonwebtoken';
import config from '@/config/config';
import { IUser } from '@/models/User.model';

/**
 * Generate JWT token for user
 * @param userId User's ID
 */
export const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    config.jwtSecret as jwt.Secret,
    { expiresIn: (config.jwtExpire as jwt.SignOptions['expiresIn']) || '7d' }
  );
};

/**
 * Remove sensitive info from user object before sending in responses
 * @param user User Mongoose document or plain object
 */
export const sanitizeUser = (user: IUser | any): Partial<IUser> => {
  if ('toObject' in user) {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }
  const copy = { ...user };
  delete copy.password;
  return copy;
};

/**
 * Generate random secure password
 * @param length Length of password
 */
export const generatePassword = (length = 12): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};
