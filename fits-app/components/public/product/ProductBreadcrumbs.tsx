// components/public/product/ProductBreadcrumbs.tsx
'use client';

import { Product } from '@/lib/types';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ProductBreadcrumbsProps {
    product: Product;
}

export function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
    return (
        <nav className="text-sm text-slate-600 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 flex-wrap">
                <li>
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                </li>
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <li>
                    <Link href="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
                </li>
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <li>
                    <Link
                        href={`/shop?category=${product.category}`}
                        className="hover:text-blue-600 transition-colors capitalize"
                    >
                        {product.category || 'Category'}
                    </Link>
                </li>
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <li className="text-slate-900 font-medium truncate max-w-[200px]">
                    {product.name || 'Product'}
                </li>
            </ol>
        </nav>
    );
}