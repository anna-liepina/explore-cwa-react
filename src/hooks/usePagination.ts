import { useState } from 'react';

export interface IPagination {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
}

export const usePagination = (): IPagination => {
    const [currentPage, setCurrentPage] = useState(1);

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    return {
        currentPage,
        setCurrentPage,
        nextPage,
        prevPage,
    }
};
