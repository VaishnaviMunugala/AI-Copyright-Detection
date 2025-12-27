// import natural from 'natural'; // REMOVED due to install failure
import { generateHash, generateEmbedding } from './fingerprint.js';

// Simple Levenshtein Implementation (Custom)
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
}

/**
 * Calculate cosine similarity between two TF-IDF vectors
 */
export function cosineSimilarity(vec1, vec2) {
    const allTerms = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);

    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    allTerms.forEach(term => {
        const val1 = vec1[term] || 0;
        const val2 = vec2[term] || 0;

        dotProduct += val1 * val2;
        mag1 += val1 * val1;
        mag2 += val2 * val2;
    });

    if (mag1 === 0 || mag2 === 0) return 0;

    return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

/**
 * Calculate structural similarity using Levenshtein distance
 */
export function structuralSimilarity(text1, text2) {
    const maxLen = Math.max(text1.length, text2.length);
    if (maxLen === 0) return 1.0;

    const distance = levenshteinDistance(text1, text2);
    return 1 - (distance / maxLen);
}

/**
 * Calculate hash similarity (exact match)
 */
export function hashSimilarity(hash1, hash2) {
    return hash1 === hash2 ? 1.0 : 0.0;
}

/**
 * Calculate overall similarity score between input content and registered content
 */
export function calculateSimilarity(inputContent, registeredContent, weights = {}) {
    const {
        semantic_weight = 0.4,
        structural_weight = 0.3,
        hash_weight = 0.3,
    } = weights;

    // Generate fingerprints
    const inputHash = generateHash(inputContent);
    const inputEmbedding = generateEmbedding(inputContent);

    const registeredHash = registeredContent.fingerprint;
    const registeredEmbedding = registeredContent.embedding_vector;

    // Calculate individual similarities
    const hashScore = hashSimilarity(inputHash, registeredHash);
    const semanticScore = cosineSimilarity(inputEmbedding, registeredEmbedding);
    const structuralScore = structuralSimilarity(
        inputContent.toLowerCase().trim(),
        registeredContent.raw_content.toLowerCase().trim()
    );

    // Calculate weighted overall score
    const overallScore = (
        hashScore * hash_weight +
        semanticScore * semantic_weight +
        structuralScore * structural_weight
    );

    return {
        overall: Math.round(overallScore * 100) / 100,
        hash: Math.round(hashScore * 100) / 100,
        semantic: Math.round(semanticScore * 100) / 100,
        structural: Math.round(structuralScore * 100) / 100,
    };
}

/**
 * Determine match level based on similarity score and thresholds
 */
export function determineMatchLevel(score, thresholds) {
    // Default thresholds if not provided
    const defaults = {
        high: { min_score: 0.70, max_score: 1.00 },
        partial: { min_score: 0.30, max_score: 0.69 },
        original: { min_score: 0.00, max_score: 0.29 },
    };

    const thresholdMap = thresholds || defaults;

    if (score >= thresholdMap.high.min_score) {
        return 'High Match';
    } else if (score >= thresholdMap.partial.min_score) {
        return 'Partial Match';
    } else {
        return 'Original';
    }
}

/**
 * Find matching content from database
 */
export async function findMatches(inputContent, allRegisteredContent, thresholds) {
    const matches = [];

    for (const registered of allRegisteredContent) {
        const weights = {
            semantic_weight: thresholds?.semantic_weight || 0.4,
            structural_weight: thresholds?.structural_weight || 0.3,
            hash_weight: thresholds?.hash_weight || 0.3,
        };

        const similarity = calculateSimilarity(inputContent, registered, weights);

        if (similarity.overall > 0.1) { // Only include if there's some similarity
            matches.push({
                content_id: registered.id,
                title: registered.title,
                owner: registered.owner,
                category: registered.category,
                similarity_score: similarity.overall,
                breakdown: {
                    hash: similarity.hash,
                    semantic: similarity.semantic,
                    structural: similarity.structural,
                },
                certificate_id: registered.certificate_id,
            });
        }
    }

    // Sort by similarity score (highest first)
    matches.sort((a, b) => b.similarity_score - a.similarity_score);

    return matches;
}

/**
 * Perform complete similarity detection
 */
export async function performDetection(inputContent, allRegisteredContent, thresholdsConfig) {
    // Find all matches
    const matches = await findMatches(inputContent, allRegisteredContent, thresholdsConfig);

    // Calculate overall similarity score (highest match)
    const highestScore = matches.length > 0 ? matches[0].similarity_score : 0;

    // Determine match level
    const thresholdMap = {
        high: {
            min_score: thresholdsConfig?.high?.min_score || 0.70,
            max_score: thresholdsConfig?.high?.max_score || 1.00,
        },
        partial: {
            min_score: thresholdsConfig?.partial?.min_score || 0.30,
            max_score: thresholdsConfig?.partial?.max_score || 0.69,
        },
        original: {
            min_score: thresholdsConfig?.original?.min_score || 0.00,
            max_score: thresholdsConfig?.original?.max_score || 0.29,
        },
    };

    const matchLevel = determineMatchLevel(highestScore, thresholdMap);

    return {
        similarity_score: highestScore,
        match_level: matchLevel,
        matched_sources: matches.slice(0, 10), // Top 10 matches
        total_matches: matches.length,
    };
}

export default {
    cosineSimilarity,
    structuralSimilarity,
    hashSimilarity,
    calculateSimilarity,
    determineMatchLevel,
    findMatches,
    performDetection,
};
