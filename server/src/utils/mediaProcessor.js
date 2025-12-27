import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';
import path from 'path';

// Configure ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * Generate a perceptual hash (pHash) for an image buffer.
 * Algorithm: Resize to 32x32 -> Grayscale -> Mean hash
 * Returns a 64-character hex string.
 */
export async function generateImageHash(buffer) {
    try {
        // Resize to a small fixed size to remove high frequencies (details) and keep structure
        const size = 32;
        const processed = await sharp(buffer)
            .resize(size, size, { fit: 'fill' })
            .grayscale()
            .raw()
            .toBuffer();

        // Calculate mean pixel value
        let sum = 0;
        for (let i = 0; i < processed.length; i++) {
            sum += processed[i];
        }
        const mean = sum / processed.length;

        // Generate binary hash based on comparison with mean
        let binaryString = '';
        for (let i = 0; i < processed.length; i++) {
            binaryString += processed[i] >= mean ? '1' : '0';
        }

        // Convert binary string to hex for compact storage
        // A 32x32 image produces 1024 bits -> 256 hex chars
        // For simplicity and speed in this demo, let's use 8x8 -> 64 bits -> 16 hex chars (standard pHash size)
        // Re-doing for 8x8 which is standard pHash size

        return await generateSmallPHash(buffer);
    } catch (error) {
        console.error('Error generating image hash:', error);
        throw error;
    }
}

/**
 * Standard 8x8 DCT-based pHash implementation (Simplified to Mean Hash for MVP robustness without complex math libs)
 * 8x8 is standard for pHash
 */
async function generateSmallPHash(buffer) {
    const size = 8;
    const processed = await sharp(buffer)
        .resize(size, size, { fit: 'fill' })
        .grayscale()
        .raw()
        .toBuffer();

    let sum = 0;
    for (let i = 0; i < processed.length; i++) {
        sum += processed[i];
    }
    const mean = sum / processed.length;

    let binary = '';
    for (let i = 0; i < processed.length; i++) {
        binary += processed[i] >= mean ? '1' : '0';
    }

    // binary is 64 chars long
    // Convert to hex
    let hex = '';
    for (let i = 0; i < binary.length; i += 4) {
        const decimal = parseInt(binary.substr(i, 4), 2);
        hex += decimal.toString(16);
    }

    return hex;
}

/**
 * Calculate Hamming distance between two hex hashes
 * Returns number of differing bits
 */
export function calculateHammingDistance(hash1, hash2) {
    if (hash1.length !== hash2.length) return 64; // Max distance if lengths differ

    let distance = 0;
    // Walk through hex characters
    for (let i = 0; i < hash1.length; i++) {
        const val1 = parseInt(hash1[i], 16);
        const val2 = parseInt(hash2[i], 16);

        // XOR gives bits that are different
        let xor = val1 ^ val2;

        // Count set bits in xor result
        while (xor > 0) {
            distance += xor & 1;
            xor >>= 1;
        }
    }
    return distance;
}

/**
 * Calculate similarity score (0 to 1) from Hamming distance
 * Max distance for 64-bit hash is 64.
 */
export function getSimilarityFromHash(hash1, hash2) {
    const distance = calculateHammingDistance(hash1, hash2);
    // Usually < 5 is a match, < 10 is similar.
    // Score: 1.0 means identical.
    return Math.max(0, 1 - (distance / 64));
}

/**
 * Process a video file to extract key frames and generate their hashes.
 * Returns an array of hashes.
 */
export async function generateVideoFingerprint(videoPath, limit = 5) {
    return new Promise((resolve, reject) => {
        const screenshots = [];
        const hashes = [];
        const timestamp = Date.now();
        const outputDir = path.dirname(videoPath);

        // Get video duration first to determine sampling interval
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                console.error('Error checking video metadata:', err);
                // Fallback: just try to take 1 screenshot
            }

            const duration = metadata?.format?.duration || 10;
            // Take 'limit' screenshots spaced evenly
            const timestamps = [];
            for (let i = 1; i <= limit; i++) {
                timestamps.push((duration / (limit + 1)) * i);
            }

            ffmpeg(videoPath)
                .on('filenames', (filenames) => {
                    // console.log('Will generate ' + filenames.join(', '));
                    filenames.forEach(f => screenshots.push(path.join(outputDir, f)));
                })
                .on('end', async () => {
                    // console.log('Screenshots taken');
                    // Generate hashes for all screenshots
                    try {
                        for (const shotPath of screenshots) {
                            if (fs.existsSync(shotPath)) {
                                const buffer = fs.readFileSync(shotPath);
                                const hash = await generateImageHash(buffer);
                                hashes.push(hash);
                                // Clean up temp screenshot
                                fs.unlinkSync(shotPath);
                            }
                        }
                        resolve(hashes);
                    } catch (e) {
                        reject(e);
                    }
                })
                .on('error', (err) => {
                    console.error('Error processing video:', err);
                    reject(err);
                })
                .screenshots({
                    count: limit,
                    folder: outputDir,
                    filename: `temp_${timestamp}_%b.png`,
                    size: '128x?' // Resize to save processing time
                });
        });
    });
}
