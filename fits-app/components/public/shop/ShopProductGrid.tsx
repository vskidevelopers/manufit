// components/public/shop/ShopProductGrid.tsx
'use client';

import { Product } from '@/lib/types';
import { ProductCard } from '@/components/public/ProductCard';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';

interface ShopProductGridProps {
    products: Product[];
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    colors?: string[];
    sort?: string;
}

export function ShopProductGrid({
    products,
    category,
    minPrice,
    maxPrice,
    sizes,
    colors,
    sort = 'featured',
}: ShopProductGridProps) {
    // Client-side filtering
    let filtered = products.filter((product) => {
        if (category && product.category !== category) return false;
        if (minPrice && (product.basePrice ?? 0) < minPrice) return false;
        if (maxPrice && (product.basePrice ?? 0) > maxPrice) return false;
        if (sizes?.length && !product.availableSizes?.some((s) => sizes.includes(s))) return false;
        if (colors?.length && !product.availableColors?.some((c) => colors.includes(c))) return false;
        return true;
    });

    // Client-side sorting (defensive for undefined values)
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
                const dateA = a.createdAt
                    ? (typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : a.createdAt?.toDate?.()?.getTime?.() ?? 0)
                    : 0;
                const dateB = b.createdAt
                    ? (typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : b.createdAt?.toDate?.()?.getTime?.() ?? 0)
                    : 0;
                return dateB - dateA;
            default:
                return 0;
        }
    });

    // Empty state
    if (filtered.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-slate-500">No products match your filters.</p>
            </div>
        );
    }

    // Render with PaginationWrapper
    return (
        <PaginationWrapper totalItems={filtered.length} itemsPerPage={12}>
            {({ startIndex, endIndex }) => {
                const paginatedProducts = filtered.slice(startIndex, endIndex);

                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {paginatedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                );
            }}
        </PaginationWrapper>
    );
}