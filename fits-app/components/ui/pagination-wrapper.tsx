'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationWrapperProps {
    totalItems: number;
    itemsPerPage?: number;
    onPageChange?: (currentPage: number) => void;
    children: ({ startIndex, endIndex, currentPage }: { startIndex: number; endIndex: number; currentPage: number }) => React.ReactNode;
}

export function PaginationWrapper({
    totalItems,
    itemsPerPage = 20,
    onPageChange,
    children,
}: PaginationWrapperProps) {
    const [requestedPage, setRequestedPage] = useState(1);

    // 1. Calculate Total Pages
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // 2. Derive the "Safe" Current Page (No useEffect needed!)
    // If requestedPage is out of bounds, we automatically use the last valid page.
    // This prevents "Page 5 of 2" scenarios without triggering extra renders.
    const currentPage = requestedPage > totalPages ? totalPages : requestedPage;

    // 3. Handle Page Change
    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;

        // Only update if the page actually changes to avoid unnecessary callbacks
        if (newPage !== requestedPage) {
            console.log(`🔄 [PAGINATION] User requested page ${newPage} (Effective: ${newPage})`);
            setRequestedPage(newPage);

            if (onPageChange) {
                onPageChange(newPage);
            }
        }
    };

    // 4. Calculate Indices based on the SAFE current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    // Edge Case: No items
    if (totalItems === 0) {
        return children({ startIndex: 0, endIndex: 0, currentPage: 1 });
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Render Content */}
            {children({ startIndex, endIndex, currentPage })}

            {/* Controls (Only show if there is more than 1 page) */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4 mt-4">
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-medium text-gray-900">{startIndex + 1}</span> to{' '}
                        <span className="font-medium text-gray-900">{endIndex}</span> of{' '}
                        <span className="font-medium text-gray-900">{totalItems}</span> items
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>

                        <span className="text-sm font-medium px-2 min-w-[80px] text-center">
                            Page {currentPage} of {totalPages}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}