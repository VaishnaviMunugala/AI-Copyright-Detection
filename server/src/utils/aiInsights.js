/**
 * Generate AI-powered insights and recommendations based on detection results
 */
export function generateInsights(detectionResult) {
    const { similarity_score, match_level, matched_sources } = detectionResult;

    const insights = {
        summary: '',
        risk_level: '',
        recommendations: [],
        highlighted_sections: [],
        source_analysis: [],
    };

    // Determine risk level
    if (similarity_score >= 0.70) {
        insights.risk_level = 'High';
        insights.summary = `This content shows a high similarity (${(similarity_score * 100).toFixed(1)}%) to ${matched_sources.length} registered work(s). There is significant risk of copyright infringement.`;
    } else if (similarity_score >= 0.30) {
        insights.risk_level = 'Medium';
        insights.summary = `This content shows moderate similarity (${(similarity_score * 100).toFixed(1)}%) to existing works. Some elements may be derivative or inspired by registered content.`;
    } else {
        insights.risk_level = 'Low';
        insights.summary = `This content appears to be largely original with minimal similarity (${(similarity_score * 100).toFixed(1)}%) to registered works.`;
    }

    // Generate recommendations based on match level
    if (match_level === 'High Match') {
        insights.recommendations = [
            '⚠️ Immediate Action Required: This content closely matches existing registered work',
            '📋 Review the matched sources to verify if you have proper authorization',
            '⚖️ Consider consulting with a legal professional regarding potential copyright issues',
            '✍️ If this is your original work, register it immediately to establish ownership',
            '🔍 Document any evidence of independent creation or prior art',
        ];
    } else if (match_level === 'Partial Match') {
        insights.recommendations = [
            '⚠️ Caution Advised: Moderate similarity detected with existing content',
            '📝 Review matched sections and consider revising or citing sources appropriately',
            '✅ If using ideas from other works, ensure proper attribution and fair use',
            '🔐 Consider registering your work to protect your original contributions',
            '📊 Monitor for future unauthorized use of your content',
        ];
    } else {
        insights.recommendations = [
            '✅ Content appears original - consider registering to protect your intellectual property',
            '🔐 Generate an ownership certificate to establish creation timestamp',
            '💡 Add watermarks or metadata to help track your content online',
            '📢 Share your certificate ID when publishing to establish provenance',
            '🔄 Periodically check for unauthorized use of your content',
        ];
    }

    // Analyze top matches
    if (matched_sources.length > 0) {
        insights.source_analysis = matched_sources.slice(0, 5).map((source, index) => {
            const percentage = (source.similarity_score * 100).toFixed(1);
            return {
                rank: index + 1,
                title: source.title,
                owner: source.owner?.name || 'Unknown',
                similarity: `${percentage}%`,
                breakdown: {
                    semantic: `${(source.breakdown.semantic * 100).toFixed(1)}%`,
                    structural: `${(source.breakdown.structural * 100).toFixed(1)}%`,
                    hash: source.breakdown.hash === 1 ? 'Exact Match' : 'No Match',
                },
                certificate_id: source.certificate_id,
                analysis: generateSourceAnalysis(source.similarity_score, source.breakdown),
            };
        });
    }

    // Generate explanation
    insights.explanation = generateExplanation(similarity_score, match_level, matched_sources.length);

    return insights;
}

/**
 * Generate detailed explanation for the detection result
 */
function generateExplanation(score, matchLevel, matchCount) {
    const percentage = (score * 100).toFixed(1);

    let explanation = `Our AI-powered similarity engine analyzed your content using a hybrid approach combining semantic analysis, structural comparison, and cryptographic fingerprinting. `;

    if (matchLevel === 'High Match') {
        explanation += `The analysis detected a ${percentage}% similarity score, indicating a HIGH MATCH with ${matchCount} registered work(s). `;
        explanation += `This suggests substantial overlap in content, structure, or exact phrasing. The high similarity could indicate: `;
        explanation += `(1) Direct copying or plagiarism, (2) Derivative work without proper attribution, or (3) Your own previously registered content. `;
        explanation += `We recommend immediate verification of ownership rights and consultation with legal counsel if needed.`;
    } else if (matchLevel === 'Partial Match') {
        explanation += `The analysis detected a ${percentage}% similarity score, indicating a PARTIAL MATCH with ${matchCount} work(s). `;
        explanation += `This suggests some shared elements, themes, or structural similarities. Common causes include: `;
        explanation += `(1) Inspiration from existing works, (2) Common industry terminology or patterns, (3) Coincidental similarities, or (4) Proper citation of sources. `;
        explanation += `Review the matched sources to ensure proper attribution and fair use compliance.`;
    } else {
        explanation += `The analysis detected a ${percentage}% similarity score, indicating ORIGINAL content with minimal overlap. `;
        explanation += `Your content appears to be largely unique and independently created. `;
        explanation += `We recommend registering this content to establish ownership and protect your intellectual property rights. `;
        explanation += `A certificate of ownership will provide timestamped proof of creation and help in any future disputes.`;
    }

    return explanation;
}

/**
 * Generate analysis for individual source match
 */
function generateSourceAnalysis(score, breakdown) {
    if (breakdown.hash === 1) {
        return 'Exact cryptographic match detected - content is identical';
    } else if (score >= 0.80) {
        return 'Very high similarity across semantic and structural dimensions';
    } else if (score >= 0.60) {
        return 'Significant similarity in content structure and meaning';
    } else if (score >= 0.40) {
        return 'Moderate similarity - shared themes or partial overlap';
    } else {
        return 'Minor similarity - likely coincidental or common elements';
    }
}

/**
 * Generate copyright risk assessment
 */
export function assessCopyrightRisk(similarity_score, match_level) {
    const risk = {
        level: '',
        score: 0,
        factors: [],
        mitigation: [],
    };

    if (match_level === 'High Match') {
        risk.level = 'Critical';
        risk.score = Math.min(95, 70 + (similarity_score * 30));
        risk.factors = [
            'High similarity score indicates substantial copying',
            'Multiple exact or near-exact matches detected',
            'Potential for copyright infringement claims',
            'Risk of legal action or DMCA takedown',
        ];
        risk.mitigation = [
            'Verify ownership and authorization immediately',
            'Document independent creation if applicable',
            'Seek legal counsel before publication',
            'Consider substantial revision or removal',
        ];
    } else if (match_level === 'Partial Match') {
        risk.level = 'Moderate';
        risk.score = Math.min(65, 30 + (similarity_score * 50));
        risk.factors = [
            'Moderate similarity suggests derivative elements',
            'Some shared content or structural patterns',
            'Potential fair use or citation issues',
        ];
        risk.mitigation = [
            'Review and add proper citations if needed',
            'Ensure compliance with fair use guidelines',
            'Consider adding original commentary or analysis',
            'Document sources and inspiration',
        ];
    } else {
        risk.level = 'Low';
        risk.score = Math.min(25, similarity_score * 50);
        risk.factors = [
            'Minimal similarity to existing works',
            'Content appears largely original',
            'Low risk of copyright issues',
        ];
        risk.mitigation = [
            'Register content to protect ownership',
            'Add copyright notices and metadata',
            'Monitor for unauthorized use',
        ];
    }

    return risk;
}

export default {
    generateInsights,
    assessCopyrightRisk,
};
