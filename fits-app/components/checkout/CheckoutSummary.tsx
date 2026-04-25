
'use client';

import { useState } from 'react';
import { CartItem } from '@/lib/CartContext';

import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Truck, MapPin, Lock } from 'lucide-react';

const DELIVERY_FEE = 300;

interface CheckoutSummaryProps {
    items: CartItem[];
    totalPrice: number;
    onDeliveryChange: (fee: number) => void;
}

export function CheckoutSummary({ items, totalPrice, onDeliveryChange }: CheckoutSummaryProps) {
    const [includeDelivery, setIncludeDelivery] = useState(false);

    const formatPrice = (amount: number) => `KSh ${amount.toLocaleString()}`;

    const deliveryCost = includeDelivery ? DELIVERY_FEE : 0;
    const grandTotal = totalPrice + deliveryCost;

    // Sync with parent when delivery toggles
    const handleDeliveryToggle = (checked: boolean) => {
        setIncludeDelivery(checked);
        onDeliveryChange(checked ? DELIVERY_FEE : 0);
    };

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
                <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <Checkbox
                            id="checkout-delivery"
                            checked={includeDelivery}
                            onCheckedChange={(checked) => handleDeliveryToggle(checked as boolean)}
                            className="mt-0.5"
                        />
                        <label htmlFor="checkout-delivery" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                                <Truck className="h-4 w-4 text-blue-600" />
                                Add Delivery (KSh 300)
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                Kenya-wide delivery via trusted partners
                            </p>
                        </label>
                    </div>

                    {/* Delivery Cost Display */}
                    <div className="flex justify-between text-sm pl-1">
                        <span className="text-slate-600">Delivery Fee</span>
                        <span className={`font-medium transition-colors ${includeDelivery ? 'text-slate-900' : 'text-slate-400'}`}>
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
        </div>
    );
}