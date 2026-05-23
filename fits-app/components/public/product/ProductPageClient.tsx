// components/public/product/ProductPageClient.tsx
'use client'; // ✅ Only this file has 'use client'

import { useState } from 'react';
import { Product } from '@/lib/types';
import { ProductGallery } from '@/components/public/product/ProductGallery';
import { ProductInfo } from '@/components/public/product/ProductInfo';
import { SizeSelector } from '@/components/public/product/SizeSelector';
import { ColorSelector } from '@/components/public/product/ColorSelector';
import { AddToCartButton } from '@/components/public/product/AddToCartButton';
import { RelatedProducts } from '@/components/public/product/RelatedProducts';
import { ProductBreadcrumbs } from '@/components/public/product/ProductBreadcrumbs';

// Structured Data (JSON-LD) - Helper function (can stay in client file)
export function generateStructuredData(product: Product) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images?.[0],
        brand: { '@type': 'Brand', name: 'i-Drip' },
        offers: {
            '@type': 'Offer',
            price: product.basePrice,
            priceCurrency: 'KSh',
            availability: product.isActive !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
        category: product.category,
    };
}

interface ProductPageClientProps {
    product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

    return (
        <>
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData(product)) }}
            />

            <div className="min-h-screen bg-slate-50">
                <div className="container px-4 py-6 md:py-8">
                    {/* Breadcrumbs */}
                    <ProductBreadcrumbs product={product} />

                    {/* Main Product Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-6 md:py-8">

                        {/* Left: Image Gallery */}
                        <ProductGallery images={product.images || []} productName={product.name || 'Untitled Product'} />

                        {/* Right: Product Info + Selectors */}
                        <div className="space-y-6">
                            <ProductInfo product={product} />

                            {/* Size Selector */}
                            {product.availableSizes?.length ? (
                                <SizeSelector
                                    sizes={product.availableSizes}
                                    selectedSize={selectedSize}
                                    onSizeChange={setSelectedSize}
                                />
                            ) : null}

                            {/* Color Selector */}
                            {product.availableColors?.length ? (
                                <ColorSelector
                                    colors={product.availableColors}
                                    selectedColor={selectedColor}
                                    onColorChange={setSelectedColor}
                                />
                            ) : null}

                            {/* Add to Cart - Receives state as props */}
                            <AddToCartButton
                                product={product}
                                selectedSize={selectedSize}
                                selectedColor={selectedColor}
                            />

                            {/* Trust Badges */}
                            <div className="flex flex-wrap gap-4 pt-4 text-sm text-slate-600 border-t">
                                <span>✅ Quality Guarantee</span>
                                <span>🚚 Kenya-wide Delivery</span>
                                <span>💳 M-Pesa / COD</span>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    <RelatedProducts currentProductId={product.id} currentCategory={product.category} />
                </div>
            </div>
        </>
    );
}