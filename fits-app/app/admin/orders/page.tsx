'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrdersAction, deleteOrderAction } from '@/actions/order-actions';
import { Order } from '@/lib/types';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { Eye, Trash2, Search, RefreshCw, AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const ITEMS_PER_PAGE = 20;

export default function OrdersListPage() {
    const router = useRouter();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Delete confirmation
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Load orders
    const loadOrders = async () => {
        console.log('🔄 [CLIENT] Loading orders...');
        setLoading(true);
        setError(null);

        try {
            const data = await getOrdersAction();
            console.log(`✅ [CLIENT] Loaded ${data.length} orders`);
            setOrders(data);
        } catch (err) {
            console.error('❌ [CLIENT] Failed to load orders:', err);
            setError('Failed to load orders. Please refresh.');
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    // Filter orders
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerPhone?.includes(searchTerm);

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Format date
    const formatDate = (timestamp: any): string => {
        if (!timestamp) return 'N/A';
        try {
            const date = timestamp.toDate?.() || new Date(timestamp);
            return date.toLocaleDateString('en-KE', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
            });
        } catch {
            return 'Invalid date';
        }
    };

    // Delete handlers
    const handleDeleteClick = (order: Order) => {
        console.log('🗑️ [CLIENT] Delete clicked:', order.orderNumber);
        setOrderToDelete(order);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!orderToDelete) return;

        setIsDeleting(true);
        console.log('🗑️ [CLIENT] Confirming delete:', orderToDelete.orderNumber);

        try {
            const result = await deleteOrderAction(orderToDelete.id!);

            if (result.success) {
                console.log('✅ [CLIENT] Order deleted:', orderToDelete.orderNumber);
                toast.success('Order deleted', {
                    description: `${orderToDelete.orderNumber} has been removed.`,
                });
                loadOrders();
            } else {
                console.error('❌ [CLIENT] Delete failed:', result.error);
                toast.error('Delete failed', {
                    description: 'Could not delete order. Please try again.',
                });
            }
        } catch (err) {
            console.error('❌ [CLIENT] Delete error:', err);
            toast.error('Unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setOrderToDelete(null);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center space-y-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                    <p className="text-gray-600 font-medium">Loading orders...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Failed to load orders</h3>
                        <p className="text-gray-500 mt-1">{error}</p>
                    </div>
                    <Button onClick={loadOrders}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h2>
                    <p className="text-sm text-gray-500">
                        {orders.length} total • {filteredOrders.length} showing
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadOrders} disabled={loading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by order #, name, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-white"
                        aria-label="Search orders"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-white">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 ? (
                <div className="border rounded-lg bg-white p-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        {orders.length === 0 ? (
                            <Package className="h-8 w-8 text-gray-400" />
                        ) : (
                            <AlertCircle className="h-8 w-8 text-gray-400" />
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {orders.length === 0 ? 'No orders yet' : 'No matching orders'}
                    </h3>
                    <p className="text-gray-500 mt-1">
                        {orders.length === 0
                            ? 'Orders will appear here once customers start checking out.'
                            : 'Try adjusting your search or filters.'}
                    </p>
                    {orders.length === 0 && (
                        <Button className="mt-4" variant="outline" onClick={() => router.push('/admin/products')}>
                            Add Products First
                        </Button>
                    )}
                </div>
            ) : (
                /* Orders Table */
                <PaginationWrapper totalItems={filteredOrders.length} itemsPerPage={ITEMS_PER_PAGE}>
                    {({ startIndex, endIndex }) => {
                        const currentOrders = filteredOrders.slice(startIndex, endIndex);

                        return (
                            <div className="border rounded-lg bg-white overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead className="w-[140px]">Order #</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead className="hidden md:table-cell">Location</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="hidden sm:table-cell">Payment</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="hidden lg:table-cell">Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentOrders.map((order) => (
                                            <TableRow key={order.id} className="hover:bg-slate-50 transition-colors">
                                                {/* Order Number */}
                                                <TableCell>
                                                    <span className="font-mono font-bold text-blue-600 text-sm">
                                                        {order.orderNumber}
                                                    </span>
                                                </TableCell>

                                                {/* Customer */}
                                                <TableCell>
                                                    <div className="font-medium text-sm">{order.customerName}</div>
                                                    <div className="text-xs text-gray-500">{order.customerPhone}</div>
                                                </TableCell>

                                                {/* Location */}
                                                <TableCell className="hidden md:table-cell text-sm">
                                                    {order.customerLocation}
                                                </TableCell>

                                                {/* Total */}
                                                <TableCell className="text-right font-bold text-sm">
                                                    {order.currency || 'KSh'} {order.totalAmount?.toLocaleString()}
                                                </TableCell>

                                                {/* Payment Method */}
                                                <TableCell className="hidden sm:table-cell">
                                                    <Badge variant="outline" className="uppercase text-xs">
                                                        {order.paymentMethod}
                                                    </Badge>
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell>
                                                    <OrderStatusBadge status={order.status || 'pending'} showIcon={false} />
                                                </TableCell>

                                                {/* Date */}
                                                <TableCell className="hidden lg:table-cell text-xs text-gray-500">
                                                    {formatDate(order.createdAt)}
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Link href={`/admin/orders/${order.id}`}>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0"
                                                                title="View details"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteClick(order)}
                                                            title="Delete order"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        );
                    }}
                </PaginationWrapper>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-5 w-5 text-red-600" />
                            Delete Order
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete order{' '}
                            <span className="font-mono font-bold">{orderToDelete?.orderNumber}</span>?
                            <br />
                            <span className="text-red-600 font-medium">This action cannot be undone.</span>
                        </DialogDescription>
                    </DialogHeader>

                    {orderToDelete && (
                        <div className="py-4">
                            <div className="text-sm text-gray-500 space-y-1">
                                <p>
                                    <strong>Customer:</strong> {orderToDelete.customerName}
                                </p>
                                <p>
                                    <strong>Total:</strong> {orderToDelete.currency || 'KSh'}{' '}
                                    {orderToDelete.totalAmount?.toLocaleString()}
                                </p>
                                <p>
                                    <strong>Status:</strong> {orderToDelete.status}
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    Yes, Delete
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}