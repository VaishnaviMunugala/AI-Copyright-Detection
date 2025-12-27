const Pagination = ({ page, totalPages, onPageChange, hasMore }) => {
    const canGoPrev = page > 1;
    const canGoNext = hasMore;

    return (
        <div className="flex items-center justify-center space-x-4 mt-8">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={!canGoPrev}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Previous
            </button>

            <span className="text-sm font-medium">
                Page {page}
            </span>

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={!canGoNext}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
