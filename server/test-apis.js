// Test script to verify Google Custom Search and YouTube APIs
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Testing API Configuration...\n');

// Test 1: Google Custom Search API
async function testGoogleSearch() {
    console.log('📝 Testing Google Custom Search API...');
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

    console.log('  API Key:', apiKey ? '✅ Loaded' : '❌ Missing');
    console.log('  CX ID:', cx ? '✅ Loaded' : '❌ Missing');

    if (!apiKey || !cx) {
        console.log('  ❌ Configuration incomplete\n');
        return false;
    }

    try {
        const url = 'https://www.googleapis.com/customsearch/v1';
        const params = {
            key: apiKey,
            cx: cx,
            q: '"The quick brown fox"',
            num: 3
        };

        const { data } = await axios.get(url, { params });

        if (data.items && data.items.length > 0) {
            console.log(`  ✅ SUCCESS - Found ${data.items.length} results`);
            console.log(`  First result: ${data.items[0].title}`);
            console.log(`  URL: ${data.items[0].link}\n`);
            return true;
        } else {
            console.log('  ⚠️ No results found\n');
            return false;
        }
    } catch (error) {
        console.log('  ❌ FAILED:', error.response?.data?.error?.message || error.message);
        console.log('  Status:', error.response?.status);
        console.log();
        return false;
    }
}

// Test 2: YouTube Data API
async function testYouTubeAPI() {
    console.log('🎥 Testing YouTube Data API...');
    const apiKey = process.env.YOUTUBE_API_KEY;

    console.log('  API Key:', apiKey ? '✅ Loaded' : '❌ Missing');

    if (!apiKey) {
        console.log('  ❌ Configuration incomplete\n');
        return false;
    }

    try {
        const url = 'https://www.googleapis.com/youtube/v3/search';
        const params = {
            part: 'snippet',
            q: 'test video',
            type: 'video',
            maxResults: 3,
            key: apiKey
        };

        const { data } = await axios.get(url, { params });

        if (data.items && data.items.length > 0) {
            console.log(`  ✅ SUCCESS - Found ${data.items.length} results`);
            console.log(`  First result: ${data.items[0].snippet.title}`);
            console.log(`  Channel: ${data.items[0].snippet.channelTitle}\n`);
            return true;
        } else {
            console.log('  ⚠️ No results found\n');
            return false;
        }
    } catch (error) {
        console.log('  ❌ FAILED:', error.response?.data?.error?.message || error.message);
        console.log('  Status:', error.response?.status);
        console.log();
        return false;
    }
}

// Run tests
(async () => {
    const googleOk = await testGoogleSearch();
    const youtubeOk = await testYouTubeAPI();

    console.log('📊 Summary:');
    console.log('  Google Custom Search:', googleOk ? '✅ Working' : '❌ Failed');
    console.log('  YouTube Data API:', youtubeOk ? '✅ Working' : '❌ Failed');

    if (googleOk && youtubeOk) {
        console.log('\n🎉 All APIs are configured correctly!');
        process.exit(0);
    } else {
        console.log('\n⚠️ Some APIs failed. Check configuration.');
        process.exit(1);
    }
})();
