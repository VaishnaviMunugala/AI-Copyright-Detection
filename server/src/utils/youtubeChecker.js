import axios from 'axios';

/**
 * Search YouTube using Verified API V3
 */
export async function searchYouTube(title) {
    if (!title) return { score: 0, matches: [] };

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.warn("⚠️ No YOUTUBE_API_KEY found. Real analysis skipped.");
        return { score: 0, matches: [] };
    }

    try {
        console.log(`🎥 Searching YouTube (API) for: "${title}"`);

        const url = `https://www.googleapis.com/youtube/v3/search`;
        const params = {
            part: 'snippet',
            q: title,
            type: 'video',
            maxResults: 5,
            key: apiKey
        };

        const { data } = await axios.get(url, { params });

        const matches = [];
        let totalSimilarity = 0;
        let matchCount = 0;

        if (data.items && data.items.length > 0) {
            console.log(`✅ Found ${data.items.length} YouTube results`);

            // Analyze each result for similarity
            data.items.forEach(item => {
                const itemTitle = item.snippet.title.toLowerCase();
                const searchTitle = title.toLowerCase();

                // Calculate similarity score for this result
                let similarity = 0;

                // Exact match
                if (itemTitle === searchTitle) {
                    similarity = 1.0;
                }
                // One contains the other
                else if (itemTitle.includes(searchTitle)) {
                    similarity = 0.9;
                }
                else if (searchTitle.includes(itemTitle)) {
                    similarity = 0.85;
                }
                // Check for word overlap
                else {
                    const searchWords = searchTitle.split(/\s+/).filter(w => w.length > 3);
                    const itemWords = itemTitle.split(/\s+/).filter(w => w.length > 3);
                    const commonWords = searchWords.filter(w => itemWords.includes(w));

                    if (commonWords.length > 0) {
                        similarity = (commonWords.length / Math.max(searchWords.length, itemWords.length)) * 0.7;
                    } else {
                        similarity = 0.1; // Minimal similarity if found in search but no word overlap
                    }
                }

                totalSimilarity += similarity;
                matchCount++;

                matches.push({
                    title: item.snippet.title,
                    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                    owner: { name: item.snippet.channelTitle },
                    thumbnail: item.snippet.thumbnails?.default?.url,
                    similarity: similarity
                });
            });
        }

        // Calculate average similarity score
        const matchScore = matchCount > 0 ? totalSimilarity / matchCount : 0;

        console.log(`📊 YouTube Analysis: ${matchCount} matches, Average similarity: ${(matchScore * 100).toFixed(1)}%`);

        return {
            score: matchScore,
            matches: matches
        };

    } catch (error) {
        console.error('YouTube API Error:', error.response?.data?.error?.message || error.message);
        return { score: 0, matches: [] };
    }
}

export default { searchYouTube };
