// app/admin/orders/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderAction, updateFulfillmentStatusAction, updatePaymentStatusAction } from '@/actions/order-actions';
import { Order, FulfillmentStatus, PaymentStatus } from '@/lib/types';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    ArrowLeft, Copy, Printer, RefreshCw, AlertCircle,
    User, MapPin, CreditCard, ShoppingBag, Truck
} from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [updatingFulfillment, setUpdatingFulfillment] = useState(false);
    const [updatingPayment, setUpdatingPayment] = useState(false);

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
        toast.success('Order number copied!', { description: order.orderNumber });
    };

    // Print order
    const printOrder = () => window.print();

    // Update Fulfillment Status
    const handleFulfillmentUpdate = async (newStatus: string) => {
        if (!order || newStatus === order.fulfillment.status) return;
        setUpdatingFulfillment(true);
        try {
            const result = await updateFulfillmentStatusAction(order.id, newStatus as FulfillmentStatus);
            if (result.success) {
                toast.success('Fulfillment updated', { description: `Status is now ${newStatus}` });
                loadOrder();
            } else {
                toast.error('Failed to update fulfillment');
            }
        } catch (err) {
            toast.error('Unexpected error');
        } finally {
            setUpdatingFulfillment(false);
        }
    };

    // Update Payment Status
    const handlePaymentUpdate = async (newStatus: string) => {
        if (!order || newStatus === order.payment.status) return;
        setUpdatingPayment(true);
        try {
            const result = await updatePaymentStatusAction(order.id, newStatus as PaymentStatus);
            if (result.success) {
                toast.success('Payment updated', { description: `Status is now ${newStatus}` });
                loadOrder();
            } else {
                toast.error('Failed to update payment');
            }
        } catch (err) {
            toast.error('Unexpected error');
        } finally {
            setUpdatingPayment(false);
        }
    };

    // Format date (Handles ISO strings)
    const formatDate = (dateStr: string): string => {
        if (!dateStr) return 'N/A';
        try {
            return new Date(dateStr).toLocaleString('en-KE', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
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
                    <h3 className="text-lg font-semibold text-gray-900">{error || 'Order Not Found'}</h3>
                    <div className="flex gap-2 justify-center">
                        <Button variant="outline" onClick={() => router.push('/admin/orders')}>Back to Orders</Button>
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
                        <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Order Details</h2>
                        <p className="text-sm text-gray-500 font-mono">{order.orderNumber}</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={copyOrderNumber}><Copy className="mr-2 h-4 w-4" /> Copy #</Button>
                    <Button variant="outline" size="sm" onClick={printOrder}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                    <Button variant="outline" size="sm" onClick={loadOrder}><RefreshCw className="mr-2 h-4 w-4" /> Refresh</Button>
                </div>
            </div>

            {/* Dual Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fulfillment Status */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                            <span className="flex items-center gap-2"><Truck className="h-5 w-5 text-blue-600" /> Fulfillment</span>
                            <Badge className="capitalize bg-blue-100 text-blue-800 hover:bg-blue-100">{order.fulfillment.status}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select value={order.fulfillment.status} onValueChange={handleFulfillmentUpdate} disabled={updatingFulfillment}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="dispatched">Dispatched</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Payment Status */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                            <span className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-green-600" /> Payment</span>
                            <Badge className={`capitalize ${order.payment.status === 'paid' || order.payment.status === 'verified'
                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                : 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                                }`}>
                                {order.payment.status}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select value={order.payment.status} onValueChange={handlePaymentUpdate} disabled={updatingPayment}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Details & Items */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Customer Info (Inlined) */}
                    <Card>
                        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5" /> Customer Details</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><strong>Name:</strong> {order.customer.name}</p>
                            <p><strong>Phone:</strong> {order.customer.phone}</p>
                            {order.customer.email && <p><strong>Email:</strong> {order.customer.email}</p>}
                        </CardContent>
                    </Card>

                    {/* Fulfillment Details (Inlined) */}
                    <Card>
                        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-5 w-5" /> Fulfillment Details</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><strong>Method:</strong> <Badge variant={order.fulfillment.method === 'delivery' ? 'default' : 'secondary'}>{order.fulfillment.method}</Badge></p>
                            {order.fulfillment.method === 'delivery' && order.fulfillment.location && (
                                <p><strong>Location:</strong> {order.fulfillment.location}</p>
                            )}
                            {order.fulfillment.method === 'pickup' && (
                                <p className="text-gray-500 italic">Customer will collect from our Nairobi hub.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Details (Inlined) */}
                    <Card>
                        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CreditCard className="h-5 w-5" /> Payment Details</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><strong>Method:</strong> <Badge variant="outline">{order.payment.method === 'pay_now' ? 'Pay Now (M-Pesa)' : 'Pay Later'}</Badge></p>
                            {order.payment.method === 'pay_now' && (
                                <>
                                    <p><strong>Till Number:</strong> <span className="font-mono">{order.payment.tillNumber}</span></p>
                                    <p><strong>M-Pesa Code:</strong> <span className="font-mono font-bold text-blue-600">{order.payment.mpesaCode || 'Not provided'}</span></p>
                                </>
                            )}
                            {order.payment.method === 'pay_later' && (
                                <p className="text-gray-500 italic">Customer will pay via WhatsApp/Call confirmation.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Items Table (Enhanced with Images & Category) */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" />
                                Order Items ({order.items.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-6">

                            {/* Mobile View (Stacked Cards) */}
                            <div className="sm:hidden divide-y">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="p-4 flex gap-3">
                                        {/* Thumbnail */}
                                        <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400">No img</div>
                                            )}
                                        </div>
                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-medium text-sm text-slate-900 truncate">{item.name}</p>
                                                {item.category && (
                                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 capitalize">{item.category}</Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {item.size && `Size: ${item.size}`} {item.size && item.color && '•'} {item.color && `Color: ${item.color}`}
                                            </p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                                <span className="font-bold text-sm text-blue-600">KSh {(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop View (Table) */}
                            <div className="hidden sm:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead className="text-center">Qty</TableHead>
                                            <TableHead className="text-right">Unit Price</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.items.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {/* Thumbnail */}
                                                        <div className="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                                                            {item.image ? (
                                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400">
                                                                    No img
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Details */}
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-slate-900 text-sm">{item.name}</span>
                                                                {item.category && (
                                                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 capitalize">
                                                                        {item.category}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-0.5">
                                                                {item.size && <span>Size: {item.size}</span>}
                                                                {item.size && item.color && <span> • </span>}
                                                                {item.color && <span>Color: {item.color}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                                                <TableCell className="text-right text-gray-600">KSh {item.price.toLocaleString()}</TableCell>
                                                <TableCell className="text-right font-bold text-blue-600">KSh {(item.price * item.quantity).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Summary & Timeline */}
                <div className="space-y-6">

                    {/* Order Summary (Inlined) */}
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Order Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium">KSh {order.totals.subtotal.toLocaleString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-blue-600">KSh {order.totals.grandTotal.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Timeline</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Created</span>
                                <span className="font-medium">{formatDate(order.createdAt)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Fulfillment</span>
                                <Badge className="capitalize bg-blue-100 text-blue-800 hover:bg-blue-100">{order.fulfillment.status}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Payment</span>
                                <Badge className={`capitalize ${order.payment.status === 'paid' || order.payment.status === 'verified'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                    : 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                                    }`}>
                                    {order.payment.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}