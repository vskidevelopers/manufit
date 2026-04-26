
'use client';

import { CartItem } from '@/lib/CartContext';
import { Separator } from '@/components/ui/separator';

interface OrderReviewProps {
    items: CartItem[];
    totalPrice: number;
    deliveryFee: number;
}

export function OrderReview({ items, totalPrice, deliveryFee }: OrderReviewProps) {
    const formatPrice = (amount: number) => `KSh ${amount.toLocaleString()}`;
    const grandTotal = totalPrice + deliveryFee;

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
                <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                {deliveryFee > 0 && (
                    <div className="flex justify-between">
                        <span className="text-slate-600">Delivery</span>
                        <span className="font-medium">{formatPrice(deliveryFee)}</span>
                    </div>
                )}
                <Separator />
                <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(grandTotal)}</span>
                </div>
            </div>
        </div>
    );
}