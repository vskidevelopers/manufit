// components/public/product/ProductInfo.tsx
'use client';

import { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface ProductInfoProps {
    product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
    // Defensive formatting
    const formatPrice = (amount: number | undefined) => {
        const safeAmount = amount ?? 0;
        const currency = 'KSh';
        return `${currency} ${safeAmount.toLocaleString()}`;
    };

    // Placeholder rating (future: fetch from reviews)
    const rating = 4.5;
    const reviewCount = 24;

    return (
        <div className="space-y-4">
            {/* Category Badge */}
            {product.category && (
                <Badge variant="secondary" className="text-xs capitalize bg-blue-100 text-blue-700 hover:bg-blue-200">
                    {product.category}
                </Badge>
            )}

            {/* Product Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                {product.name || 'Untitled Product'}
            </h1>

            {/* Rating + Price Row */}
            <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-blue-600">
                    {formatPrice(product.basePrice)}
                </p>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                        />
                    ))}
                    <span className="text-sm text-slate-600 ml-1">
                        {rating} ({reviewCount})
                    </span>
                </div>
            </div>

            {/* Description */}
            {product.description && (
                <div className="prose prose-sm text-slate-600 leading-relaxed">
                    <p>{product.description}</p>
                </div>
            )}

            {/* Availability */}
            <div className="flex items-center gap-2 text-sm">
                <span className={`h-2.5 w-2.5 rounded-full ${product.isActive !== false ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={product.isActive !== false ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                    {product.isActive !== false ? 'In Stock' : 'Out of Stock'}
                </span>
            </div>
        </div>
    );
}