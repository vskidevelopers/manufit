// components/public/ProductCard.tsx
'use client';

import { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const formatPrice = (amount: number) => {
        const currency = 'KSh';
        return `${currency} ${amount.toLocaleString()}`;
    };

    const availableSizes = product.availableSizes ?? [];

    return (
        <Link href={`/shop/${product.id}`}>
            <Card className="group overflow-hidden border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                {/* Image */}
                <div className="aspect-[3/4] bg-slate-100 overflow-hidden">
                    {product.images?.[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-slate-400 text-sm">No Image</span>
                        </div>
                    )}

                    {/* Quick Add Button (appears on hover) */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                            onClick={(e) => e.preventDefault()}
                            aria-label="Add to cart"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="p-4 space-y-2">
                    {/* Category Badge */}
                    <Badge variant="secondary" className="text-xs capitalize">
                        {product.category}
                    </Badge>

                    {/* Product Name */}
                    <h3 className="font-semibold text-slate-900 text-sm md:text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>

                    {/* Price */}
                    <p className="text-lg font-bold text-blue-600">
                        {formatPrice(product.basePrice || 0)}
                    </p>

                    {/* Sizes Preview */}
                    {availableSizes.length > 0 && (
                        <p className="text-xs text-slate-500">
                            Sizes: {availableSizes.slice(0, 3).join(', ')}
                            {availableSizes.length > 3 && '+'}
                        </p>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}