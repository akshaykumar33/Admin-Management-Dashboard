import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  updateSettings,
} from '@/controllers/user.controller';
import { authenticateUser, requireAdmin } from '@/middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve list of users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by username, email, firstName, lastName
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, user]
 *         description: Filter by user role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *         description: Filter by active/inactive users ('true' or 'false')
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Users per page
 *     responses:
 *       200:
 *         description: User list
 */
router.get('/', authenticateUser, requireAdmin, getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 */
router.get('/:id', authenticateUser, getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *               profile:
 *                 type: object
 *                 properties:
 *                   firstName: string
 *                   lastName: string
 *                   department: string
 *                   phone: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/', authenticateUser, requireAdmin, createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user info
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       description: User update data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *               profile:
 *                 type: object
 *                 properties:
 *                   firstName: string
 *                   lastName: string
 *                   department: string
 *                   phone: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.put('/:id', authenticateUser, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deactivate (soft delete) a user (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deactivated
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticateUser, requireAdmin, deleteUser);

/**
 * @swagger
 * /users/{id}/reset-password:
 *   post:
 *     summary: Reset user password (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       description: New password (optional)
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       404:
 *         description: User not found
 */
router.post('/:id/reset-password', authenticateUser, requireAdmin, resetPassword);

/**
 * @swagger
 * /users/{id}/settings:
 *   put:
 *     summary: Update user settings
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Settings object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Your settings fields
 *     responses:
 *       200:
 *         description: Settings updated
 *       404:
 *         description: User not found
 */
router.put('/:id/settings', authenticateUser, updateSettings);

export default router;
