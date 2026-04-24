'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderAction, updateOrderStatusAction } from '@/actions/order-actions';
import { Order, OrderStatus } from '@/lib/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { OrderItemsTable } from '@/components/admin/OrderItemsTable';
import { OrderSummaryCard } from '@/components/admin/OrderSummaryCard';
import { OrderCustomerInfo } from '@/components/admin/OrderCustomerInfo';
import { ArrowLeft, Copy, Printer, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Load order
    const loadOrder = async () => {
        console.log(`🔄 [CLIENT] Loading order ${id}...`);
        setLoading(true);
        setError(null);

        try {
            const data = await getOrderAction(id);
            if (data) {
                console.log(`✅ [CLIENT] Order loaded:`, data.orderNumber);
                setOrder(data);
            } else {
                console.warn('⚠️ [CLIENT] Order not found:', id);
                setError('Order not found');
                toast.error('Order not found');
                setTimeout(() => router.push('/admin/orders'), 2000);
            }
        } catch (err) {
            console.error(`❌ [CLIENT] Failed to load order ${id}:`, err);
            setError('Failed to load order details');
            toast.error('Failed to load order');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) loadOrder();
    }, [id]);

    // Copy order number
    const copyOrderNumber = async () => {
        if (!order?.orderNumber) return;
        await navigator.clipboard.writeText(order.orderNumber);
        console.log(`📋 [CLIENT] Copied order number: ${order.orderNumber}`);
        toast.success('Order number copied!', { description: order.orderNumber });
    };

    // Print order
    const printOrder = () => {
        console.log(`🖨️ [CLIENT] Printing order: ${order?.orderNumber}`);
        window.print();
    };

    // Update status
    const handleStatusUpdate = async (newStatus: string | undefined) => {

        if (!newStatus || !order || newStatus === order.status) return;

        // ✅ Type assertion: We know it's a valid Order['status'] from the Select options
        const status = newStatus as Order['status'];

        setUpdatingStatus(true);
        console.log(`🔄 [CLIENT] Updating status: ${order.status} → ${status}`);

        try {
            // ✅ Now order.id! and status are both concrete strings
            const result = await updateOrderStatusAction(order.id!, newStatus as OrderStatus);

            if (result.success) {
                console.log(`✅ [CLIENT] Status updated successfully`);
                toast.success('Status updated', {
                    description: `Order is now ${status}`,
                });
                loadOrder();
            } else {
                console.error('❌ [CLIENT] Status update failed:', result.error);
                toast.error('Failed to update status');
            }
        } catch (err) {
            console.error('❌ [CLIENT] Status update error:', err);
            toast.error('Unexpected error occurred');
        } finally {
            setUpdatingStatus(false);
        }
    };

    // Format date
    const formatDate = (timestamp: any): string => {
        if (!timestamp) return 'N/A';
        try {
            const date = timestamp.toDate?.() || new Date(timestamp);
            return date.toLocaleString('en-KE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return 'Invalid date';
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center space-y-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                    <p className="text-gray-600 font-medium">Loading order details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !order) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {error === 'Order not found' ? 'Order Not Found' : 'Failed to Load'}
                        </h3>
                        <p className="text-gray-500 mt-1">
                            {error || 'The requested order could not be found.'}
                        </p>
                    </div>
                    <div className="flex gap-2 justify-center">
                        <Button variant="outline" onClick={() => router.push('/admin/orders')}>
                            Back to Orders
                        </Button>
                        <Button onClick={loadOrder}>Try Again</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/admin/orders">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft size={20} />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Order Details</h2>
                        <p className="text-sm text-gray-500 font-mono">{order.orderNumber}</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={copyOrderNumber}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy #
                    </Button>
                    <Button variant="outline" size="sm" onClick={printOrder}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                    <Button variant="outline" size="sm" onClick={loadOrder} disabled={loading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Status Update Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                        <span>Order Status</span>
                        <OrderStatusBadge status={order.status || 'pending'} />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Select
                            value={order.status}
                            onValueChange={(val) => handleStatusUpdate(val)}
                            disabled={updatingStatus}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        {updatingStatus && (
                            <span className="text-sm text-gray-500">Updating...</span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Customer + Items */}
                <div className="lg:col-span-2 space-y-6">
                    <OrderCustomerInfo order={order} />

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Order Items ({order.items?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <OrderItemsTable items={order.items || []} />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Summary */}
                <div className="space-y-6">
                    <OrderSummaryCard order={order} showStatus={false} />

                    {/* Timeline / Metadata */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Order Timeline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Created</span>
                                <span className="font-medium">{formatDate(order.createdAt)}</span>
                            </div>
                            {order.updatedAt && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Last Updated</span>
                                    <span className="font-medium">{formatDate(order.updatedAt)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Current Status</span>
                                <span className="font-medium capitalize">{order.status}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}