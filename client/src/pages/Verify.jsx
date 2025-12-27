import { useState, useEffect } from 'react';
import api from '../utils/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import useToast from '../hooks/useToast';

const Verify = () => {
    const [formData, setFormData] = useState({ content: '', certificate_id: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const response = await api.post('/content/verify', formData);
            setResult(response.data.data);
            toast.success('Verification completed');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-poppins font-bold mb-4">Ownership Verification</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Verify the authenticity and ownership of registered content
                    </p>
                </div>

                <Card className="mb-8">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Certificate ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="certificate_id"
                                value={formData.certificate_id}
                                onChange={handleChange}
                                placeholder="CERT-XXXXXXXXXX"
                                required
                                className="input"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">
                                Content to Verify <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Paste the content you want to verify..."
                                rows={10}
                                required
                                className="input resize-none custom-scrollbar"
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Verifying...' : 'Verify Ownership'}
                        </Button>
                    </form>
                </Card>

                {loading && (
                    <div className="flex justify-center">
                        <Loader size="lg" />
                    </div>
                )}

                {result && (
                    <Card className="animate-fadeIn">
                        <h2 className="text-2xl font-poppins font-bold mb-6">Verification Result</h2>

                        {result.is_registered ? (
                            <>
                                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-lg font-semibold text-green-800 dark:text-green-300">
                                            Certificate Found
                                        </span>
                                    </div>
                                    <p className="text-green-700 dark:text-green-400">
                                        This content is registered in our system
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Title</p>
                                        <p className="font-semibold">{result.title}</p>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Registered Owner</p>
                                        <p className="font-semibold">{result.owner?.name}</p>
                                        <p className="text-sm text-gray-500">{result.owner?.email}</p>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Registration Date</p>
                                        <p className="font-semibold">{new Date(result.registered_date).toLocaleDateString()}</p>
                                    </div>

                                    {result.verification && (
                                        <div className={`p-4 rounded-lg ${result.verification.is_owner
                                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                            : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                                            }`}>
                                            <p className="text-sm font-semibold mb-2">
                                                Ownership Status: {result.verification.is_owner ? 'Verified' : 'Not Verified'}
                                            </p>
                                            <p className="text-sm mb-2">
                                                Confidence Score: {result.verification.confidence_score}%
                                            </p>
                                            <p className="text-sm">{result.verification.recommendation}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <svg className="w-6 h-6 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                                        Certificate Not Found
                                    </span>
                                </div>
                                <p className="text-yellow-700 dark:text-yellow-400">
                                    The provided certificate ID was not found in our system. Please verify the ID and try again.
                                </p>
                            </div>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Verify;
