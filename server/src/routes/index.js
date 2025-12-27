import express from 'express';
import authRoutes from './auth.js';
import detectionRoutes from './detection.js';
import contentRoutes from './content.js';
import adminRoutes from './admin.js';
import testRoutes from './test.js';
import { CategoryModel } from '../models/Category.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'AI Copyright Detection API is running',
        timestamp: new Date().toISOString(),
    });
});

// Public route to get categories
router.get('/categories', async (req, res, next) => {
    try {
        const categories = await CategoryModel.getAll();
        res.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        next(error);
    }
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/detect', detectionRoutes);
router.use('/detection', detectionRoutes); // Alias for single detection
router.use('/content', contentRoutes);
router.use('/admin', adminRoutes);
router.use('/test', testRoutes);

export default router;
