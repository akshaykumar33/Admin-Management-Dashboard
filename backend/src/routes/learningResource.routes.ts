import { Router } from 'express';
import {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  likeResource,
} from '@/controllers/learningResource.controller';
import {
  authenticateUser,
  checkOwnershipOrAdmin,
} from '@/middleware/auth.middleware';
import LearningResource from '@/models/LearningResource.model';

/**
 * @swagger
 * tags:
 *   name: LearningResources
 *   description: Operations related to learning resources
 */

const router = Router();

/**
 * @swagger
 * /learning-resources:
 *   get:
 *     summary: List learning resources with filtering and pagination
 *     tags: [LearningResources]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Tutorial, Article, Video, Course, Documentation]
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of learning resources
 */
router.get('/', getAllResources);

/**
 * @swagger
 * /learning-resources/{id}:
 *   get:
 *     summary: Get a learning resource by ID
 *     tags: [LearningResources]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Resource ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Learning resource data
 *       404:
 *         description: Resource not found
 */
router.get('/:id', getResourceById);

/**
 * @swagger
 * /learning-resources:
 *   post:
 *     summary: Create a new learning resource
 *     tags: [LearningResources]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Learning resource payload
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - url
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               url:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               difficulty:
 *                 type: string
 *     responses:
 *       201:
 *         description: Resource created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateUser, createResource);

/**
 * @swagger
 * /learning-resources/{id}:
 *   put:
 *     summary: Update a learning resource
 *     tags: [LearningResources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID
 *     requestBody:
 *       description: Updated resource info
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               url:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               difficulty:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *       404:
 *         description: Resource not found
 *       403:
 *         description: Forbidden
 */
router.put('/:id', authenticateUser, checkOwnershipOrAdmin(LearningResource), updateResource);

/**
 * @swagger
 * /learning-resources/{id}:
 *   delete:
 *     summary: Delete (soft) a learning resource
 *     tags: [LearningResources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *       404:
 *         description: Resource not found
 */
router.delete('/:id', authenticateUser, checkOwnershipOrAdmin(LearningResource), deleteResource);

/**
 * @swagger
 * /learning-resources/{id}/like:
 *   post:
 *     summary: Like a learning resource
 *     tags: [LearningResources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resource ID
 *     responses:
 *       200:
 *         description: Resource liked successfully
 *       404:
 *         description: Resource not found
 */
router.post('/:id/like', authenticateUser, likeResource);

export default router;
