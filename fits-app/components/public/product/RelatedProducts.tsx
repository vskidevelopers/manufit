// components/public/product/RelatedProducts.tsx
'use client';

import { useEffect, useState } from 'react';
import { getProductsAction } from '@/actions/product-actions';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/public/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RelatedProductsProps {
    currentProductId?: string;
    currentCategory?: string;
}

export function RelatedProducts({ currentProductId, currentCategory }: RelatedProductsProps) {
    const [related, setRelated] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRelated = async () => {
            try {
                const allProducts = await getProductsAction();

                // Filter: same category, exclude current product
                const filtered = allProducts.filter((p: Product) =>
                    p.category === currentCategory && p.id !== currentProductId
                );

                // Take up to 4 random products
                const shuffled = filtered.sort(() => 0.5 - Math.random());
                setRelated(shuffled.slice(0, 4));
            } catch (error) {
                console.error('❌ [CLIENT] Failed to load related products:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentCategory) {
            loadRelated();
        }
    }, [currentCategory, currentProductId]);

    if (loading || !related.length) return null;

    return (
        <section className="py-8 md:py-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">You May Also Like</h2>
                <Link href="/shop">
                    <Button variant="ghost" className="gap-1 text-sm text-slate-600 hover:text-blue-700">
                        View All <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {related.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}