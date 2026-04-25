// components/public/shop/ShopHeader.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';

interface ShopHeaderProps {
    totalProducts: number;
}

export function ShopHeader({ totalProducts }: ShopHeaderProps) {
    return (
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
            <div className="container px-4">

                {/* Top Bar: Title + Actions */}
                <div className="flex items-center justify-between py-4">

                    {/* Left: Title + Count */}
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                            Shop
                        </h1>
                        <p className="text-sm text-slate-600">
                            <span className="font-semibold text-slate-900">{totalProducts}</span> product{totalProducts !== 1 ? 's' : ''} available
                        </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">

                        {/* Desktop Search (hidden on mobile) */}
                        <div className="hidden md:block relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="search"
                                placeholder="Search products..."
                                className="h-9 w-64 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                aria-label="Search products"
                            />
                        </div>

                        {/* Mobile Filter Toggle */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="lg:hidden gap-2 h-9 px-3 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            data-shop-filter-toggle
                            aria-label="Open filters"
                            aria-expanded="false"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="hidden sm:inline">Filters</span>
                        </Button>

                        {/* Desktop Filter Button (optional alternative) */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hidden lg:flex gap-2 h-9 text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            aria-label="Open filters"
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </div>
                </div>

                {/* Bottom Bar: Mobile Search + Category Pills (Optional) */}
                <div className="md:hidden pb-4">
                    {/* Mobile Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="search"
                            placeholder="Search t-shirts, hoodies..."
                            className="h-10 w-full pl-9 pr-4 rounded-lg border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            aria-label="Search products"
                        />
                    </div>
                </div>

            </div>
        </header>
    );
}