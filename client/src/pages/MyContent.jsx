import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import { formatRelativeTime, truncateText } from '../utils/helpers';
import usePagination from '../hooks/usePagination';
import useToast from '../hooks/useToast';

const MyContent = () => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const { page, limit, offset, nextPage, prevPage } = usePagination();
    const toast = useToast();

    useEffect(() => {
        fetchContent();
    }, [page]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/content/user?limit=${limit}&offset=${offset}`);
            setContent(response.data.data.content);
            setTotalCount(response.data.data.pagination.total);
        } catch (error) {
            toast.error('Failed to load content');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this content?')) return;

        try {
            await api.delete(`/content/${id}`);
            toast.success('Content deleted successfully');
            fetchContent();
        } catch (error) {
            toast.error('Failed to delete content');
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
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-poppins font-bold mb-2">My Registered Content</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {totalCount} {totalCount === 1 ? 'item' : 'items'} registered
                        </p>
                    </div>
                    <Link to="/detect">
                        <button className="btn btn-primary">Register New Content</button>
                    </Link>
                </div>

                {content.length === 0 ? (
                    <Card className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold mb-2">No content registered yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Start protecting your intellectual property by registering your first content
                        </p>
                        <Link to="/detect">
                            <button className="btn btn-primary">Register Content</button>
                        </Link>
                    </Card>
                ) : (
                    <>
                        <div className="space-y-4">
                            {content.map((item) => (
                                <Card key={item.id} className="hover:shadow-xl transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                                                {truncateText(item.preview, 150)}
                                            </p>
                                            <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                    {item.category?.name || 'Uncategorized'}
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {formatRelativeTime(item.created_at)}
                                                </span>
                                                <span className="flex items-center font-mono text-xs">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    {item.certificate_id}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-2 ml-4">
                                            <Link to={`/content/${item.id}`}>
                                                <button className="btn btn-outline btn-sm px-4 py-2 text-sm">
                                                    View
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="btn btn-outline text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 btn-sm px-4 py-2 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {totalCount > limit && (
                            <Pagination
                                page={page}
                                totalPages={Math.ceil(totalCount / limit)}
                                onPageChange={(newPage) => {
                                    if (newPage > page) nextPage();
                                    else prevPage();
                                }}
                                hasMore={offset + content.length < totalCount}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyContent;
