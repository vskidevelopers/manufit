// components/public/cart/CartPageContent.tsx (updated)
'use client';

import { useCart } from '@/lib/CartContext';
import { CartPageHeader } from './CartPageHeader';
import { CartItemsList } from './CartItemsList';
import { CartSummary } from './CartSummary';
import { EmptyCart } from './EmptyCart';

export function CartPageContent() {
    const { items } = useCart();

    return (
        <>
            {/* Header uses context internally */}
            <CartPageHeader />

            {/* Main Content */}
            <div className="flex justify-center">
                <div className="container px-4 py-6">
                    {items.length === 0 ? (
                        <EmptyCart />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <CartItemsList items={items} />
                            </div>
                            <div className="lg:col-span-1">
                                <div className="sticky top-24">
                                    <CartSummary />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
}
