import axios from 'axios';

/**
 * Split text into chunks
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
 * Check Plagiarism via SerpApi (Google Search)
 * Returns { score: 0-1, matches: [] }
 */
export async function checkTextPlagiarism(text) {
    if (!text || text.length < 10) return { score: 0, matches: [] };

    const apiKey = process.env.SERPAPI_KEY;
    console.log('🔑 SERPAPI_KEY loaded:', apiKey ? 'YES (length: ' + apiKey.length + ')' : 'NO');
    if (!apiKey) {
        console.warn("⚠️ No SERPAPI_KEY found. Falling back to mock 0%.");
        return { score: 0, matches: [] };
    }

    const chunks = splitIntoChunks(text);
    let totalMatches = 0;
    let allSources = [];
    let checkedChunks = 0;

    console.log(`🔎 Analyzing ${chunks.length} chunks via SerpApi (Real-Time)...`);

    for (const chunk of chunks) {
        try {
            const url = `https://serpapi.com/search.json`;
            const params = {
                q: `"${chunk}"`, // Exact match search
                api_key: apiKey,
                engine: 'google',
                num: 5 // Top 5 results
            };

            const { data } = await axios.get(url, { params });

            if (data.organic_results && data.organic_results.length > 0) {
                totalMatches++;
                checkedChunks++;

                // Map results
                const sources = data.organic_results.map(r => ({
                    title: r.title,
                    url: r.link,
                    snippet: r.snippet
                }));
                allSources.push(...sources);
            } else {
                checkedChunks++;
            }
        } catch (err) {
            console.error('SerpApi error for chunk:', chunk, err.message);
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

    return {
        score,
        matches: uniqueSources,
        checked_count: checkedChunks
    };
}

export default { checkTextPlagiarism };
