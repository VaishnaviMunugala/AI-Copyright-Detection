import axios from 'axios';

/**
 * Google Custom Search API Integration
 * For text plagiarism/copyright detection
 */

/**
 * Split text into searchable chunks
 */
function splitIntoChunks(text, minLength = 30) {
    const sentences = text.split(/[.?!]+/).map(s => s.trim()).filter(s => s.length > minLength);
    if (sentences.length === 0 && text.length > 10) return [text];

    // Pick up to 3 random sentences to check
    const chunks = [];
    const usedIndices = new Set();
    while (chunks.length < 3 && usedIndices.size < sentences.length) {
        const idx = Math.floor(Math.random() * sentences.length);
        if (!usedIndices.has(idx)) {
            usedIndices.add(idx);
            chunks.push(sentences[idx]);
        }
    }
    return chunks;
}

/**
 * Check Text Plagiarism via Google Custom Search API
 * Returns { score: 0-1, matches: [] }
 */
export async function checkTextPlagiarism(text) {
    if (!text || text.length < 10) return { score: 0, matches: [] };

    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    console.log('🔑 Google Search API Key exists:', !!apiKey);
    console.log('🔑 Search Engine ID exists:', !!searchEngineId);

    if (!apiKey || !searchEngineId) {
        console.warn("⚠️ Google Custom Search not configured. Returning 0%.");
        return { score: 0, matches: [] };
    }

    const chunks = splitIntoChunks(text);
    let totalMatches = 0;
    let allSources = [];
    let checkedChunks = 0;

    console.log(`🔎 Analyzing ${chunks.length} chunks via Google Custom Search API...`);

    for (const chunk of chunks) {
        try {
            const url = `https://www.googleapis.com/customsearch/v1`;
            const params = {
                key: apiKey,
                cx: searchEngineId,
                q: `"${chunk}"`, // Exact match search
                num: 5 // Top 5 results
            };

            const { data } = await axios.get(url, { params });

            if (data.items && data.items.length > 0) {
                totalMatches++;
                checkedChunks++;

                // Map results
                const sources = data.items.map(item => ({
                    title: item.title,
                    url: item.link,
                    snippet: item.snippet
                }));
                allSources.push(...sources);
            } else {
                checkedChunks++;
            }
        } catch (err) {
            console.error('Google Search API error for chunk:', chunk.substring(0, 50) + '...', err.response?.data?.error || err.message);
            checkedChunks++;
        }
    }

    let score = 0;
    if (checkedChunks > 0) {
        score = totalMatches / checkedChunks;
    }

    // Deduplicate
    const uniqueSources = [];
    const urls = new Set();
    allSources.forEach(s => {
        if (!urls.has(s.url)) {
            urls.add(s.url);
            uniqueSources.push(s);
        }
    });

    console.log(`✅ Text Analysis Complete - Score: ${(score * 100).toFixed(1)}%, Matches: ${uniqueSources.length}`);

    return {
        score,
        matches: uniqueSources,
        checked_count: checkedChunks
    };
}

export default { checkTextPlagiarism };
