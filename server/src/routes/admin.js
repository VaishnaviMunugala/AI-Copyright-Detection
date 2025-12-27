import express from 'express';
import {
    getAnalyticsOverview,
    getThresholds,
    updateThreshold,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllDetections,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { validateCategory } from '../middleware/validator.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// Analytics
router.get('/analytics/overview', getAnalyticsOverview);

// Thresholds
router.get('/thresholds', getThresholds);
router.put('/thresholds/:id', updateThreshold);

// Categories
router.get('/categories', getCategories);
router.post('/categories', validateCategory, createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Detections
router.get('/detections', getAllDetections);

export default router;
