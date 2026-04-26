// components/public/shop/ShopHeader.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Filter, Search, Sparkles } from 'lucide-react';



export function ShopHeader() {
    return (
        <header className="bg-linear-to-br from-slate-900 to-blue-900 py-4 md:py-5">
            <div className="container px-4">
                <div className="flex items-center justify-between gap-4">

                    {/* Left: Title */}
                    <div className="relative container px-4">

                        {/* Top Bar: Title + Actions */}
                        <div className="flex items-center justify-between py-6 md:py-8">

                            {/* Left: Premium Title Block */}
                            <div className="space-y-2">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-medium">
                                    <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                                    <span>Curated Collection</span>
                                </div>

                                {/* Main Title */}
                                <h1 className="text-2xl md:text-5xl font-bold text-white tracking-tight leading-tight flex">
                                    Shop {' '}
                                    <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-300 via-purple-300 to-pink-300">
                                        {" "} ManuFit Originals
                                    </span>
                                </h1>

                            </div>
                        </div>

                        {/* Bottom Bar: Mobile Search + Quick Categories */}
                        <div className="md:hidden pb-6 space-y-4">

                            {/* Mobile Search - Full Width */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="search"
                                    placeholder="Search t-shirts, hoodies, custom designs..."
                                    className="h-12 w-full pl-11 pr-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all"
                                    aria-label="Search products"
                                />
                            </div>

                            {/* Quick Category Pills */}
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                                {['All', 'T-Shirts', 'Hoodies', 'Kids', 'Custom'].map((cat, idx) => (
                                    <button
                                        key={cat}
                                        className={`
                  shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all
                  ${idx === 0
                                                ? 'bg-white text-slate-900 shadow-lg'
                                                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                                            }
                `}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">

                        {/* Desktop Search */}
                        <div className="hidden md:block relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="search"
                                placeholder="Search..."
                                className="h-9 w-64 pl-9 pr-4 rounded-lg border border-white/20 bg-white/10 text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all"
                                aria-label="Search products"
                            />
                        </div>

                        {/* Filter Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-9 px-3 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 transition-all"
                            data-shop-filter-toggle
                            aria-label="Open filters"
                        >
                            <Filter className="h-4 w-4" />
                            <span className="hidden sm:inline">Filters</span>
                        </Button>
                    </div>
                </div>

                {/* Mobile Search (Compact) */}
                <div className="md:hidden mt-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="search"
                            placeholder="Search products..."
                            className="h-9 w-full pl-9 pr-4 rounded-lg border border-white/20 bg-white/10 text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                            aria-label="Search products"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}