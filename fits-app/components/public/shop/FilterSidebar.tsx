
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterDrawerProps {
    children: React.ReactNode;
}

export function FilterDrawer({ children }: FilterDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            return () => window.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    // Close on route change (listen to popstate)
    useEffect(() => {
        const handleRouteChange = () => setIsOpen(false);
        window.addEventListener('popstate', handleRouteChange);
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);

    return (
        <>
            {/* Toggle Button is in ShopHeader */}

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Drawer Panel */}
            <div
                className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
                role="dialog"
                aria-modal="true"
                aria-label="Filter products"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close filters"
                    >
                        <X size={20} />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                    {children}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50">
                    <Button
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>

            {/* Toggle Button Event Listener */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
            document.querySelector('[data-shop-filter-toggle]')?.addEventListener('click', () => {
              const drawer = document.querySelector('[role="dialog"][aria-label="Filter products"]');
              if (drawer) drawer.classList.toggle('open');
            });
          `,
                }}
            />
        </>
    );
}