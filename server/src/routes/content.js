import express from 'express';
import {
    registerContent,
    getUserContent,
    getContentById,
    deleteContent,
    verifyContentOwnership,
} from '../controllers/contentController.js';
import { validateContentSubmission } from '../middleware/validator.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/content
router.post('/', authenticate, validateContentSubmission, registerContent);

// GET /api/content/user
router.get('/user', authenticate, getUserContent);

// POST /api/content/verify
router.post('/verify', optionalAuth, verifyContentOwnership);

// GET /api/content/:id
router.get('/:id', authenticate, getContentById);

// DELETE /api/content/:id
router.delete('/:id', authenticate, deleteContent);

export default router;
