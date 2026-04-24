// components/admin/orders/OrderCustomerInfo.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/lib/types';
import { Phone, MapPin, User } from 'lucide-react';

interface Props {
    order: Order;
    compact?: boolean;
}

export function OrderCustomerInfo({ order, compact = false }: Props) {
    return (
        <Card>
            <CardHeader className={compact ? 'pb-3' : 'pb-4'}>
                <CardTitle className={compact ? 'text-base' : 'text-lg'}>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <User size={14} />
                            <span>Name</span>
                        </div>
                        <p className="font-medium">{order.customerName}</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Phone size={14} />
                            <span>Phone</span>
                        </div>
                        <p className="font-medium">{order.customerPhone}</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={14} />
                            <span>Location</span>
                        </div>
                        <p className="font-medium">{order.customerLocation}</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="text-xs">Payment</span>
                        </div>
                        <Badge variant="outline" className="uppercase">
                            {order.paymentMethod}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}