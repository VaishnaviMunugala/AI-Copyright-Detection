import { useState } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 20) => {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    const offset = (page - 1) * limit;

    const nextPage = () => setPage((prev) => prev + 1);
    const prevPage = () => setPage((prev) => Math.max(1, prev - 1));
    const goToPage = (pageNum) => setPage(Math.max(1, pageNum));
    const reset = () => setPage(1);

    return {
        page,
        limit,
        offset,
        setLimit,
        nextPage,
        prevPage,
        goToPage,
        reset,
    };
};

export default usePagination;
