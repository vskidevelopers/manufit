// components/public/track/TrackResult.tsx
'use client';

import { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle, Package, Truck, Calendar, Phone, MapPin,
    RefreshCw, MessageCircle, CreditCard, ShoppingBag, Clock
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

    // Fulfillment info helper (Zero Fee Logic)
    const getFulfillmentInfo = () => {
        if (order.fulfillment.method === 'delivery') {
            return {
                icon: <Truck className="h-4 w-4 text-blue-600" />,
                label: 'Delivery',
                detail: order.fulfillment.location || 'Location to be confirmed',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                textColor: 'text-blue-800'
            };
        }
        return {
            icon: <Package className="h-4 w-4 text-slate-600" />,
            label: 'Pickup',
            detail: 'Collect from our Nairobi hub',
            bgColor: 'bg-slate-50',
            borderColor: 'border-slate-200',
            textColor: 'text-slate-800'
        };
    };

    const fulfillmentInfo = getFulfillmentInfo();

    // Payment method display
    const getPaymentDisplay = () => {
        if (order.payment.method === 'pay_now') {
            return {
                icon: <CreditCard className="h-4 w-4 text-green-600" />,
                label: 'M-Pesa (Pay Now)',
                detail: order.payment.mpesaCode ? `Code: ${order.payment.mpesaCode}` : 'Code pending',
                statusColor: order.payment.status === 'paid' || order.payment.status === 'verified' ? 'text-green-600' : 'text-orange-600'
            };
        }
        return {
            icon: <Clock className="h-4 w-4 text-blue-600" />,
            label: 'Pay Later',
            detail: 'We will confirm payment details via WhatsApp',
            statusColor: 'text-blue-600'
        };
    };

    const paymentDisplay = getPaymentDisplay();

    // Status timeline steps (Fulfillment focused)
    const statusSteps = [
        { key: 'pending', label: 'Placed', icon: Package },
        { key: 'processing', label: 'Processing', icon: ShoppingBag },
        { key: 'dispatched', label: 'Dispatched', icon: Truck },
        { key: 'completed', label: 'Completed', icon: CheckCircle },
    ];

    // Map status to step index
    const currentStepIndex = statusSteps.findIndex(s => s.key === order.fulfillment.status);
    const progressWidth = currentStepIndex === -1 ? 0 : Math.min(((currentStepIndex + 1) / statusSteps.length) * 100, 100);

    // Dynamic WhatsApp message
    const waMessage = `Hello iDRIP, I'm tracking order *${order.orderNumber}*. I chose ${order.fulfillment.method} and ${order.payment.method === 'pay_now' ? 'paid via M-Pesa' : 'will pay later'}. Please update me on the status.`;
    const waLink = `https://wa.me/254706406009?text=${encodeURIComponent(waMessage)}`;

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
                        <span className="text-sm font-medium text-slate-600">Fulfillment Status</span>
                        <Badge className="capitalize bg-blue-100 text-blue-800 hover:bg-blue-100">
                            {order.fulfillment.status}
                        </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${progressWidth}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-500">
                            {statusSteps.map((step, idx) => {
                                const Icon = step.icon;
                                const isActive = idx <= currentStepIndex;
                                return (
                                    <span key={step.key} className={`flex items-center gap-1 ${isActive ? 'text-blue-600 font-medium' : ''}`}>
                                        <Icon className="h-3 w-3" />
                                        <span className="hidden sm:inline">{step.label}</span>
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
                                <p className="font-medium text-slate-900">{order.customer.phone}</p>
                            </div>
                        </div>

                        {/* Fulfillment Method & Location */}
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            {fulfillmentInfo.icon}
                            <div>
                                <p className="text-slate-500 text-xs">Fulfillment</p>
                                <p className="font-medium text-slate-900">{fulfillmentInfo.label}</p>
                                {order.fulfillment.method === 'delivery' && order.fulfillment.location && (
                                    <p className="text-xs text-slate-500 truncate max-w-[150px]" title={order.fulfillment.location}>
                                        {order.fulfillment.location}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            {paymentDisplay.icon}
                            <div>
                                <p className="text-slate-500 text-xs">Payment</p>
                                <p className={`font-medium ${paymentDisplay.statusColor}`}>{paymentDisplay.label}</p>
                                {order.payment.method === 'pay_now' && order.payment.mpesaCode && (
                                    <p className="text-xs text-green-600 font-mono">{paymentDisplay.detail}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fulfillment Info Card (Zero Fee) */}
                <div className={`p-4 rounded-lg border ${fulfillmentInfo.bgColor} ${fulfillmentInfo.borderColor}`}>
                    <div className="flex items-start gap-3">
                        {fulfillmentInfo.icon}
                        <div className="flex-1">
                            <p className={`font-medium ${fulfillmentInfo.textColor}`}>{fulfillmentInfo.label}</p>
                            <p className="text-sm text-slate-600 mt-0.5">{fulfillmentInfo.detail}</p>
                            {order.fulfillment.method === 'delivery' && (
                                <p className="text-xs text-slate-500 mt-1 italic">
                                    Our team will WhatsApp you to confirm the exact courier details.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Items Summary (With Images & Category) */}
                {order.items && order.items.length > 0 && (
                    <>
                        <Separator />
                        <div className="space-y-3">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4" />
                                Items ({order.items.length})
                            </h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 items-start text-sm p-2 hover:bg-slate-50 rounded">
                                        {/* Thumbnail */}
                                        <div className="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400">No img</div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-medium text-slate-900 truncate">{item.name}</p>
                                                {item.category && (
                                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 capitalize">{item.category}</Badge>
                                                )}
                                            </div>
                                            {(item.size || item.color) && (
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {item.size && <span>Size: {item.size}</span>}
                                                    {item.size && item.color && <span> • </span>}
                                                    {item.color && <span>Color: {item.color}</span>}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                                        </div>

                                        {/* Price */}
                                        <p className="font-medium text-slate-900 whitespace-nowrap ml-2">
                                            {formatPrice((item.price || 0) * (item.quantity || 1))}
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
                    <span className="text-lg font-semibold text-slate-900">Order Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(order.totals.grandTotal)}
                    </span>
                </div>

                {/* WhatsApp Follow-up CTA */}
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">
                        <p className="text-sm font-medium text-green-900 mb-1 flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Need to update your order?
                        </p>
                        <p className="text-xs text-green-700">
                            Chat with us on WhatsApp for instant support.
                        </p>
                    </div>
                </a>

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