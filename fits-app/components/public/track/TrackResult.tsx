// components/public/track/TrackResult.tsx
'use client';

import { Order } from '@/lib/types';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle, Package, Truck, Calendar, Phone, MapPin,
    RefreshCw, MessageCircle, CreditCard, ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

interface TrackResultProps {
    order: Order;
    onNewSearch: () => void;
}

export function TrackResult({ order, onNewSearch }: TrackResultProps) {
    // Format date helper
    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-KE', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return 'Invalid date';
        }
    };

    // Format price helper
    const formatPrice = (amount: number | undefined) => {
        const safeAmount = amount ?? 0;
        return `KSh ${safeAmount.toLocaleString()}`;
    };

    // Delivery info helper
    const getDeliveryInfo = () => {
        if (order.deliveryRegion === 'nairobi' && order.wantsDelivery) {
            return {
                icon: <Truck className="h-4 w-4 text-green-600" />,
                label: `Delivery to ${order.customerLocation}`,
                fee: formatPrice(order.deliveryFee),
                note: 'Fixed KSh 300 delivery fee'
            };
        } else if (order.deliveryRegion === 'nairobi' && !order.wantsDelivery) {
            return {
                icon: <Package className="h-4 w-4 text-blue-600" />,
                label: `Pickup / Self-collection`,
                fee: 'Free',
                note: `Collect from our Nairobi hub`
            };
        } else if (order.deliveryRegion === 'others') {
            return {
                icon: <Phone className="h-4 w-4 text-blue-600" />,
                label: `Delivery to ${order.customerLocation}`,
                fee: 'Confirmed via call',
                note: 'Courier fee confirmed before dispatch'
            };
        }
        return {
            icon: <Truck className="h-4 w-4 text-slate-400" />,
            label: 'Delivery',
            fee: 'TBD',
            note: ''
        };
    };

    const deliveryInfo = getDeliveryInfo();

    // Payment method display
    const getPaymentDisplay = () => {
        if (order.paymentMethod === 'mpesa') {
            return {
                icon: <CreditCard className="h-4 w-4 text-green-600" />,
                label: 'M-Pesa',
                code: order.mpesaCode ? `Code: ${order.mpesaCode}` : 'Pending verification'
            };
        }
        return {
            icon: <CreditCard className="h-4 w-4 text-blue-600" />,
            label: 'Pay Later',
            code: 'Confirm payment on delivery'
        };
    };

    const paymentDisplay = getPaymentDisplay();

    // Status timeline steps
    const statusSteps = [
        { key: 'pending', label: 'Order Placed', icon: Package },
        { key: 'processing', label: 'Processing', icon: ShoppingBag },
        { key: 'completed', label: 'Completed', icon: CheckCircle },
    ];
    const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">

            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mb-3">
                    <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Order Found!</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Order <code className="bg-white px-2 py-0.5 rounded font-mono font-semibold text-blue-600">{order.orderNumber}</code>
                </p>
            </div>

            <div className="p-6 space-y-6">

                {/* Status Badge + Timeline */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-sm font-medium text-slate-600">Current Status</span>
                        <OrderStatusBadge status={order.status} showIcon size="lg" />
                    </div>

                    {/* Simple Progress Bar */}
                    <div className="relative">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${Math.min((currentStepIndex + 1) * 50, 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-500">
                            {statusSteps.map((step, idx) => {
                                const Icon = step.icon;
                                const isActive = idx <= currentStepIndex;
                                return (
                                    <span key={step.key} className={`flex items-center gap-1 ${isActive ? 'text-blue-600 font-medium' : ''}`}>
                                        <Icon className="h-3 w-3" />
                                        {step.label}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Order Details Grid */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Order Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        {/* Order Date */}
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <div>
                                <p className="text-slate-500 text-xs">Order Date</p>
                                <p className="font-medium text-slate-900">{formatDate(order.createdAt)}</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <div>
                                <p className="text-slate-500 text-xs">Phone</p>
                                <p className="font-medium text-slate-900">{order.customerPhone}</p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <div>
                                <p className="text-slate-500 text-xs">Location</p>
                                <p className="font-medium text-slate-900">{order.customerLocation}</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            {paymentDisplay.icon}
                            <div>
                                <p className="text-slate-500 text-xs">Payment</p>
                                <p className="font-medium text-slate-900">{paymentDisplay.label}</p>
                                {order.mpesaCode && <p className="text-xs text-green-600 font-mono">{paymentDisplay.code}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Info Card */}
                <div className={`p-4 rounded-lg border ${order.deliveryRegion === 'others'
                    ? 'bg-blue-50 border-blue-200'
                    : order.wantsDelivery
                        ? 'bg-green-50 border-green-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                    <div className="flex items-start gap-3">
                        {deliveryInfo.icon}
                        <div className="flex-1">
                            <p className="font-medium text-slate-900">{deliveryInfo.label}</p>
                            <p className="text-sm text-slate-600 mt-0.5">{deliveryInfo.note}</p>
                            <p className={`text-sm font-semibold mt-1 ${order.deliveryRegion === 'others' ? 'text-blue-600' : 'text-green-600'
                                }`}>
                                Fee: {deliveryInfo.fee}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Items Summary */}
                {order.items && order.items.length > 0 && (
                    <>
                        <Separator />
                        <div className="space-y-3">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4" />
                                Items ({order?.items?.length})
                            </h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {order?.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start text-sm p-2 hover:bg-slate-50 rounded">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 truncate">{item.productName}</p>
                                            {(item.size || item.color) && (
                                                <p className="text-xs text-slate-500">
                                                    {item.size && <span>Size: {item.size}</span>}
                                                    {item.size && item.color && <span> • </span>}
                                                    {item.color && <span>Color: {item.color}</span>}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium text-slate-900 whitespace-nowrap ml-4">
                                            {formatPrice((item.priceAtPurchase || 0) * (item.quantity || 1))}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-semibold text-slate-900">Total Paid</span>
                    <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(order.totalAmount)}
                    </span>
                </div>

                {/* WhatsApp Follow-up CTA */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Need to update your order?
                    </p>
                    <a
                        href={`https://wa.me/254799336502?text=Hello iDRIP, I have a question about order *${order.orderNumber}*. Please help.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 underline"
                    >
                        Chat on WhatsApp
                    </a>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button variant="outline" className="flex-1 gap-2" onClick={onNewSearch}>
                        <RefreshCw className="h-4 w-4" />
                        Track Another Order
                    </Button>
                    <Link href="/shop" className="flex-1">
                        <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}