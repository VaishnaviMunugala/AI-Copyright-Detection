import { useState } from 'react';
import Button from './Button';

const ContentForm = ({ onSubmit, categories, loading }) => {
    const [activeTab, setActiveTab] = useState('text'); // text, image, video
    const [formData, setFormData] = useState({
        content: '',
        title: '',
        category_id: '',
    });
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Prepare data based on tab
        if (activeTab === 'text') {
            onSubmit(formData);
        } else {
            // For media, we need to pass the file and metadata
            // processing will happen in parent or helper
            onSubmit({ ...formData, file, type: activeTab });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <form onSubmit={handleSubmit} action="javascript:void(0)" className="space-y-6">
            {/* Input Type Tabs */}
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                <button
                    type="button"
                    onClick={() => setActiveTab('text')}
                    className={`pb-2 px-4 transition-colors font-medium ${activeTab === 'text' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    📝 Text
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('video')}
                    className={`pb-2 px-4 transition-colors font-medium ${activeTab === 'video' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    🎥 Video
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Title (Optional)
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a title for your content"
                    className="input"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Category (Optional)
                </label>
                <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="input"
                >
                    <option value="">Select a category</option>
                    {categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Dynamic Input Field Based on Tab */}
            {activeTab === 'text' ? (
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Paste or type your content here..."
                        rows={12}
                        required
                        className="input resize-none custom-scrollbar"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {formData.content.length} characters
                    </p>
                </div>
            ) : (
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Upload {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            required
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center pointer-events-none">
                            <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            {file ? (
                                <p className="text-sm font-medium text-primary break-all">{file.name}</p>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Click or drag to upload video
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        MP4, AVI, MOV, WebM up to 500MB
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Button
                type="submit"
                disabled={loading || (activeTab === 'text' ? !formData.content.trim() : !file)}
            >
                {loading ? 'Processing...' : `Analyze ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            </Button>
        </form>
    );
};

export default ContentForm;
