import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../middleware/validator.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', validateRegistration, register);

// POST /api/auth/login
router.post('/login', validateLogin, login);

// GET /api/auth/me
router.get('/me', authenticate, getProfile);

export default router;
