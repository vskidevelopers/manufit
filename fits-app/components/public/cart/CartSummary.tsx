// components/public/cart/CartSummary.tsx
'use client';

import { useState } from 'react';
import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Lock, Truck, MapPin } from 'lucide-react';
import Link from 'next/link';

const DELIVERY_FEE = 300;

export function CartSummary() {
    const { totalPrice, items } = useCart();

    // Local state for delivery option (not persisted - reset on refresh)
    const [includeDelivery, setIncludeDelivery] = useState(false);

    const formatPrice = (amount: number) => {
        return `KSh ${amount.toLocaleString()}`;
    };

    // Calculate totals based on delivery selection
    const deliveryCost = includeDelivery ? DELIVERY_FEE : 0;
    const grandTotal = totalPrice + deliveryCost;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">

            {/* Title */}
            <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>

            {/* Breakdown */}
            <div className="space-y-3">

                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>

                {/* Delivery Option */}
                <div className="space-y-3">
                    <div className="flex items-start gap-4 p-4  rounded-lg border-2 border-blue-200 shadow-sm">
                        <Checkbox
                            id="delivery-toggle"
                            checked={includeDelivery}
                            onCheckedChange={(checked) => setIncludeDelivery(checked as boolean)}
                            className="mt-1 h-5 w-5"
                        />
                        <label htmlFor="delivery-toggle" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                                <Truck className="h-5 w-5 text-blue-600" />
                                Add Delivery (KSh 300)
                            </div>
                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                                <MapPin className="h-4 w-4 inline mr-2 text-blue-500" />
                                Kenya-wide delivery via trusted partners
                            </p>
                        </label>
                    </div>

                    {/* Delivery Cost Display */}
                    <div className="flex justify-between text-base pl-2">
                        <span className="text-slate-700 font-medium">Delivery Fee</span>
                        <span className={`font-semibold transition-colors ${includeDelivery ? 'text-green-600' : 'text-slate-400'}`}>
                            {includeDelivery ? formatPrice(DELIVERY_FEE) : 'Not selected'}
                        </span>
                    </div>
                </div>

                <Separator />

                {/* Grand Total */}
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(grandTotal)}</span>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                    <Lock className="h-3 w-3 text-green-600" />
                    <span>Secure checkout with M-Pesa or Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                    <Truck className="h-3 w-3 text-blue-600" />
                    <span>{includeDelivery ? 'Delivery included in total' : 'Add delivery at checkout'}</span>
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