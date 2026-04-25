
'use client';

import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import Link from 'next/link';

export function EmptyState() {
    return (
        <div className="text-center py-16 bg-white rounded-lg border">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Package className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No products yet</h3>
            <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                We are still adding products to our store. Check back soon or contact us for custom orders.
            </p>
            <Link href="/contact">
                <Button>Request a Custom Order</Button>
            </Link>
        </div>
    );
}