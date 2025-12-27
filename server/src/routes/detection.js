import express from 'express';
import { detectContent, getDetection, getUserDetections } from '../controllers/detectionController.js';
import { validateContentSubmission } from '../middleware/validator.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

import { upload } from '../middleware/fileUpload.js';

const router = express.Router();

// POST /api/detect
router.post('/', optionalAuth, upload.single('media'), validateContentSubmission, detectContent);

// GET /api/detection/:id
router.get('/:id', getDetection);

// GET /api/detections/user
router.get('/user/history', authenticate, getUserDetections);

export default router;
