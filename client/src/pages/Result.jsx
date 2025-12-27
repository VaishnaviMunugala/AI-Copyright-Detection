import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import Loader from '../components/Loader';
import ResultCard from '../components/ResultCard';
import AIInsightsPanel from '../components/AIInsightsPanel';
import Button from '../components/Button';
import { copyToClipboard } from '../utils/helpers';
import useToast from '../hooks/useToast';

const Result = () => {
    const { id } = useParams();
    const location = useLocation();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        // Check if data was passed via navigation state
        if (location.state?.detectionData) {
            console.log('✅ Using detection data from navigation state');
            setResult(location.state.detectionData);
            setLoading(false);
        } else {
            // Fallback to fetching from API
            console.log('⚠️ No state data, fetching from API');
            fetchResult();
        }
    }, [id, location.state]);

    const fetchResult = async () => {
        try {
            const response = await api.get(`/detection/${id}`);
            setResult(response.data.data);
        } catch (error) {
            toast.error('Failed to load detection result');
            navigate('/detect');
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        const success = await copyToClipboard(url);
        if (success) {
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Result not found</h2>
                    <Link to="/detect">
                        <Button>Back to Detection</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-poppins font-bold">Detection Results</h1>
                    <div className="flex space-x-3">
                        <Button variant="outline" onClick={handleShare}>
                            {copied ? 'Copied!' : 'Share Result'}
                        </Button>
                        <Link to="/detect">
                            <Button variant="outline">New Detection</Button>
                        </Link>
                    </div>
                </div>

                <div className="space-y-8">
                    <ResultCard result={result} />
                    <AIInsightsPanel insights={result.insights} risk={result.risk} />
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Want to protect your own content?
                    </p>
                    <Link to="/register">
                        <Button>Register Your Content</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Result;
