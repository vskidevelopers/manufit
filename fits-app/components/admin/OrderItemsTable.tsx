// components/admin/orders/OrderItemsTable.tsx
'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { OrderItem } from '@/lib/types';

interface Props {
    items: OrderItem[];
    currency?: string;
    compact?: boolean;
}

export function OrderItemsTable({ items, currency = 'KSh', compact = false }: Props) {
    if (!items?.length) {
        return <p className="text-gray-500 text-center py-8">No items in this order.</p>;
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50">
                        <TableHead className={compact ? 'py-2' : 'py-3'}>Product</TableHead>
                        <TableHead className={compact ? 'py-2' : 'py-3'}>Details</TableHead>
                        <TableHead className={`text-right ${compact ? 'py-2' : 'py-3'}`}>Qty</TableHead>
                        <TableHead className={`text-right ${compact ? 'py-2' : 'py-3'}`}>Price</TableHead>
                        <TableHead className={`text-right ${compact ? 'py-2' : 'py-3'}`}>Subtotal</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, idx) => (
                        <TableRow key={idx} className={compact ? 'border-b last:border-0' : ''}>
                            <TableCell className={compact ? 'py-2 font-medium' : 'py-3 font-medium'}>
                                {item.productName}
                            </TableCell>
                            <TableCell className={compact ? 'py-2' : 'py-3'}>
                                <span className="text-sm text-gray-500">
                                    {item.size && <span className="mr-2">Size: {item.size}</span>}
                                    {item.color && <span>Color: {item.color}</span>}
                                </span>
                            </TableCell>
                            <TableCell className={`text-right ${compact ? 'py-2' : 'py-3'}`}>{item.quantity}</TableCell>
                            <TableCell className={`text-right ${compact ? 'py-2' : 'py-3'}`}>
                                {currency} {item.priceAtPurchase.toLocaleString()}
                            </TableCell>
                            <TableCell className={`text-right font-medium ${compact ? 'py-2' : 'py-3'}`}>
                                {currency} {(item.quantity * item.priceAtPurchase).toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}