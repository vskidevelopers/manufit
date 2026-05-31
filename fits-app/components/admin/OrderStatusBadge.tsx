// components/admin/orders/OrderStatusBadge.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

interface Props {
    status?: OrderStatus;  // ✅ Make optional
    className?: string;
    showIcon?: boolean;
    size?: string
}

const CONFIG: Record<OrderStatus, { label: string; className: string; icon: React.ElementType }> = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200', icon: Clock },
    processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800 hover:bg-blue-200', icon: Truck },
    completed: { label: 'Completed', className: 'bg-green-100 text-green-800 hover:bg-green-200', icon: CheckCircle },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 hover:bg-red-200', icon: XCircle },
};

export function OrderStatusBadge({ status = 'pending', className = '', showIcon = true }: Props) {
    // ✅ Default to 'pending' if undefined
    const config = CONFIG[status];
    const Icon = config.icon;

    return (
        <Badge variant="secondary" className={`${config.className} gap-1.5 font-medium ${className}`}>
            {showIcon && <Icon size={14} strokeWidth={2} />}
            {config.label}
        </Badge>
    );
}