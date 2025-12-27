import { ThresholdModel } from '../models/Threshold.js';
import { CategoryModel } from '../models/Category.js';
import { DetectionModel } from '../models/Detection.js';
import { ContentEntryModel } from '../models/ContentEntry.js';
import { UserModel } from '../models/User.js';
import dayjs from 'dayjs';

/**
 * Get analytics overview
 * GET /api/admin/analytics/overview
 */
export const getAnalyticsOverview = async (req, res, next) => {
    try {
        // Get counts
        const totalUsers = await UserModel.count();
        const totalContent = await ContentEntryModel.count();
        const totalDetections = await DetectionModel.count();
        const totalCategories = await CategoryModel.count();

        // Get recent detections (last 7 days)
        const recentDetections = await DetectionModel.getRecent(7);

        // Calculate match level distribution
        const matchLevelDistribution = {
            'Original': 0,
            'Partial Match': 0,
            'High Match': 0,
        };

        recentDetections.forEach(d => {
            if (matchLevelDistribution.hasOwnProperty(d.match_level)) {
                matchLevelDistribution[d.match_level]++;
            }
        });

        // Calculate average similarity score
        const avgScore = recentDetections.length > 0
            ? recentDetections.reduce((sum, d) => sum + parseFloat(d.similarity_score), 0) / recentDetections.length
            : 0;

        // Get daily detection counts for the last 7 days
        const dailyCounts = {};
        for (let i = 6; i >= 0; i--) {
            const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
            dailyCounts[date] = 0;
        }

        recentDetections.forEach(d => {
            const date = dayjs(d.created_at).format('YYYY-MM-DD');
            if (dailyCounts.hasOwnProperty(date)) {
                dailyCounts[date]++;
            }
        });

        res.json({
            success: true,
            data: {
                overview: {
                    total_users: totalUsers,
                    total_content: totalContent,
                    total_detections: totalDetections,
                    total_categories: totalCategories,
                },
                recent_activity: {
                    detections_last_7_days: recentDetections.length,
                    average_similarity_score: Math.round(avgScore * 100) / 100,
                    match_level_distribution: matchLevelDistribution,
                },
                daily_detections: Object.entries(dailyCounts).map(([date, count]) => ({
                    date,
                    count,
                })),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all thresholds
 * GET /api/admin/thresholds
 */
export const getThresholds = async (req, res, next) => {
    try {
        const thresholds = await ThresholdModel.getAll();

        res.json({
            success: true,
            data: thresholds,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update threshold
 * PUT /api/admin/thresholds/:id
 */
export const updateThreshold = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const threshold = await ThresholdModel.update(id, updates);

        res.json({
            success: true,
            message: 'Threshold updated successfully',
            data: threshold,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all categories
 * GET /api/admin/categories
 */
export const getCategories = async (req, res, next) => {
    try {
        const categories = await CategoryModel.getAll();

        res.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create category
 * POST /api/admin/categories
 */
export const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const category = await CategoryModel.create({ name, description });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update category
 * PUT /api/admin/categories/:id
 */
export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const category = await CategoryModel.update(id, updates);

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete category
 * DELETE /api/admin/categories/:id
 */
export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        await CategoryModel.delete(id);

        res.json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all detections (admin view)
 * GET /api/admin/detections
 */
export const getAllDetections = async (req, res, next) => {
    try {
        const { limit = 50, offset = 0 } = req.query;

        const detections = await DetectionModel.getAll(
            parseInt(limit),
            parseInt(offset)
        );

        const total = await DetectionModel.count();

        res.json({
            success: true,
            data: {
                detections,
                pagination: {
                    total,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    has_more: parseInt(offset) + detections.length < total,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getAnalyticsOverview,
    getThresholds,
    updateThreshold,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllDetections,
};
