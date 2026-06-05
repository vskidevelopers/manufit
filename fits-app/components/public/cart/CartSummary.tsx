// components/public/cart/CartSummary.tsx
'use client';

import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Lock, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function CartSummary() {
    const { totalPrice, items } = useCart();

    const formatPrice = (amount: number) => `KSh ${amount.toLocaleString()}`;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">

            {/* Title */}
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                Order Summary
            </h2>

            {/* Breakdown */}
            <div className="space-y-3">

                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>

                <Separator />

                {/* Grand Total */}
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(totalPrice)}</span>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-2 text-xs text-slate-500 pt-2">
                <div className="flex items-center gap-2">
                    <Lock className="h-3 w-3 text-green-600" />
                    <span>Secure checkout with M-Pesa or Pay Later</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>🚚</span>
                    <span>Delivery options selected at checkout</span>
                </div>
            </div>

            {/* Checkout CTA */}
            <Link href="/checkout" className="block">
                <Button
                    className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    disabled={items.length === 0}
                >
                    Proceed to Checkout
                </Button>
            </Link>

            {/* Continue Shopping */}
            <Link href="/shop">
                <Button variant="outline" className="w-full">
                    Continue Shopping
                </Button>
            </Link>
        </div>
    );
}