import express from 'express';
import { checkTextPlagiarism } from '../utils/webScraper.js';
import { searchYouTube } from '../utils/youtubeChecker.js';
import { checkImagePlagiarism } from '../utils/imageChecker.js';

const router = express.Router();

/**
 * Test endpoint to verify API integrations
 */
router.get('/test-apis', async (req, res) => {
    const results = {
        env_check: {
            serpapi: process.env.SERPAPI_KEY ? 'LOADED' : 'MISSING',
            youtube: process.env.YOUTUBE_API_KEY ? 'LOADED' : 'MISSING'
        },
        tests: {}
    };

    // Test Text Search
    try {
        const textResult = await checkTextPlagiarism("The quick brown fox jumps over the lazy dog");
        results.tests.text = {
            status: 'SUCCESS',
            score: textResult.score,
            matches: textResult.matches.length
        };
    } catch (e) {
        results.tests.text = { status: 'FAILED', error: e.message };
    }

    // Test YouTube Search
    try {
        const ytResult = await searchYouTube("test video");
        results.tests.youtube = {
            status: 'SUCCESS',
            score: ytResult.score,
            matches: ytResult.matches.length
        };
    } catch (e) {
        results.tests.youtube = { status: 'FAILED', error: e.message };
    }

    // Test Image Search
    try {
        const imgResult = await checkImagePlagiarism("test image");
        results.tests.image = {
            status: 'SUCCESS',
            score: imgResult.score,
            matches: imgResult.matches.length
        };
    } catch (e) {
        results.tests.image = { status: 'FAILED', error: e.message };
    }

    res.json(results);
});

export default router;
