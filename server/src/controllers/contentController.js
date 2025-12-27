import { ContentEntryModel } from '../models/ContentEntry.js';
import { generateFingerprint, generateCertificateId } from '../utils/fingerprint.js';
import { generateCertificateMetadata, formatCertificate, verifyOwnership } from '../utils/certificate.js';

/**
 * Register new content
 * POST /api/content
 */
export const registerContent = async (req, res, next) => {
    try {
        const { title, content, category_id, notes } = req.body;
        const owner_id = req.user.id;

        // Generate fingerprint
        const { hash, embedding } = generateFingerprint(content);

        // Generate certificate ID
        const certificate_id = generateCertificateId();

        // Create content entry
        const contentEntry = await ContentEntryModel.create({
            title: title || 'Untitled Content',
            owner_id,
            category_id: category_id || null,
            raw_content: content,
            fingerprint: hash,
            embedding_vector: embedding,
            certificate_id,
        });

        // Generate certificate
        const certificateMetadata = generateCertificateMetadata(contentEntry);
        const certificate = formatCertificate(certificateMetadata);

        res.status(201).json({
            success: true,
            message: 'Content registered successfully',
            data: {
                content_id: contentEntry.id,
                certificate_id: contentEntry.certificate_id,
                certificate,
                created_at: contentEntry.created_at,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user's registered content
 * GET /api/content/user
 */
export const getUserContent = async (req, res, next) => {
    try {
        const owner_id = req.user.id;
        const { limit = 20, offset = 0 } = req.query;

        const content = await ContentEntryModel.getByOwnerId(
            owner_id,
            parseInt(limit),
            parseInt(offset)
        );

        const total = await ContentEntryModel.countByOwner(owner_id);

        res.json({
            success: true,
            data: {
                content: content.map(c => ({
                    id: c.id,
                    title: c.title,
                    category: c.category,
                    certificate_id: c.certificate_id,
                    created_at: c.created_at,
                    preview: c.raw_content.substring(0, 200) + (c.raw_content.length > 200 ? '...' : ''),
                })),
                pagination: {
                    total,
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    has_more: parseInt(offset) + content.length < total,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get content by ID
 * GET /api/content/:id
 */
export const getContentById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const content = await ContentEntryModel.findById(id);

        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Content not found',
            });
        }

        // Check if user owns this content
        if (content.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        // Generate certificate
        const certificateMetadata = generateCertificateMetadata(content);
        const certificate = formatCertificate(certificateMetadata);

        res.json({
            success: true,
            data: {
                id: content.id,
                title: content.title,
                category: content.category,
                raw_content: content.raw_content,
                certificate_id: content.certificate_id,
                certificate,
                created_at: content.created_at,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete content
 * DELETE /api/content/:id
 */
export const deleteContent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const content = await ContentEntryModel.findById(id);

        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Content not found',
            });
        }

        // Check if user owns this content
        if (content.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        await ContentEntryModel.delete(id);

        res.json({
            success: true,
            message: 'Content deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Verify content ownership
 * POST /api/content/verify
 */
export const verifyContentOwnership = async (req, res, next) => {
    try {
        const { content, certificate_id } = req.body;

        if (!content || !certificate_id) {
            return res.status(400).json({
                success: false,
                message: 'Content and certificate ID are required',
            });
        }

        // Find content by certificate ID
        const registeredContent = await ContentEntryModel.findByCertificateId(certificate_id);

        if (!registeredContent) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found',
                data: {
                    is_registered: false,
                },
            });
        }

        // Verify ownership
        const verification = await verifyOwnership(content, registeredContent, req.user);

        res.json({
            success: true,
            message: 'Verification completed',
            data: {
                is_registered: true,
                certificate_id: registeredContent.certificate_id,
                title: registeredContent.title,
                owner: registeredContent.owner,
                registered_date: registeredContent.created_at,
                verification,
            },
        });
    } catch (error) {
        next(error);
    }
};

export default {
    registerContent,
    getUserContent,
    getContentById,
    deleteContent,
    verifyContentOwnership,
};
