// components/public/checkout/CheckoutSummary.tsx
'use client';

import { CartItem } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Truck, MapPin, Phone, Package } from 'lucide-react';
import Link from 'next/link';

interface CheckoutSummaryProps {
    items: CartItem[];
    totalPrice: number;
    // New props for delivery context
    deliveryRegion?: 'nairobi' | 'others';
    customerLocation?: string;
    wantsDelivery?: boolean;
}

export function CheckoutSummary({
    items,
    totalPrice,
    deliveryRegion,
    customerLocation,
    wantsDelivery
}: CheckoutSummaryProps) {

    const formatPrice = (amount: number) => `KSh ${amount.toLocaleString()}`;

    // Calculate delivery fee based on user choices
    const deliveryFee = (deliveryRegion === 'nairobi' && wantsDelivery) ? 300 : 0;
    const grandTotal = totalPrice + deliveryFee;

    // Determine delivery status text
    const getDeliveryStatus = () => {
        if (deliveryRegion === 'nairobi' && wantsDelivery) {
            return {
                icon: <Truck className="h-4 w-4 text-green-600" />,
                label: `Delivery to ${customerLocation}`,
                fee: formatPrice(300),
                color: 'text-green-600'
            };
        } else if (deliveryRegion === 'nairobi' && !wantsDelivery) {
            return {
                icon: <Package className="h-4 w-4 text-blue-600" />,
                label: `Pickup / Self-collection`,
                fee: 'Free',
                color: 'text-blue-600'
            };
        } else if (deliveryRegion === 'others') {
            return {
                icon: <Phone className="h-4 w-4 text-blue-600" />,
                label: `Delivery to ${customerLocation || 'your area'}`,
                fee: 'Confirmed via call',
                color: 'text-blue-600'
            };
        }
        // Default fallback
        return {
            icon: <Truck className="h-4 w-4 text-slate-400" />,
            label: 'Delivery',
            fee: 'TBD',
            color: 'text-slate-400'
        };
    };

    const deliveryStatus = getDeliveryStatus();

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

                {/* Delivery Row - Dynamic based on user choices */}
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-1.5">
                        {deliveryStatus.icon}
                        {deliveryStatus.label}
                    </span>
                    <span className={`font-medium ${deliveryStatus.color}`}>
                        {deliveryStatus.fee}
                    </span>
                </div>

                <Separator />

                {/* Grand Total */}
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(grandTotal)}</span>
                </div>
            </div>

            {/* Contextual Info Box */}
            {deliveryRegion === 'others' && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-800 space-y-1">
                    <p className="font-medium flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Next Steps:
                    </p>
                    <ol className="list-decimal list-inside space-y-0.5">
                        <li>Place your order now</li>
                        <li>We&apos;ll call to confirm courier fee</li>
                        <li>You approve before we dispatch</li>
                    </ol>
                </div>
            )}

            {deliveryRegion === 'nairobi' && !wantsDelivery && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                    <p className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        You&apos;ll collect your order from our Nairobi hub. We&apos;ll WhatsApp you when it&apos;s ready.
                    </p>
                </div>
            )}

            {/* Trust Badges */}
            <div className="space-y-2 text-xs text-slate-500 pt-2">
                <div className="flex items-center gap-2">
                    <span>🔒</span>
                    <span>Secure checkout with M-Pesa or Pay Later</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>Order confirmation via SMS/WhatsApp</span>
                </div>
            </div>

            {/* Checkout CTA */}
            <Link href="/checkout" className="block">
                <Button
                    className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    disabled={items.length === 0}
                >
                    Place Order
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