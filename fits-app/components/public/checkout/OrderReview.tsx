// components/public/checkout/OrderReview.tsx
'use client';

import { CartItem } from '@/lib/CartContext';
import { Separator } from '@/components/ui/separator';
import { Truck, Package, Phone } from 'lucide-react';

interface OrderReviewProps {
    items: CartItem[];
    totalPrice: number;
    deliveryFee: number;
    deliveryRegion?: 'nairobi' | 'others';
    customerLocation?: string;
    wantsDelivery?: boolean;
}

export function OrderReview({
    items,
    totalPrice,
    deliveryFee,
    deliveryRegion,
    customerLocation,
    wantsDelivery
}: OrderReviewProps) {

    const formatPrice = (amount: number) => `KSh ${amount.toLocaleString()}`;
    const grandTotal = totalPrice + deliveryFee;

    // Determine delivery display based on user choices
    const getDeliveryDisplay = () => {
        if (deliveryRegion === 'nairobi' && wantsDelivery) {
            return {
                icon: <Truck className="h-3 w-3 text-green-600" />,
                label: `Delivery to ${customerLocation}`,
                fee: formatPrice(300),
                color: 'text-green-600',
                show: true
            };
        } else if (deliveryRegion === 'nairobi' && !wantsDelivery) {
            return {
                icon: <Package className="h-3 w-3 text-blue-600" />,
                label: `Pickup / Self-collection`,
                fee: 'Free',
                color: 'text-blue-600',
                show: true
            };
        } else if (deliveryRegion === 'others') {
            return {
                icon: <Phone className="h-3 w-3 text-blue-600" />,
                label: `Delivery to ${customerLocation || 'your area'}`,
                fee: 'Confirmed via call',
                color: 'text-blue-600',
                show: true
            };
        }
        // Fallback: no delivery info yet
        return { show: false };
    };

    const deliveryDisplay = getDeliveryDisplay();

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">

            {/* Section Header */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Order Review</h2>
                <p className="text-sm text-slate-500">Double-check your items before placing order</p>
            </div>

            {/* Items List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {items.map((item) => (
                    <div key={item.cartId} className="flex gap-3 py-2">
                        {/* Thumbnail */}
                        <div className="h-12 w-12 flex-shrink-0 bg-slate-100 rounded-md overflow-hidden">
                            {item.image ? (
                                <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400">
                                    No img
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{item.productName}</p>
                            {(item.size || item.color) && (
                                <p className="text-xs text-slate-500">
                                    {item.size && `Size: ${item.size}`}
                                    {item.size && item.color && ' • '}
                                    {item.color && `Color: ${item.color}`}
                                </p>
                            )}
                            <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-medium text-slate-900 whitespace-nowrap">
                            {formatPrice(item.totalPrice)}
                        </p>
                    </div>
                ))}
            </div>

            <Separator className="my-4" />

            {/* Totals */}
            <div className="space-y-2 text-sm">

                {/* Subtotal */}
                <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>

                {/* Dynamic Delivery Row */}
                {deliveryDisplay.show && (
                    <div className="flex justify-between">
                        <span className="text-slate-600 flex items-center gap-1.5">
                            {deliveryDisplay.icon}
                            {deliveryDisplay.label}
                        </span>
                        <span className={`font-medium ${deliveryDisplay.color}`}>
                            {deliveryDisplay.fee}
                        </span>
                    </div>
                )}

                <Separator />

                {/* Grand Total */}
                <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(grandTotal)}</span>
                </div>
            </div>

            {/* Contextual Note for Upcountry */}
            {deliveryRegion === 'others' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-800">
                    <p className="flex items-start gap-1.5">
                        <Phone className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>
                            <strong>Next steps:</strong> We&apos;ll call to confirm the courier fee for {customerLocation}.
                            You approve before we dispatch.
                        </span>
                    </p>
                </div>
            )}

            {/* Contextual Note for Pickup */}
            {deliveryRegion === 'nairobi' && !wantsDelivery && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                    <p className="flex items-start gap-1.5">
                        <Package className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>
                            You&apos;ll collect your order from our Nairobi hub. We&apos;ll WhatsApp you when it&apos;s ready for pickup.
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}