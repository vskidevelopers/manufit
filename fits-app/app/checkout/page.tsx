

import { CheckoutContent } from '@/components/public/checkout/CheckoutContent';
import { CartProvider } from '@/lib/CartContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ✅ SEO Metadata (Server Components only)
export const metadata = {
    title: 'Checkout | ManuFit',
    description: 'Complete your order for custom apparel and branded merchandise. Secure checkout with M-Pesa or Cash on Delivery.',
    robots: 'noindex', // Prevent indexing of checkout pages
};

export default function CheckoutPage() {
    return (
        <>
            {/* Breadcrumb Nav */}
            <div className="container px-4 py-4">
                <Link href="/cart">
                    <Button variant="ghost" size="sm" className="gap-1 text-slate-600 hover:text-blue-700">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Cart
                    </Button>
                </Link>
            </div>

            {/* Checkout Content wrapped with CartProvider */}
            <CartProvider>
                <CheckoutContent />
            </CartProvider>
        </>
    );
}