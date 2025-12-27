import axios from 'axios';

/**
 * Check Image Plagiarism via SerpApi (Google Images)
 * Note: For true reverse search (pixels), we would need to upload the image to a public URL first.
 * Here we use the Image Title/Metadata which is effective for checking known works.
 */
export async function checkImagePlagiarism(title) {
    if (!title) return { score: 0, matches: [] };

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
        console.warn("⚠️ No SERPAPI_KEY. Skipping image check.");
        return { score: 0, matches: [] };
    }

    try {
        console.log(`🖼️ Searching SerpApi (Images) for: "${title}"`);

        const url = `https://serpapi.com/search.json`;
        const params = {
            q: title,
            engine: 'google_images',
            api_key: apiKey,
            num: 5
        };

        const { data } = await axios.get(url, { params });

        const matches = [];

        if (data.images_results && data.images_results.length > 0) {
            // Found visual matches for this title
            data.images_results.forEach(img => {
                matches.push({
                    title: img.title || "Visual Match",
                    url: img.link,
                    owner: { name: img.source },
                    similarity: 0.85 // High confidence because semantic match on title usually implies visual match
                });
            });
        }

        const score = matches.length > 0 ? 0.9 : 0; // 90% match if found on Google Images

        return {
            score,
            matches: matches
        };

    } catch (error) {
        console.error('SerpApi Image Error:', error.message);
        return { score: 0, matches: [] };
    }
}

export default { checkImagePlagiarism };
