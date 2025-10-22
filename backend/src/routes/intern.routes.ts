import { Router } from 'express';
import {
  getAllInterns,
  getInternById,
  createIntern,
  updateIntern,
  deleteIntern,
  addDailyComment,
  addMeetingNote,
  addProject,
} from '@/controllers/intern.controller';
import { authenticateUser, requireAdmin } from '@/middleware/auth.middleware';

/**
 * @swagger
 * tags:
 *   name: Interns
 *   description: Intern management and tracking
 */

const router = Router();

router.use(authenticateUser);

/**
 * @swagger
 * /interns:
 *   get:
 *     summary: Get a paginated list of interns
 *     tags: [Interns]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Completed, On Leave, Terminated]
 *         description: Filter by internship status
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
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
 *         description: List of interns
 */
router.get('/', getAllInterns);

/**
 * @swagger
 * /interns/{id}:
 *   get:
 *     summary: Get detailed intern profile by ID
 *     tags: [Interns]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Intern ID
 *     responses:
 *       200:
 *         description: Intern profile details
 *       404:
 *         description: Intern not found
 */
router.get('/:id', getInternById);

/**
 * @swagger
 * /interns:
 *   post:
 *     summary: Create a new intern (Admin only)
 *     tags: [Interns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Intern data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Intern'
 *     responses:
 *       201:
 *         description: Intern created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', requireAdmin, createIntern);

/**
 * @swagger
 * /interns/{id}:
 *   put:
 *     summary: Update intern details (Admin only)
 *     tags: [Interns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated intern data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Intern'
 *     responses:
 *       200:
 *         description: Intern updated successfully
 *       404:
 *         description: Intern not found
 */
router.put('/:id', requireAdmin, updateIntern);

/**
 * @swagger
 * /interns/{id}:
 *   delete:
 *     summary: Delete (deactivate) an intern (Admin only)
 *     tags: [Interns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Intern deleted successfully
 *       404:
 *         description: Intern not found
 */
router.delete('/:id', requireAdmin, deleteIntern);

/**
 * @swagger
 * /interns/{id}/comments:
 *   post:
 *     summary: Add a daily comment to intern
 *     tags: [Interns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Comment data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               comment:
 *                 type: string
 *               taskDescription:
 *                 type: string
 *               hoursWorked:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [Completed, In Progress, Blocked]
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post('/:id/comments', addDailyComment);

/**
 * @swagger
 * /interns/{id}/meeting-notes:
 *   post:
 *     summary: Add a meeting note to intern
 *     tags: [Interns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Meeting note data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notes
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               title:
 *                 type: string
 *               agenda:
 *                 type: string
 *               notes:
 *                 type: string
 *               attendees:
 *                 type: array
 *                 items:
 *                   type: string
 *               actionItems:
 *                 type: array
 *                 items:
 *                   type: string
 *               nextMeetingDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Meeting note added successfully
 */
router.post('/:id/meeting-notes', addMeetingNote);

/**
 * @swagger
 * /interns/{id}/projects:
 *   post:
 *     summary: Add a project to intern (Admin only)
 *     tags: [Interns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Project data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Project added successfully
 */
router.post('/:id/projects', requireAdmin, addProject);

export default router;
