// import natural from 'natural'; // REMOVED
import crypto from 'crypto';

// const TfIdf = natural.TfIdf; // REMOVED

/**
 * Generate a SHA-256 hash fingerprint for content
 */
export function generateHash(content) {
    return crypto
        .createHash('sha256')
        .update(content.trim().toLowerCase())
        .digest('hex');
}

/**
 * Generate TF-IDF embedding vector for content (Simplified to Term Frequency)
 */
export function generateEmbedding(content) {
    const terms = {};
    if (!content) return terms;

    // Simple tokenizer
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const totalWords = words.length;

    // Calculate simple Term Frequency
    words.forEach(word => {
        if (word.length > 2) { // Skip short words
            terms[word] = (terms[word] || 0) + 1;
        }
    });

    // Normalize (simple TF)
    Object.keys(terms).forEach(term => {
        terms[term] = terms[term] / totalWords;
    });

    return terms;
}

/**
 * Generate a complete fingerprint for content
 * Returns both hash and embedding vector
 */
export function generateFingerprint(content) {
    if (!content || typeof content !== 'string') {
        throw new Error('Content must be a non-empty string');
    }

    const hash = generateHash(content);
    const embedding = generateEmbedding(content);

    return {
        hash,
        embedding,
    };
}

/**
 * Generate a unique certificate ID
 */
export function generateCertificateId() {
    const timestamp = Date.now().toString(36);
    const randomStr = crypto.randomBytes(8).toString('hex');
    return `CERT-${timestamp}-${randomStr}`.toUpperCase();
}

/**
 * Validate fingerprint structure
 */
export function validateFingerprint(fingerprint) {
    return (
        fingerprint &&
        typeof fingerprint === 'object' &&
        typeof fingerprint.hash === 'string' &&
        typeof fingerprint.embedding === 'object'
    );
}

export default {
    generateHash,
    generateEmbedding,
    generateFingerprint,
    generateCertificateId,
    validateFingerprint,
};
