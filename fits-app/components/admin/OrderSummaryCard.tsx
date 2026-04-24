// components/admin/orders/OrderSummaryCard.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Order } from '@/lib/types';

interface Props {
    order: Order;
    showStatus?: boolean;
    compact?: boolean;
}

export function OrderSummaryCard({ order, showStatus = true, compact = false }: Props) {
    const formatDate = (ts: any) => {
        if (!ts) return 'N/A';
        const date = ts.toDate?.() || new Date(ts);
        return date.toLocaleString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
        });
    };

    return (
        <Card>
            <CardHeader className={compact ? 'pb-3' : 'pb-4'}>
                <CardTitle className={`flex items-center justify-between ${compact ? 'text-base' : 'text-lg'}`}>
                    <span>Order Summary</span>
                    {showStatus && <OrderStatusBadge status={order.status || 'pending'} />}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{order.currency || 'KSh'} {order.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery</span>
                    <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{order.currency || 'KSh'} {order.totalAmount?.toLocaleString()}</span>
                </div>

                <div className="pt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Payment Method</span>
                        <Badge variant="outline" className="uppercase">
                            {order.paymentMethod}
                        </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Order Date</span>
                        <span className="font-medium">{formatDate(order.createdAt)}</span>
                    </div>
                    {order.orderNumber && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Order Number</span>
                            <span className="font-mono font-medium">{order.orderNumber}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}