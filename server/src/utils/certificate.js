import dayjs from 'dayjs';

/**
 * Generate certificate metadata
 */
export function generateCertificateMetadata(contentEntry) {
    return {
        certificate_id: contentEntry.certificate_id,
        title: contentEntry.title,
        owner: {
            name: contentEntry.owner?.name || 'Unknown',
            email: contentEntry.owner?.email || 'Unknown',
        },
        category: contentEntry.category?.name || 'Uncategorized',
        fingerprint: contentEntry.fingerprint,
        registration_date: dayjs(contentEntry.created_at).format('MMMM D, YYYY [at] h:mm A'),
        timestamp: contentEntry.created_at,
        verification_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify?cert=${contentEntry.certificate_id}`,
    };
}

/**
 * Validate certificate authenticity
 */
export function validateCertificate(certificate, storedContent) {
    const validation = {
        is_valid: false,
        issues: [],
        confidence_score: 0,
    };

    // Check if certificate exists
    if (!storedContent) {
        validation.issues.push('Certificate ID not found in database');
        return validation;
    }

    // Check certificate ID match
    if (certificate.certificate_id !== storedContent.certificate_id) {
        validation.issues.push('Certificate ID mismatch');
    }

    // Check fingerprint match
    if (certificate.fingerprint !== storedContent.fingerprint) {
        validation.issues.push('Content fingerprint mismatch - content may have been altered');
    }

    // Check timestamp validity
    const certDate = new Date(certificate.timestamp);
    const storedDate = new Date(storedContent.created_at);

    if (Math.abs(certDate - storedDate) > 1000) { // Allow 1 second difference
        validation.issues.push('Timestamp mismatch');
    }

    // Calculate confidence score
    if (validation.issues.length === 0) {
        validation.is_valid = true;
        validation.confidence_score = 100;
    } else {
        validation.confidence_score = Math.max(0, 100 - (validation.issues.length * 25));
    }

    return validation;
}

/**
 * Generate ownership verification result
 */
export async function verifyOwnership(inputContent, registeredContent, userClaim) {
    const verification = {
        is_owner: false,
        confidence_score: 0,
        evidence: [],
        recommendation: '',
    };

    // Check if user matches registered owner
    if (userClaim && registeredContent.owner_id === userClaim.user_id) {
        verification.is_owner = true;
        verification.confidence_score = 95;
        verification.evidence.push('User ID matches registered owner');
    }

    // Check content fingerprint match
    const { generateHash } = await import('./fingerprint.js');
    const inputHash = generateHash(inputContent);

    if (inputHash === registeredContent.fingerprint) {
        verification.confidence_score = Math.min(100, verification.confidence_score + 50);
        verification.evidence.push('Content fingerprint exact match');
    }

    // Generate recommendation
    if (verification.is_owner && verification.confidence_score >= 90) {
        verification.recommendation = 'Ownership verified with high confidence. You are the registered owner of this content.';
    } else if (verification.confidence_score >= 50) {
        verification.recommendation = 'Partial ownership evidence found. Additional verification may be required.';
    } else {
        verification.recommendation = 'Ownership cannot be verified. This content may belong to another creator.';
    }

    return verification;
}

/**
 * Format certificate for download/display
 */
export function formatCertificate(metadata) {
    return {
        ...metadata,
        formatted_text: `
╔════════════════════════════════════════════════════════════════╗
║          CERTIFICATE OF CONTENT OWNERSHIP                      ║
╚════════════════════════════════════════════════════════════════╝

Certificate ID: ${metadata.certificate_id}
Title: ${metadata.title}
Owner: ${metadata.owner.name}
Email: ${metadata.owner.email}
Category: ${metadata.category}

Registration Date: ${metadata.registration_date}
Fingerprint: ${metadata.fingerprint.substring(0, 32)}...

This certificate serves as proof of content registration and 
ownership claim. The cryptographic fingerprint ensures content
authenticity and tamper detection.

Verification URL: ${metadata.verification_url}

═══════════════════════════════════════════════════════════════
This is an official certificate issued by the AI Copyright 
Detection & Owner Verification System.
═══════════════════════════════════════════════════════════════
    `.trim(),
    };
}

export default {
    generateCertificateMetadata,
    validateCertificate,
    verifyOwnership,
    formatCertificate,
};
