const Loader = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div
                className={`${sizeClasses[size]} border-4 border-gray-300 dark:border-gray-600 border-t-primary rounded-full animate-spin`}
            ></div>
        </div>
    );
};

export default Loader;
