// app/product/[id]/page.tsx

import { notFound } from 'next/navigation';
import { getProductAction } from '@/actions/product-actions';
import ProductPageClient from '@/components/public/product/ProductPageClient';

// ✅ SEO Metadata (Server Components only)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProductAction(id);

    if (!product) {
        return {
            title: 'Product Not Found | i-Drip',
            description: 'The requested product could not be found.',
        };
    }

    return {
        title: `${product.name} | i-Drip`,
        description: product.description || `Buy ${product.name} at i-Drip. Custom apparel and branded merchandise.`,
        keywords: [product.name, product.category, 'custom apparel', 'i-Drip'],
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.images?.[0] ? [{ url: product.images[0] }] : [],
            type: 'website',
            siteName: 'i-Drip',
            locale: 'en_KE',
        },
        other: {
            'product:price:amount': product.basePrice?.toString(),
            'product:price:currency': 'KSh',
            'product:availability': product.isActive !== false ? 'in stock' : 'out of stock',
            'product:category': product.category,
        },
    };
}

// ✅ Server Component: Fetches data, renders client component
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch product (server-side)
    const product = await getProductAction(id);

    // Handle 404
    if (!product) {
        notFound();
    }

    // Pass serialized product to client component
    return <ProductPageClient product={product} />;
}