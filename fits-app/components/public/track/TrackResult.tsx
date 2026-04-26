// components/public/track/TrackResult.tsx
'use client';

import { Order } from '@/lib/types';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Phone, MapPin, } from 'lucide-react';

interface TrackResultProps {
    order: Order;
    onNewSearch: () => void;
}

export function TrackResult({ order, onNewSearch }: TrackResultProps) {
    const formatDate = (timestamp: any): string => {
        if (!timestamp) return 'N/A';
        try {
            const date = timestamp.toDate?.() || new Date(timestamp);
            return date.toLocaleDateString('en-KE', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
            });
        } catch {
            return 'Invalid date';
        }
    };

    const formatPrice = (amount: number) => `KSh ${amount.toLocaleString()}`;

    // Status timeline mapping
    const getStatusStep = (status: string) => {
        const steps = ['pending', 'processing', 'completed', 'cancelled'];
        return steps.indexOf(status);
    };

    const currentStep = getStatusStep(order.status || 'pending');

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

            {/* Success Header */}
            <div className="bg-green-50 border-b border-green-200 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Order Found!</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Order <code className="bg-white px-2 py-0.5 rounded font-mono">{order.orderNumber}</code>
                </p>
            </div>

            <div className="p-6 space-y-6">

                {/* Status Badge + Timeline */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">Current Status</span>
                        <OrderStatusBadge status={order?.status || "pending"} showIcon className='' />
                    </div>

                    {/* Simple Progress Bar */}
                    <div className="relative">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${Math.min((currentStep + 1) * 33, 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-500">
                            <span>Ordered</span>
                            <span>Processing</span>
                            <span>Completed</span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Order Details */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Order Details</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <div>
                                <p className="text-slate-500">Order Date</p>
                                <p className="font-medium">{formatDate(order.createdAt)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <div>
                                <p className="text-slate-500">Phone</p>
                                <p className="font-medium">{order.customerPhone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <div>
                                <p className="text-slate-500">Location</p>
                                <p className="font-medium">{order.customerLocation}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="uppercase">
                                {order.paymentMethod}
                            </Badge>
                            <div>
                                <p className="text-slate-500">Payment</p>
                                <p className="font-medium">{order.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Summary */}
                {order?.items?.length || 0 > 0 && (
                    <>
                        <Separator />
                        <div className="space-y-3">
                            <h3 className="font-semibold text-slate-900">Items ({order?.items?.length})</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {order?.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-slate-600">
                                            {item.productName}
                                            {(item.size || item.color) && (
                                                <span className="text-slate-400">
                                                    {' '}• {item.size}{item.size && item.color && ' / '}{item.color}
                                                </span>
                                            )}
                                            <span className="text-slate-400"> × {item.quantity}</span>
                                        </span>
                                        <span className="font-medium">
                                            {formatPrice((item.priceAtPurchase || 0) * (item.quantity || 1))}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(order.totalAmount || 0)}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button variant="outline" className="flex-1" onClick={onNewSearch}>
                        Track Another Order
                    </Button>
                    <a href="/contact">
                        <Button variant="default" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Need Help? Contact Us
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
}