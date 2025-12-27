import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentForm from '../components/ContentForm';
import api from '../utils/api';
import Loader from '../components/Loader';
import useToast from '../hooks/useToast';

const Detect = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleSubmit = async (data) => {
        console.log('🚀 handleSubmit called with data:', data);
        setLoading(true);

        try {
            let response;
            if (data.file) {
                console.log('📁 Handling media upload');
                // Handle Media Upload
                const formData = new FormData();
                formData.append('media', data.file);
                formData.append('title', data.title || '');
                formData.append('category_id', data.category_id || '');
                formData.append('content', data.content || ''); // can be empty for media

                response = await api.post('/detect', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                console.log('📝 Handling text submission');
                console.log('📝 Text content:', data.content?.substring(0, 100));
                // Handle Text Submission
                response = await api.post('/detect', data);
                console.log('✅ Full Response:', response);
                console.log('✅ Response data:', response.data);
                console.log('✅ Response data.data:', response.data?.data);
            }

            console.log('📦 Full response object:', JSON.stringify(response.data, null, 2));

            const detectionData = response?.data?.data;
            const detectionId = detectionData?.detection_id;
            console.log('🆔 Detection ID extracted:', detectionId);
            console.log('🆔 Type of detection ID:', typeof detectionId);

            if (detectionId && detectionData) {
                const targetPath = `/result/${detectionId}`;
                console.log('✅ Navigating to:', targetPath);
                navigate(targetPath, { state: { detectionData } });
            } else {
                console.error('❌ No detection ID found in response');
                console.error('❌ Response structure:', response.data);
                throw new Error('No detection ID returned from server');
            }
        } catch (error) {
            console.error('❌ Error in handleSubmit:', error);
            console.error('❌ Error response:', error.response);
            toast.error(error.response?.data?.message || 'Detection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loadingCategories) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-poppins font-bold mb-4">Copyright Risk Analysis</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Analyze text and video content for potential copyright similarity using real-world data
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        ⚠️ This tool provides risk assessment, not legal copyright proof
                    </p>
                </div>

                <div className="card">
                    <ContentForm
                        onSubmit={handleSubmit}
                        categories={categories}
                        loading={loading}
                    />
                </div>

                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-300">How it works:</h3>
                    <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
                        <li>📝 <strong>Text Analysis:</strong> Searches the web using Google Custom Search to find similar published content</li>
                        <li>🎥 <strong>Video Analysis:</strong> Searches YouTube database to identify potential matches or similar videos</li>
                        <li>📊 Results show similarity scores and source URLs for verification</li>
                        <li>💡 Get AI-powered insights and copyright risk recommendations</li>
                        <li>⚖️ <strong>Important:</strong> Results indicate similarity likelihood, not legal evidence</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Detect;
