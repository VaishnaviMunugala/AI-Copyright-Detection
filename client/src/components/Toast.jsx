import { useEffect } from 'react';

const Toast = ({ toasts, removeToast }) => {
    const getToastStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-white';
            default:
                return 'bg-blue-500 text-white';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            default:
                return 'ℹ';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${getToastStyles(toast.type)} px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px] animate-fadeIn`}
                >
                    <span className="text-xl font-bold">{getIcon(toast.type)}</span>
                    <p className="flex-1">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-white hover:text-gray-200 font-bold"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Toast;
