/**
 * Request Validation Middleware
 */

/**
 * Validate content submission
 */
export const validateContentSubmission = (req, res, next) => {
    const { content, category_id, title } = req.body;

    const errors = [];

    // If file is uploaded, content (text) is optional
    if (!req.file) {
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            errors.push('Content is required and must be a non-empty string');
        }
    }

    if (content && content.length < 10) {
        errors.push('Content must be at least 10 characters long');
    }

    if (content && content.length > 50000) {
        errors.push('Content must not exceed 50,000 characters');
    }

    if (title && typeof title !== 'string') {
        errors.push('Title must be a string');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors,
        });
    }

    next();
};

/**
 * Validate user registration
 */
export const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;

    const errors = [];

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push('Name is required');
    }

    if (!email || typeof email !== 'string') {
        errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Invalid email format');
    }

    if (!password || typeof password !== 'string') {
        errors.push('Password is required');
    } else if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors,
        });
    }

    next();
};

/**
 * Validate login
 */
export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    const errors = [];

    if (!email || typeof email !== 'string') {
        errors.push('Email is required');
    }

    if (!password || typeof password !== 'string') {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors,
        });
    }

    next();
};

/**
 * Validate category creation
 */
export const validateCategory = (req, res, next) => {
    const { name } = req.body;

    const errors = [];

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push('Category name is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors,
        });
    }

    next();
};

export default {
    validateContentSubmission,
    validateRegistration,
    validateLogin,
    validateCategory,
};
