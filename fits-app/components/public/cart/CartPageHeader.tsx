
'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/CartContext';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function CartPageHeader() {
    const { totalItems, clearCart } = useCart();

    return (
        <header className="bg-linear-to-br from-slate-900 to-blue-900 py-4 md:py-5">
            <div className="container px-4">
                <div className="flex items-center justify-between gap-4">

                    {/* Left: Title + Count */}
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2 ">
                            <Link href="/shop" className="text-slate-400 hover:text-white transition-colors">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                            <ShoppingBag className="h-5 w-5 text-blue-300" /> <span className='text-white'>Continue Shopping </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            Your Cart
                            <span className="block text-sm md:text-base font-medium text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-purple-300">
                                {totalItems} item{totalItems !== 1 ? 's' : ''} ready for checkout
                            </span>
                        </h1>
                    </div>

                    {/* Right: Clear Cart (only if items exist) */}
                    {totalItems > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-9 px-3 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 transition-all"
                            onClick={clearCart}
                            aria-label="Clear all items from cart"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Clear</span>
                        </Button>
                    )}
                </div>

                {/* Bottom Gradient Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-slate-50 to-transparent pointer-events-none" />
            </div>
        </header>
    );
}