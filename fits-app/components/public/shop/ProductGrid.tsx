// components/public/shop/ProductGrid.tsx
'use client';

import { Product } from '@/lib/types';
import { ProductCard } from '@/components/public/ProductCard';

interface ProductGridProps {
    products: Product[];
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    colors?: string[];
    sort?: string;
}

export function ProductGrid({
    products,
    category,
    minPrice,
    maxPrice,
    sizes,
    colors,
    sort = 'featured',
}: ProductGridProps) {
    // Client-side filtering
    // eslint-disable-next-line prefer-const
    let filtered = products.filter((product) => {
        if (category && product.category !== category) return false;
        if (minPrice && (product.basePrice ?? 0) < minPrice) return false;
        if (maxPrice && (product.basePrice ?? 0) > maxPrice) return false;
        if (sizes?.length && !product.availableSizes?.some((s) => sizes.includes(s))) return false;
        if (colors?.length && !product.availableColors?.some((c) => colors.includes(c))) return false;
        return true;
    });

    // Client-side sorting
    filtered.sort((a, b) => {
        switch (sort) {
            case 'price-asc':
                return (a.basePrice ?? 0) - (b.basePrice ?? 0);
            case 'price-desc':
                return (b.basePrice ?? 0) - (a.basePrice ?? 0);
            case 'name-asc':
                return (a.name ?? '').localeCompare(b.name ?? '');
            case 'name-desc':
                return (b.name ?? '').localeCompare(a.name ?? '');
            case 'newest':
                // Assuming createdAt exists and is comparable
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            default:
                return 0; // featured = original order
        }
    });

    if (filtered.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-slate-500">No products match your filters.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}