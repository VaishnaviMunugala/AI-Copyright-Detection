const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium mb-2">
                    {label}
                </label>
            )}
            <input
                className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
