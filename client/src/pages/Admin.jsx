import { useState, useEffect } from 'react';
import api from '../utils/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import useToast from '../hooks/useToast';

const Admin = () => {
    const [analytics, setAnalytics] = useState(null);
    const [thresholds, setThresholds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const toast = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [analyticsRes, thresholdsRes, categoriesRes] = await Promise.all([
                api.get('/admin/analytics/overview'),
                api.get('/admin/thresholds'),
                api.get('/admin/categories'),
            ]);

            setAnalytics(analyticsRes.data.data);
            setThresholds(thresholdsRes.data.data);
            setCategories(categoriesRes.data.data);
        } catch (error) {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateThreshold = async (id, updates) => {
        try {
            await api.put(`/admin/thresholds/${id}`, updates);
            toast.success('Threshold updated successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to update threshold');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await api.delete(`/admin/categories/${id}`);
            toast.success('Category deleted successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-poppins font-bold mb-8">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'overview'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-600 dark:text-gray-400 hover:text-primary'
                        }`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('thresholds')}
                    className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'thresholds'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-600 dark:text-gray-400 hover:text-primary'
                        }`}
                >
                    Thresholds
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'categories'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-600 dark:text-gray-400 hover:text-primary'
                        }`}
                >
                    Categories
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && analytics && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                            <p className="text-3xl font-bold text-primary">{analytics.overview.total_users}</p>
                        </Card>
                        <Card>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Registered Content</p>
                            <p className="text-3xl font-bold text-secondary">{analytics.overview.total_content}</p>
                        </Card>
                        <Card>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Detections</p>
                            <p className="text-3xl font-bold text-purple-600">{analytics.overview.total_detections}</p>
                        </Card>
                        <Card>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Categories</p>
                            <p className="text-3xl font-bold text-orange-600">{analytics.overview.total_categories}</p>
                        </Card>
                    </div>

                    <Card>
                        <h3 className="text-xl font-poppins font-semibold mb-4">Recent Activity (Last 7 Days)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Detections</p>
                                <p className="text-2xl font-bold">{analytics.recent_activity.detections_last_7_days}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Average Similarity Score</p>
                                <p className="text-2xl font-bold">{(analytics.recent_activity.average_similarity_score * 100).toFixed(1)}%</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-xl font-poppins font-semibold mb-4">Match Level Distribution</h3>
                        <div className="space-y-3">
                            {Object.entries(analytics.recent_activity.match_level_distribution).map(([level, count]) => (
                                <div key={level}>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium">{level}</span>
                                        <span className="text-gray-600 dark:text-gray-400">{count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${level === 'High Match' ? 'bg-red-500' :
                                                    level === 'Partial Match' ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            style={{
                                                width: `${(count / analytics.recent_activity.detections_last_7_days * 100) || 0}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {/* Thresholds Tab */}
            {activeTab === 'thresholds' && (
                <div className="space-y-4">
                    {thresholds.map((threshold) => (
                        <Card key={threshold.id}>
                            <h3 className="text-xl font-semibold mb-4 capitalize">{threshold.threshold_type} Match</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Min Score</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        defaultValue={threshold.min_score}
                                        className="input"
                                        onBlur={(e) => handleUpdateThreshold(threshold.id, { min_score: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Max Score</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        defaultValue={threshold.max_score}
                                        className="input"
                                        onBlur={(e) => handleUpdateThreshold(threshold.id, { max_score: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Semantic Weight</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        defaultValue={threshold.semantic_weight}
                                        className="input"
                                        onBlur={(e) => handleUpdateThreshold(threshold.id, { semantic_weight: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Structural Weight</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        defaultValue={threshold.structural_weight}
                                        className="input"
                                        onBlur={(e) => handleUpdateThreshold(threshold.id, { structural_weight: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Hash Weight</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        defaultValue={threshold.hash_weight}
                                        className="input"
                                        onBlur={(e) => handleUpdateThreshold(threshold.id, { hash_weight: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <div className="space-y-4">
                    {categories.map((category) => (
                        <Card key={category.id} className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">{category.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                            </div>
                            <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="btn btn-outline text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 text-sm"
                            >
                                Delete
                            </button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Admin;
