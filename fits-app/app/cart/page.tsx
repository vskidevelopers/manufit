
import { CartProvider } from '@/lib/CartContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartPageContent } from '@/components/public/cart/CartPageContent';

// ✅ SEO Metadata (only works in Server Components)
export const metadata = {
    title: 'Your Cart | ManuFit',
    description: 'Review your order before checkout. Custom apparel and branded merchandise.',
};

export default function CartPage() {
    return (
        <>


            {/* Cart Content wrapped with Provider */}
            <CartProvider>
                <CartPageContent />
            </CartProvider>
        </>
    );
}