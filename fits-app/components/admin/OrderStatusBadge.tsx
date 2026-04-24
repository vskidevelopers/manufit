// components/admin/orders/OrderStatusBadge.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

interface Props {
    status: OrderStatus;
    className?: string;
    showIcon?: boolean;
}

const CONFIG: Record<OrderStatus, { label: string; className: string; icon: React.ElementType }> = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200', icon: Clock },
    processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800 hover:bg-blue-200', icon: Truck },
    completed: { label: 'Completed', className: 'bg-green-100 text-green-800 hover:bg-green-200', icon: CheckCircle },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 hover:bg-red-200', icon: XCircle },
};

export function OrderStatusBadge({ status, className = '', showIcon = true }: Props) {
    const config = CONFIG[status];
    const Icon = config.icon;

    return (
        <Badge variant="secondary" className={`${config.className} gap-1.5 font-medium ${className}`}>
            {showIcon && <Icon size={14} strokeWidth={2} />}
            {config.label}
        </Badge>
    );
}