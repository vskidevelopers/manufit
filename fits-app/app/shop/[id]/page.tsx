/* eslint-disable @typescript-eslint/no-explicit-any */

import { notFound } from 'next/navigation';
import { getProductAction } from '@/actions/product-actions';
import { ProductGallery } from '@/components/public/product/ProductGallery';
import { ProductInfo } from '@/components/public/product/ProductInfo';
import { SizeSelector } from '@/components/public/product/SizeSelector';
import { ColorSelector } from '@/components/public/product/ColorSelector';
import { AddToCartButton } from '@/components/public/product/AddToCartButton';
import { RelatedProducts } from '@/components/public/product/RelatedProducts';
import { ProductBreadcrumbs } from '@/components/public/product/ProductBreadcrumbs';

// SEO Metadata (dynamic)
// app/product/[id]/page.tsx

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProductAction(id);

    if (!product) {
        return {
            title: 'Product Not Found | ManuFit',
            description: 'The requested product could not be found.',
        };
    }

    return {
        title: `${product.name} | ManuFit`,
        description: product.description || `Buy ${product.name} at ManuFit. Custom apparel and branded merchandise.`,
        keywords: [product.name, product.category, 'custom apparel', 'ManuFit'],
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.images?.[0] ? [{ url: product.images[0] }] : [],
            type: 'website', // ✅ Valid OpenGraph type (fallback)
            // Optional: add product-specific OG properties
            siteName: 'ManuFit',
            locale: 'en_KE',
        },
        // ✅ Use JSON-LD for product structured data (schema.org)
        other: {
            'product:price:amount': product.basePrice?.toString(),
            'product:price:currency': 'KSh',
            'product:availability': product.isActive !== false ? 'in stock' : 'out of stock',
            'product:category': product.category,
        },
    };
}

// Structured Data (JSON-LD)
function generateStructuredData(product: any) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images?.[0],
        brand: { '@type': 'Brand', name: 'ManuFit' },
        offers: {
            '@type': 'Offer',
            price: product.basePrice,
            priceCurrency: product.currency || 'KSh',
            availability: product.isActive !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
        category: product.category,
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch product (server-side)
    const product = await getProductAction(id);

    // Handle 404
    if (!product) {
        notFound();
    }

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
                                <SizeSelector sizes={product.availableSizes} />
                            ) : null}

                            {/* Color Selector */}
                            {product.availableColors?.length ? (
                                <ColorSelector colors={product.availableColors} />
                            ) : null}

                            {/* Add to Cart */}
                            <AddToCartButton product={product} />

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