// components/public/FeaturedProducts.tsx
'use client';

import { useEffect, useState } from 'react';
import { getProductsAction } from '@/actions/product-actions';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeatured = async () => {
            console.log('[FeaturedProducts] Starting load of featured products...');
            try {
                const allProducts = await getProductsAction();
                const featured = allProducts.slice(0, 8);
                console.log(
                    `[FeaturedProducts] Loaded ${allProducts.length} products, using ${featured.length} featured products.`
                );
                setProducts(featured);
            } catch (error) {
                console.error('[FeaturedProducts] Failed to load featured products:', error);
            } finally {
                setLoading(false);
                console.log('[FeaturedProducts] Featured products load process finished.');
            }
        };
        loadFeatured();
    }, []);

    return (
        <section className="flex justify-center py-12 md:py-16 lg:py-20 bg-white">
            <div className="container px-4">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-12">
                    <div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                            Featured Products
                        </h2>
                        <p className="text-slate-600 text-sm">
                            Handpicked favorites from our collection.
                        </p>
                    </div>
                    <Link href="/shop">
                        <Button variant="outline" className="gap-2">
                            View All Products
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-slate-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 rounded-xl">
                        <p className="text-slate-500">No products available yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
}