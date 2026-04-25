// components/public/cart/EmptyCart.tsx
'use client';

import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function EmptyCart() {
    return (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <ShoppingBag className="h-10 w-10 text-slate-400" />
            </div>

            <h2 className="text-xl font-semibold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                Looks like you haven&apos;t added any products yet. Start shopping to build your order.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/shop">
                    <Button className="gap-2">
                        Browse Products
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
                <Link href="/">
                    <Button variant="outline">
                        Return Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}